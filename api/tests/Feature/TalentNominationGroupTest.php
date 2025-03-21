<?php

namespace Tests\Feature;

use App\Models\Community;
use App\Models\TalentNomination;
use App\Models\TalentNominationEvent;
use App\Models\TalentNominationGroup;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Database\Seeders\SkillFamilySeeder;
use Database\Seeders\SkillSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Tests\TestCase;
use Tests\UsesProtectedGraphqlEndpoint;

class TalentNominationGroupTest extends TestCase
{
    use MakesGraphQLRequests;
    use RefreshDatabase;
    use RefreshesSchemaCache;
    use UsesProtectedGraphqlEndpoint;

    protected function makeEmployee(string $userName)
    {
        return User::factory()
            ->asApplicant()
            ->create([
                'email' => $userName.'@test.com',
                'computed_is_gov_employee' => true,
                'work_email' => $userName.'gc.ca',
                'work_email_verified_at' => now(),
            ]);
    }

    protected function makeCommunityTalentCoordinator(string $userName, string $communityId)
    {
        return User::factory()
            ->asCommunityTalentCoordinator($communityId)
            ->create([
                'email' => $userName.'@test.com',
                'computed_is_gov_employee' => true,
                'work_email' => $userName.'gc.ca',
                'work_email_verified_at' => now(),
            ]);
    }

    protected $submitNominationMutation = <<<'GRAPHQL'
        mutation SubmitTalentNomination($id: UUID!) {
        submitTalentNomination(id: $id) {
                id
            }
        }
    GRAPHQL;

    protected $queryTalentNominationGroups = <<<'GRAPHQL'
       query TalentNominationGroups($talentNominationEventId: UUID!) {
            talentNominationEvent(id: $talentNominationEventId) {
                talentNominationGroups {
                    id
                    nominations { id }
                }
            }
        }
    GRAPHQL;

    protected $updateTalentNominationGroup = <<<'GRAPHQL'
        mutation UpdateTalentNominationGroup($id: UUID!, $talentNominationGroup: UpdateTalentNominationGroupInput!) {
            updateTalentNominationGroup(id: $id, talentNominationGroup: $talentNominationGroup) {
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

    }

    public function testNominationCanCreateNewGroup()
    {
        $nominator = $this->makeEmployee('nominator');
        $nominee = $this->makeEmployee('nominee');

        // draft nomination
        $nomination = TalentNomination::factory()
            ->submittedRationale()
            ->create([
                'submitter_id' => $nominator->id,
                'nominator_id' => $nominator->id,
                'nominee_id' => $nominee->id,
            ]);

        // no nomination groups exists yet
        $this->assertDatabaseEmpty('talent_nomination_groups');

        // submit the nomination
        $this->actingAs($nominator, 'api')
            ->graphQL($this->submitNominationMutation, [
                'id' => $nomination->id,
            ]);

        // a nomination group was created for it
        $this->assertDatabaseCount('talent_nomination_groups', 1);
        $this->assertDatabaseHas('talent_nomination_groups', [
            'nominee_id' => $nomination->nominee_id,
            'talent_nomination_event_id' => $nomination->talent_nomination_event_id,
        ]);
    }

    public function testNominationCanAttachToExistingGroup()
    {
        $nominator = $this->makeEmployee('nominator');
        $nominee = $this->makeEmployee('nominee');

        // already submitted nomination
        $nomination1 = TalentNomination::factory()
            ->submittedReviewAndSubmit()
            ->create([
                'submitter_id' => $nominator->id,
                'nominator_id' => $nominator->id,
                'nominee_id' => $nominee->id,
            ]);

        $this->assertEqualsCanonicalizing(
            TalentNominationGroup::sole()->nominations->pluck('id')->toArray(),
            [
                $nomination1->id,
            ]
        );

        // draft nomination that will be submitted
        $nomination2 = TalentNomination::factory()
            ->submittedRationale()
            ->create([
                'submitter_id' => $nominator->id,
                'nominator_id' => $nominator->id,
                'nominee_id' => $nominee->id,
                'talent_nomination_event_id' => $nomination1->talent_nomination_event_id,
            ]);

        // submit the nomination
        $this->actingAs($nominator, 'api')
            ->graphQL($this->submitNominationMutation, [
                'id' => $nomination2->id,
            ]);

        // existing nomination group was attached to the new nomination
        $this->assertEqualsCanonicalizing(
            TalentNominationGroup::sole()->nominations->pluck('id')->toArray(),
            [
                $nomination1->id,
                $nomination2->id,
            ]
        );
    }

    public function testCommunityCoordinatorCanViewNominationGroup()
    {
        $community = Community::factory()->create();
        $talentNominationEvent = TalentNominationEvent::factory()
            ->for($community)
            ->create();

        $nominator = $this->makeEmployee('nominator');
        $nominee = $this->makeEmployee('nominee');
        $coordinator = $this->makeCommunityTalentCoordinator('coordinator', $community->id);

        $nomination = TalentNomination::factory()
            ->submittedReviewAndSubmit()
            ->create([
                'submitter_id' => $nominator->id,
                'nominator_id' => $nominator->id,
                'nominee_id' => $nominee->id,
            ]);

        $response = $this->actingAs($coordinator, 'api')
            ->graphQL($this->queryTalentNominationGroups, [
                'talentNominationEventId' => $talentNominationEvent->id,
            ]);

        $response->assertJsonFragment([
            'nominations' => [
                [
                    'id' => $nomination->id,
                ],
            ],
        ]);
        $response->assertGraphQLErrorFree();

    }

    public function testCommunityCoordinatorFromOtherCommunityCantViewNominationGroup()
    {
        // community 1 has the nomination and coordinator is from community 2
        $community1 = Community::factory()->create();
        $community2 = Community::factory()->create();

        $talentNominationEvent = TalentNominationEvent::factory()
            ->for($community1)
            ->create();

        $nominator = $this->makeEmployee('nominator');
        $nominee = $this->makeEmployee('nominee');
        $coordinator = $this->makeCommunityTalentCoordinator('coordinator', $community2->id);

        $nomination = TalentNomination::factory()
            ->submittedReviewAndSubmit()
            ->create([
                'talent_nomination_event_id' => $talentNominationEvent->id,
                'submitter_id' => $nominator->id,
                'nominator_id' => $nominator->id,
                'nominee_id' => $nominee->id,
            ]);

        $response = $this->actingAs($coordinator, 'api')
            ->graphQL($this->queryTalentNominationGroups, [
                'talentNominationEventId' => $talentNominationEvent->id,
            ]);

        $response->assertGraphQLErrorMessage('This action is unauthorized.');
    }

    public function testCommunityCoordinatorCanEditNominationGroup()
    {
        $community = Community::factory()->create();
        $talentNominationEvent = TalentNominationEvent::factory()
            ->for($community)
            ->create();

        $nominator = $this->makeEmployee('nominator');
        $nominee = $this->makeEmployee('nominee');
        $coordinator = $this->makeCommunityTalentCoordinator('coordinator', $community->id);

        $nomination = TalentNomination::factory()
            ->submittedReviewAndSubmit()
            ->create([
                'talent_nomination_event_id' => $talentNominationEvent->id,
                'submitter_id' => $nominator->id,
                'nominator_id' => $nominator->id,
                'nominee_id' => $nominee->id,
            ]);

        $response = $this->actingAs($coordinator, 'api')
            ->graphQL($this->updateTalentNominationGroup, [
                'id' => $nomination->talentNominationGroup->id,
                'talentNominationGroup' => [
                    'advancementNotes' => 'New notes',
                ],
            ]);

        $response->assertJson([
            'data' => [
                'updateTalentNominationGroup' => [
                    'id' => $nomination->talentNominationGroup->id,
                ],
            ],
        ]);
        $response->assertGraphQLErrorFree();
    }

    public function testCommunityCoordinatorFromOtherCommunityCantEditNominationGroup()
    {
        // community 1 has the nomination and coordinator is from community 2
        $community1 = Community::factory()->create();
        $community2 = Community::factory()->create();

        $talentNominationEvent = TalentNominationEvent::factory()
            ->for($community1)
            ->create();

        $nominator = $this->makeEmployee('nominator');
        $nominee = $this->makeEmployee('nominee');
        $coordinator = $this->makeCommunityTalentCoordinator('coordinator', $community2->id);

        $nomination = TalentNomination::factory()
            ->submittedReviewAndSubmit()
            ->create([
                'talent_nomination_event_id' => $talentNominationEvent->id,
                'submitter_id' => $nominator->id,
                'nominator_id' => $nominator->id,
                'nominee_id' => $nominee->id,
            ]);

        $response = $this->actingAs($coordinator, 'api')
            ->graphQL($this->updateTalentNominationGroup, [
                'id' => $nomination->talentNominationGroup->id,
                'talentNominationGroup' => [
                    'advancementNotes' => 'New notes',
                ],
            ]);

        $response->assertGraphQLErrorMessage('This action is unauthorized.');
    }

    public function testStatusIsComputedCorrectly()
    {
        $this->markTestSkipped('This test has not been implemented yet.');
    }
}
