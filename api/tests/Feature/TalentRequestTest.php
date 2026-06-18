<?php

namespace Tests\Feature;

use App\Enums\TalentRequestPositionType;
use App\Enums\TalentRequestReason;
use App\Models\Community;
use App\Models\Department;
use App\Models\User;
use Database\Seeders\CommunitySeeder;
use Database\Seeders\DepartmentSeeder;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Tests\TestCase;
use Tests\UsesProtectedGraphqlEndpoint;

class TalentRequestTest extends TestCase
{
    use MakesGraphQLRequests;
    use RefreshDatabase;
    use RefreshesSchemaCache;
    use UsesProtectedGraphqlEndpoint;

    protected string $createMutation = <<<'GRAPHQL'
        mutation CreateTalentRequest($talentRequest: CreateTalentRequestInput!) {
            createTalentRequest(talentRequest: $talentRequest) {
                id
                fullName
                email
                user {
                    id
                }
            }
        }
        GRAPHQL;

    protected User $adminUser;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed([
            RolePermissionSeeder::class,
            DepartmentSeeder::class,
            CommunitySeeder::class,
        ]);

        $this->adminUser = User::factory()
            ->asApplicant()
            ->asAdmin()
            ->create([
                'email' => 'admin-user@test.com',
                'sub' => 'admin-user@test.com',
            ]);
    }

    /** @param array<mixed> $overrides */
    private function buildCreateInput(array $overrides = []): array
    {
        return array_merge([
            'fullName' => 'Test User',
            'email' => 'test@gc.ca',
            'jobTitle' => 'Job Title',
            'managerJobTitle' => 'Manager',
            'positionType' => TalentRequestPositionType::INDIVIDUAL_CONTRIBUTOR->name,
            'reason' => TalentRequestReason::GENERAL_INTEREST->name,
            'department' => ['connect' => Department::inRandomOrder()->first()->id],
            'community' => ['connect' => Community::inRandomOrder()->first()->id],
            'applicantFilter' => [
                'create' => [
                    'hasDiploma' => true,
                    'community' => ['connect' => Community::inRandomOrder()->first()->id],
                ],
            ],
        ], $overrides);
    }

    public function testCreateRequiresApplicantFilter(): void
    {
        $this->graphQL($this->createMutation, [
            'talentRequest' => $this->buildCreateInput(['applicantFilter' => null]),
        ])->assertJsonStructure(['errors']);
    }

    public function testCreateSucceedsWithAllRequiredFields(): void
    {
        $this->graphQL($this->createMutation, [
            'talentRequest' => $this->buildCreateInput(),
        ])
            ->assertGraphQLErrorFree()
            ->assertJsonFragment([
                'fullName' => 'Test User',
                'email' => 'test@gc.ca',
            ]);
    }

    public function testCreateRejectsNonGovernmentEmail(): void
    {
        $this->graphQL($this->createMutation, [
            'talentRequest' => $this->buildCreateInput(['email' => 'not-a-gov-email@example.com']),
        ])->assertGraphQLValidationKeys(['talentRequest.email']);
    }

    public function testUserIdIsNullForUnauthenticatedCreate(): void
    {
        $this->graphQL($this->createMutation, [
            'talentRequest' => $this->buildCreateInput(),
        ])
            ->assertGraphQLErrorFree()
            ->assertJsonFragment(['user' => null]);
    }

    public function testUserIdIsSetForAuthenticatedCreate(): void
    {
        $this->actingAs($this->adminUser, 'api')
            ->graphQL($this->createMutation, [
                'talentRequest' => $this->buildCreateInput(),
            ])
            ->assertGraphQLErrorFree()
            ->assertJsonFragment(['user' => ['id' => $this->adminUser->id]]);
    }
}
