<?php

namespace Tests\Feature;

use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Tests\TestCase;
use Tests\UsesProtectedGraphqlEndpoint;

class GovEmployeeDetailsTest extends TestCase
{
    use MakesGraphQLRequests;
    use RefreshDatabase;
    use RefreshesSchemaCache;
    use UsesProtectedGraphqlEndpoint;

    private User $baseUser;

    private string $query = <<<'GRAPHQL'
        query govEmployee($workEmail: String!) {
            govEmployee(workEmail: $workEmail) { id }
        }
    GRAPHQL;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);

        $this->baseUser = User::factory()
            ->asApplicant()
            ->create();
    }

    public function testVerifiedGovernmentEmployeeDetailsAvailable()
    {
        $email = 'employee@gc.ca';
        $testUser = User::factory()
            ->asGovEmployee()
            ->create(['work_email' => $email]);

        $this->actingAs($this->baseUser, 'api')
            ->graphQL($this->query, [
                'workEmail' => $email,
            ])->assertJson([
                'data' => [
                    'govEmployee' => [
                        'id' => $testUser->id,
                    ],
                ],
            ]);
    }

    public function testUnverifiedGovernmentEmployeeDetailsNotAvailable()
    {
        $email = 'employee@gc.ca';
        User::factory()
            ->asGovEmployee()
            ->create(['work_email' => $email, 'work_email_verified_at' => null]);

        $this->actingAs($this->baseUser, 'api')
            ->graphQL($this->query, [
                'workEmail' => $email,
            ])->assertJson([
                'data' => [
                    'govEmployee' => null,
                ],
            ]);
    }
}
