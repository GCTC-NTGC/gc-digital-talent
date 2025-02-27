<?php

namespace Tests\Feature;

use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Tests\TestCase;
use Tests\UsesProtectedGraphqlEndpoint;

class GovEmployeeProfileTest extends TestCase
{
    use MakesGraphQLRequests;
    use RefreshDatabase;
    use RefreshesSchemaCache;
    use UsesProtectedGraphqlEndpoint;

    private User $baseUser;

    private string $query = <<<'GRAPHQL'
        query GovEmployeeProfile($workEmail: String!) {
            govEmployeeProfile(workEmail: $workEmail) { id }
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
                    'govEmployeeProfile' => [
                        'id' => $testUser->id,
                    ],
                ],
            ]);
    }

    public function testCaseInsensitiveQuery()
    {
        $testUser = User::factory()
            ->asGovEmployee()
            ->create(['work_email' => 'mUlTiCasEEmaiL@Gc.Ca']);

        $this->actingAs($this->baseUser, 'api')
            ->graphQL($this->query, [
                'workEmail' => 'MuLtICaSeemAIl@gC.cA',
            ])->assertJson([
                'data' => [
                    'govEmployeeProfile' => [
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
                    'govEmployeeProfile' => null,
                ],
            ]);
    }
}
