<?php

namespace Tests\Feature;

use App\Enums\WFAInterest;
use App\Models\Community;
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
}
