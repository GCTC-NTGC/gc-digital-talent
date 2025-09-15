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
        employeeWFAPaginated {
            data {
                id
                interest { value }
                date
                updatedAt
            }
        }
    }
    GRAPHQL;

    protected $mutation = <<<'GRAPHQL'
    mutation UpdateEmployeeWFA($id: UUID!, $employeeWFA: UpdateEmployeeWFA!) {
        updateEmployeeWFA(id: $id, employeeWFA: $employeeWFA) {
            id
            interest { value }
            date
            updatedAt
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
                    'interest' => WFAInterest::LETTER_RECEIVED->name,
                    'date' => $futureDate,
                ],
            ])->assertJsonFragment([
                'interest' => [
                    'value' => WFAInterest::LETTER_RECEIVED->name,
                ],
                'date' => $futureDate,
            ]);
    }

    public function test_updated_at_set()
    {
        $beforeRes = $this->actingAs($this->employee, 'api')
            ->graphQL($this->mutation, [
                'id' => $this->employee->id,
                'employeeWFA' => [
                    'id' => $this->employee->id,
                    'interest' => WFAInterest::LETTER_RECEIVED->name,
                ],
            ]);

        $before = Carbon::parse($beforeRes['data']['updateEmployeeWFA']['updatedAt']);

        // Sleep to prevent dates being exact
        sleep(1);

        $afterRes = $this->actingAs($this->employee, 'api')
            ->graphQL($this->mutation, [
                'id' => $this->employee->id,
                'employeeWFA' => [
                    'id' => $this->employee->id,
                    'interest' => WFAInterest::VOLUNTARY_DEPARTURE->name,
                ],
            ]);

        $after = Carbon::parse($afterRes['data']['updateEmployeeWFA']['updatedAt']);

        $this->assertTrue($after->greaterThan($before));
    }

    public function test_not_applicable_sets_date_to_null()
    {
        // Ensure we have a date to being with
        $this->employee->employeeWFA->wfa_date = config('constants.far_future_datetime');
        $this->employee->employeeWFA->save();

        $this->actingAs($this->employee, 'api')
            ->graphQL($this->mutation, [
                'id' => $this->employee->id,
                'employeeWFA' => [
                    'id' => $this->employee->id,
                    'interest' => null,
                ],
            ])->assertJsonFragment(['date' => null]);
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

        $recuiter = User::factory()
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

        $res = $this->actingAs($recuiter, 'api')
            ->graphQL($this->query);

        $results = $res->json('data.employeeWFAPaginated.data');
        // Expect 2 users, one from setup and one applied to community pool
        $this->assertCount(2, $results);
    }
}
