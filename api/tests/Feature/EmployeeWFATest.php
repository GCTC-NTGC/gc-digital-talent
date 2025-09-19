<?php

namespace Tests\Feature;

use App\Enums\WFaInterest;
use App\Models\Community;
use App\Models\Pool;
use App\Models\PoolCandidate;
use App\Models\User;
use App\Models\WorkExperience;
use Carbon\Carbon;
use Database\Helpers\ApiErrorEnums;
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

    protected $userQuery = <<<'GRAPHQL'
    query User($id: UUID!) {
        user(id: $id) {
            employeeWFA { wfaInterest { value } }
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
    }

    public function testUserCanUpdateOwnWfa()
    {
        $futureDate = config('constants.far_future_date');
        $this->actingAs($this->employee, 'api')
            ->graphQL($this->mutation, [
                'id' => $this->employee->id,
                'employeeWFA' => [
                    'wfaInterest' => WFaInterest::LETTER_RECEIVED->name,
                    'wfaDate' => $futureDate,
                ],
            ])->assertJsonFragment([
                'wfaInterest' => [
                    'value' => WfaInterest::LETTER_RECEIVED->name,
                ],
                'wfaDate' => $futureDate,
            ]);
    }

    public function testUserCannotUpdateWithZeroSubstantiveExperiences()
    {
        $user = User::factory()->asApplicant()->create();

        $this->actingAs($user, 'api')
            ->graphQL($this->mutation, [
                'id' => $user->id,
                'employeeWFA' => [
                    'wfaInterest' => WfaInterest::LETTER_RECEIVED->name,
                ],
            ])->assertGraphQLValidationError('id', ApiErrorEnums::MISSING_SUBSTANTIVE_EXPERIENCE);
    }

    public function testUserCannotUpdateWithMoreThanOneSubstantiveExperiences()
    {
        $user = User::factory()->asApplicant()->create();

        WorkExperience::factory(2)
            ->asSubstantive()
            ->create([
                'user_id' => $user->id,
            ]);

        $res = $this->actingAs($user, 'api')
            ->graphQL($this->mutation, [
                'id' => $user->id,
                'employeeWFA' => [
                    'wfaInterest' => WfaInterest::LETTER_RECEIVED->name,
                ],
            ])->assertGraphQLValidationError('id', ApiErrorEnums::TOO_MANY_SUBSTANTIVE_EXPERIENCES);
    }

    public function testUpdatedAtSet()
    {
        // Mock date we expect to get after saving
        $nowInUtc = '2999-12-28 20:00:00';
        Carbon::setTestNow($nowInUtc);

        // Ensure interest is different
        $this->employee->wfa_interest = WfaInterest::NOT_SURE->name;
        $this->employee->save();

        $this->actingAs($this->employee, 'api')
            ->graphQL($this->mutation, [
                'id' => $this->employee->id,
                'employeeWFA' => [
                    'wfaInterest' => WfaInterest::VOLUNTARY_DEPARTURE->name,
                ],
            ])->assertJsonFragment([
                'wfaUpdatedAt' => $nowInUtc,
            ]);
    }

    public function testNotApplicableSetsDateToNull()
    {
        // Ensure we have a date to being with
        $this->employee->wfa_date = config('constants.far_future_date');
        $this->employee->save();

        $this->actingAs($this->employee, 'api')
            ->graphQL($this->mutation, [
                'id' => $this->employee->id,
                'employeeWFA' => [
                    'wfaInterest' => null,
                ],
            ])->assertJsonFragment(['wfaDate' => null]);
    }

    public function testPlatformAdminCanViewAny()
    {
        $admin = User::factory()
            ->asAdmin()
            ->create();

        $this->actingAs($admin, 'api')
            ->graphQL($this->query)
            ->assertJsonFragment(['id' => $this->employee->id]);
    }

    public function testCommunityRecruiterCanViewInCommunity()
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

    public function testCommunityRecruiterCannotViewOutsideCommunity()
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

    public function testCommunityRecruiterCannotQueryEmployeeWfaOutsideCommunity()
    {
        // Unrelated community
        $community = Community::factory()->create();

        $recruiter = User::factory()
            ->asCommunityRecruiter($community->id)
            ->create();

        $this->actingAs($recruiter, 'api')
            ->graphQL($this->userQuery, ['id' => $this->employee->id])
            ->assertGraphQLErrorMessage('This action is unauthorized.');
    }

    public function testCommunityRecruiterCanViewSpecificUserInCommunity()
    {
        $recruiter = User::factory()
            ->asCommunityRecruiter($this->community->id)
            ->create();

        $this->actingAs($recruiter, 'api')
            ->graphQL($this->userQuery, ['id' => $this->employee->id])
            ->assertJsonFragment(['employeeWFA' => ['wfaInterest' => ['value' => $this->employee->wfa_interest]]]);
    }

    public function testPlatformAdminCanViewSpecificUser()
    {
        $admin = User::factory()
            ->asAdmin()
            ->create();

        $this->actingAs($admin, 'api')
            ->graphQL($this->userQuery, ['id' => $this->employee->id])
            ->assertJsonFragment(['employeeWFA' => ['wfaInterest' => ['value' => $this->employee->wfa_interest]]]);
    }
}
