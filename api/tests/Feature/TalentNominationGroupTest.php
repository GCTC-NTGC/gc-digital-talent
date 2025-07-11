<?php

namespace Tests\Feature;

use App\Models\Community;
use App\Models\CommunityInterest;
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

use function PHPUnit\Framework\assertEquals;

class TalentNominationGroupTest extends TestCase
{
    use MakesGraphQLRequests;
    use RefreshDatabase;
    use RefreshesSchemaCache;
    use UsesProtectedGraphqlEndpoint;

    protected $nominationEvent;

    protected function makeEmployee(string $userName)
    {
        return User::factory()
            ->asApplicant()
            ->create([
                'email' => $userName.'@test.com',
                'computed_is_gov_employee' => true,
                'work_email' => $userName.'@gc.ca',
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
                'work_email' => $userName.'@gc.ca',
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

        $this->nominationEvent = TalentNominationEvent::factory()->create([
            'open_date' => config('constants.past_datetime'),
            'close_date' => config('constants.far_future_datetime'),
        ]);
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
                'talent_nomination_event_id' => $this->nominationEvent,
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
                'talent_nomination_event_id' => $talentNominationEvent->id,
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

        $response->assertJsonFragment(['talentNominationGroups' => []]);
    }

    public function testCommunityCoordinatorCanEditNominationGroup()
    {
        $community = Community::factory()->create();
        $talentNominationEvent = TalentNominationEvent::factory()
            ->for($community)
            ->create(['close_date' => config('constants.far_future_datetime')]);

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
            ->create(['close_date' => config('constants.far_future_datetime')]);

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

    public function testConnectToTalentNominationGroupIfMissingMultipleEvents()
    {
        // connectToTalentNominationGroupIfMissing()
        // testing nominating one nominee for multiple events

        $nominee = $this->makeEmployee('nominee');

        TalentNomination::truncate();
        TalentNominationGroup::truncate();
        TalentNomination::factory()->count(3)->submittedReviewAndSubmit()->create([
            'nominee_id' => $nominee->id,
            'talent_nomination_event_id' => TalentNominationEvent::factory(),
        ]);

        $nominationGroups = TalentNominationGroup::all()->load('nominations');

        // assert three nomination groups were created, one per event, but all point at the one nominee
        assertEquals(3, count($nominationGroups));
        assertEquals(3, count(TalentNominationGroup::where('nominee_id', $nominee->id)->get()));

        // iterate through the groups and nominations and assert the nominee and events are the same
        foreach ($nominationGroups as $nominationGroup) {

            $nominations = $nominationGroup->nominations;
            foreach ($nominations as $nomination) {
                assertEquals($nominationGroup->nominee_id, $nomination->nominee_id);
                assertEquals($nominationGroup->talent_nomination_event_id, $nomination->talent_nomination_event_id);
            }
        }
    }

    public function testConsentToShareAttribute()
    {
        TalentNomination::truncate();
        TalentNominationGroup::truncate();
        $communityId = Community::factory()->create()->id;
        $event = TalentNominationEvent::factory()->create([
            'community_id' => $communityId,
        ]);

        $nominee = User::factory()
            ->asApplicant()
            ->create([
                'email' => 'nominee@test.com',
                'computed_is_gov_employee' => true,
                'work_email' => 'nominee@gc.ca',
                'work_email_verified_at' => now(),
            ]);

        TalentNomination::factory()->count(1)->submittedReviewAndSubmit()->create([
            'nominee_id' => $nominee->id,
            'talent_nomination_event_id' => $event,
        ]);

        // Set consent to share profile to false
        $communityInterest = CommunityInterest::factory()->create([
            'user_id' => $nominee->id,
            'community_id' => $communityId,
            'consent_to_share_profile' => false,
        ]);

        // Get talent nomination group
        $group = TalentNominationGroup::first();

        // Assert nominee did not consent to share profile info on nomination profile
        assertEquals($group->consentToShareProfile, false);

        // Update community interest to share nominee into on nomination profile
        $communityInterest->update([
            'consent_to_share_profile' => true,
        ]);

        // Assert nominee did consent to share profile info to admins on nomination profile
        assertEquals($group->consentToShareProfile, true);
    }
}
