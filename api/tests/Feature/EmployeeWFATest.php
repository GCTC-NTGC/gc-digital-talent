<?php

namespace Tests\Feature;

use App\Enums\WFAInterest;
use App\Models\Community;
use App\Models\Pool;
use App\Models\PoolCandidate;
use App\Models\User;
use App\Models\WorkExperience;
use Carbon\Carbon;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Tests\TestCase;
use Tests\UsesProtectedGraphqlEndpoint;

class EmployeeWFATest extends TestCase
{
    use MakesGraphQLRequests;
    use RefreshDatabase;
    use RefreshesSchemaCache;
    use UsesProtectedGraphqlEndpoint;

    protected User $employee;

    protected Community $community;

    protected $query = <<<'GRAPHQL'
    query EmployeeWFA {
        employeeWFAPaginatedAdminTable {
            data {
                id
                employeeWFA {
                    wfaInterest { value }
                    wfaDate
                    wfaUpdatedAt
                }
            }
        }
    }
    GRAPHQL;

    protected $mutation = <<<'GRAPHQL'
    mutation UpdateEmployeeWFA($id: UUID!, $employeeWFA: UpdateEmployeeWFAInput!) {
        updateEmployeeWFA(id: $id, employeeWFA: $employeeWFA) {
            id
            wfaInterest { value }
            wfaDate
            wfaUpdatedAt
        }
    }
    GRAPHQL;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);

        $this->community = Community::factory()->create();

        $this->employee = User::factory()
            ->asApplicant()
            ->withCommunityInterests([$this->community->id])
            ->asGovEmployee()
            ->create();

        // Ensure user has a substantive experience
        WorkExperience::factory()
            ->asSubstantive()
            ->create(['user_id' => $this->employee->id]);
    }

    public function test_user_can_update_own_wfa()
    {
        $futureDate = config('constants.far_future_datetime');
        $this->actingAs($this->employee, 'api')
            ->graphQL($this->mutation, [
                'id' => $this->employee->id,
                'employeeWFA' => [
                    'id' => $this->employee->id,
                    'wfaInterest' => WFAInterest::LETTER_RECEIVED->name,
                    'wfaDate' => $futureDate,
                ],
            ])->assertJsonFragment([
                'wfaInterest' => [
                    'value' => WFAInterest::LETTER_RECEIVED->name,
                ],
                'wfaDate' => $futureDate,
            ]);
    }

    public function test_updated_at_set()
    {
        $beforeRes = $this->actingAs($this->employee, 'api')
            ->graphQL($this->mutation, [
                'id' => $this->employee->id,
                'employeeWFA' => [
                    'id' => $this->employee->id,
                    'wfaInterest' => WFAInterest::LETTER_RECEIVED->name,
                ],
            ]);

        $before = Carbon::parse($beforeRes['data']['updateEmployeeWFA']['wfaUpdatedAt']);

        // Sleep to prevent dates being exact
        sleep(1);

        $afterRes = $this->actingAs($this->employee, 'api')
            ->graphQL($this->mutation, [
                'id' => $this->employee->id,
                'employeeWFA' => [
                    'id' => $this->employee->id,
                    'wfaInterest' => WFAInterest::VOLUNTARY_DEPARTURE->name,
                ],
            ]);

        $after = Carbon::parse($afterRes['data']['updateEmployeeWFA']['wfaUpdatedAt']);

        $this->assertTrue($after->greaterThan($before));
    }

    public function test_not_applicable_sets_date_to_null()
    {
        // Ensure we have a date to being with
        $this->employee->wfa_date = config('constants.far_future_datetime');
        $this->employee->save();

        $this->actingAs($this->employee, 'api')
            ->graphQL($this->mutation, [
                'id' => $this->employee->id,
                'employeeWFA' => [
                    'id' => $this->employee->id,
                    'wfaInterest' => null,
                ],
            ])->assertJsonFragment(['wfaDate' => null]);
    }

    public function test_platform_admin_can_view_any()
    {
        $admin = User::factory()
            ->asAdmin()
            ->create();

        $this->actingAs($admin, 'api')
            ->graphQL($this->query)
            ->assertJsonFragment(['id' => $this->employee->id]);
    }

    public function test_community_recruiter_can_view_in_community()
    {
        // Unrelated user who should not appear
        User::factory()
            ->asApplicant()
            ->asGovEmployee()
            ->create();

        $recruiter = User::factory()
            ->asCommunityRecruiter($this->community->id)
            ->create();

        $pool = Pool::factory()
            ->published()
            ->create(['community_id' => $this->community->id]);

        // No community interest but will apply to pool
        $user = User::factory()
            ->asApplicant()
            ->asGovEmployee()
            ->create();

        PoolCandidate::factory()
            ->availableInSearch()
            ->create([
                'pool_id' => $pool->id,
                'user_id' => $user->id,
                'submitted_at' => config('constants.past_datetime'),
            ]);

        $res = $this->actingAs($recruiter, 'api')
            ->graphQL($this->query);

        $results = $res->json('data.employeeWFAPaginatedAdminTable.data');
        // Expect 1 users, filters out unrelated communities and those who have applied to community process
        $this->assertCount(1, $results);
    }

    public function test_community_recruiter_cannot_view_outside_community()
    {
        // No community interest but will apply to pool
        $user = User::factory()
            ->asApplicant()
            ->asGovEmployee()
            ->create();

        $pool = Pool::factory()
            ->published()
            ->create(['community_id' => $this->community->id]);

        PoolCandidate::factory()
            ->availableInSearch()
            ->create([
                'pool_id' => $pool->id,
                'user_id' => $user->id,
                'submitted_at' => config('constants.past_datetime'),
            ]);

        // Unrelated community
        $community = Community::factory()->create();

        $recruiter = User::factory()
            ->asCommunityRecruiter($community->id)
            ->create();

        $res = $this->actingAs($recruiter, 'api')
            ->graphQL($this->query);

        $results = $res->json('data.employeeWFAPaginatedAdminTable.data');
        // Expect 0 users since this user is not part of any related communities
        $this->assertCount(0, $results);
    }

    public function test_community_recruiter_cannot_query_employee_wfa_outside_community()
    {
        // Unrelated community
        $community = Community::factory()->create();

        $recruiter = User::factory()
            ->asCommunityRecruiter($community->id)
            ->create();

        $this->actingAs($recruiter, 'api')
            ->graphQL(<<<'GRAPHQL'
                query User($id: UUID!) {
                    user(id: $id) {
                        employeeWFA { wfaDate }
                    }
                }
                GRAPHQL, [
                'id' => $this->employee->id,
            ])
            ->assertGraphQLErrorMessage('This action is unauthorized.');
    }
}
