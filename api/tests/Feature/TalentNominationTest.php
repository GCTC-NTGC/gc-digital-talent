<?php

namespace Tests\Feature;

use App\Models\TalentNomination;
use App\Models\TalentNominationEvent;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Database\Seeders\SkillFamilySeeder;
use Database\Seeders\SkillSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Tests\TestCase;
use Tests\UsesProtectedGraphqlEndpoint;

class TalentNominationTest extends TestCase
{
    use MakesGraphQLRequests;
    use RefreshDatabase;
    use RefreshesSchemaCache;
    use UsesProtectedGraphqlEndpoint;

    protected $employee1;

    protected $employee2;

    protected $nonEmployee1;

    protected $createMutation = <<<'GRAPHQL'
    mutation CreateTalentNomination($talentNomination: CreateTalentNominationInput!) {
        createTalentNomination(talentNomination: $talentNomination) {
                id
            }
        }
    GRAPHQL;

    protected $updateMutation = <<<'GRAPHQL'
    mutation UpdateTalentNomination($id: UUID!, $talentNomination: UpdateTalentNominationInput!) {
        updateTalentNomination(id: $id, talentNomination: $talentNomination) {
                id
            }
        }
    GRAPHQL;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);
        $this->seed(SkillFamilySeeder::class);
        $this->seed(SkillSeeder::class);

        $this->employee1 = User::factory()
            ->asGuest()
            ->asApplicant()
            ->create([
                'email' => 'employee1@test.com',
                'computed_is_gov_employee' => true,
                'work_email' => 'employee1@gc.ca',
                'work_email_verified_at' => now(),
            ]);

        $this->employee2 = User::factory()
            ->asGuest()
            ->asApplicant()
            ->create([
                'email' => 'employee2@test.com',
                'computed_is_gov_employee' => true,
                'work_email' => 'employee2@gc.ca',
                'work_email_verified_at' => now(),
            ]);

        $this->nonEmployee1 = User::factory()
            ->asGuest()
            ->asApplicant()
            ->create([
                'email' => 'non_employee1@test.com',
                'computed_is_gov_employee' => false,
                'work_email' => null,
                'work_email_verified_at' => null,
            ]);
    }

    public function testEmployeeCanCreateNominations()
    {
        $response = $this->actingAs($this->employee1, 'api')
            ->graphQL($this->createMutation, [
                'talentNomination' => [
                    'talentNominationEvent' => [
                        'connect' => TalentNominationEvent::factory()->create()->id,
                    ],
                ],
            ]);

        $response->assertJsonStructure([
            'data' => [
                'createTalentNomination' => [
                    'id',
                ],
            ],
        ]);

        $response->assertGraphQLErrorFree();
    }

    public function testNonEmployeeCantCreateNominations()
    {
        $response = $this->actingAs($this->nonEmployee1, 'api')
            ->graphQL($this->createMutation, [
                'talentNomination' => [
                    'talentNominationEvent' => [
                        'connect' => TalentNominationEvent::factory()->create()->id,
                    ],
                ],
            ]);

        $response->assertGraphQLErrorMessage('This action is unauthorized.');
    }

    public function testSubmitterCanUpdateTheirOwnNominations()
    {
        $nomination = TalentNomination::factory()->create([
            'submitter_id' => $this->employee1->id,
        ]);

        $response = $this->actingAs($this->employee1, 'api')
            ->graphQL($this->updateMutation, [
                'id' => $nomination->id,
                'talentNomination' => [
                    'additionalComments' => 'New comments',
                ],
            ]);

        $response->assertJsonStructure([
            'data' => [
                'updateTalentNomination' => [
                    'id',
                ],
            ],
        ]);

        $response->assertGraphQLErrorFree();
    }

    public function testNonSubmitterCantUpdateOtherNominations()
    {
        $nomination = TalentNomination::factory()->create([
            'submitter_id' => $this->employee1->id,
        ]);

        $response = $this->actingAs($this->employee2, 'api')
            ->graphQL($this->updateMutation, [
                'id' => $nomination->id,
                'talentNomination' => [
                    'additionalComments' => 'New comments',
                ],
            ]);

        $response->assertGraphQLErrorMessage('This action is unauthorized.');
    }
}
