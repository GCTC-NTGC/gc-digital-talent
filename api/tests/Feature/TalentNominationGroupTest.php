<?php

namespace Tests\Feature;

use App\Enums\ErrorCode;
use App\Enums\TalentNominationGroupDecision;
use App\Enums\TalentNominationGroupStatus;
use App\Models\Classification;
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
use Illuminate\Support\Str;
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

    protected function createAdvancementNomination(Community $community)
    {
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
                'nominate_for_advancement' => true,
            ]);

        return [$nomination, $coordinator];
    }

    protected function createLateralMovementNomination(Community $community)
    {
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
                'nominate_for_lateral_movement' => true,
            ]);

        return [$nomination, $coordinator];
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
                advancementClassifications {
                    id
                }
                lateralMovementClassifications {
                    id
                }
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

    public function testArchivedNomineeGroupExcludedFromNominationGroupsQuery()
    {
        $community = Community::factory()->create();
        $talentNominationEvent = TalentNominationEvent::factory()
            ->for($community)
            ->create();

        $nominator = $this->makeEmployee('nominator');
        $nominee = $this->makeEmployee('nominee');
        $coordinator = $this->makeCommunityTalentCoordinator('coordinator', $community->id);

        TalentNomination::factory()
            ->submittedReviewAndSubmit()
            ->create([
                'talent_nomination_event_id' => $talentNominationEvent->id,
                'submitter_id' => $nominator->id,
                'nominator_id' => $nominator->id,
                'nominee_id' => $nominee->id,
            ]);

        // archive the nominee
        $nominee->delete();

        $response = $this->actingAs($coordinator, 'api')
            ->graphQL($this->queryTalentNominationGroups, [
                'talentNominationEventId' => $talentNominationEvent->id,
            ]);

        $response->assertJsonFragment(['talentNominationGroups' => []]);
        $response->assertGraphQLErrorFree();
    }

    public function testArchivedNomineeGroupHiddenButRestorable()
    {
        $nominator = $this->makeEmployee('nominator');
        $nominee = $this->makeEmployee('nominee');

        $nomination = TalentNomination::factory()
            ->submittedReviewAndSubmit()
            ->create([
                'talent_nomination_event_id' => $this->nominationEvent->id,
                'submitter_id' => $nominator->id,
                'nominator_id' => $nominator->id,
                'nominee_id' => $nominee->id,
            ]);
        $groupId = $nomination->talentNominationGroup->id;

        // archive the nominee
        $nominee->delete();

        // the group is hidden from normal queries...
        $this->assertNull(TalentNominationGroup::find($groupId));
        // ...but still exists, untouched
        $this->assertNotNull(TalentNominationGroup::withoutGlobalScope('activeNominee')->find($groupId));

        // restoring the nominee brings the group back automatically, no cascade required
        $nominee->restore();
        $this->assertNotNull(TalentNominationGroup::find($groupId));
    }

    public function testSubmittingNominationForAlreadyGroupedArchivedNomineeReusesGroup()
    {
        // a second nomination for the same (now-archived) nominee/event must reuse the
        // existing hidden group rather than violating its uniqueness constraint
        $nominator1 = $this->makeEmployee('nominator1');
        $nominator2 = $this->makeEmployee('nominator2');
        $nominee = $this->makeEmployee('nominee');

        $nomination1 = TalentNomination::factory()
            ->submittedReviewAndSubmit()
            ->create([
                'talent_nomination_event_id' => $this->nominationEvent->id,
                'submitter_id' => $nominator1->id,
                'nominator_id' => $nominator1->id,
                'nominee_id' => $nominee->id,
            ]);

        $nominee->delete();

        $nomination2 = TalentNomination::factory()
            ->submittedRationale()
            ->create([
                'talent_nomination_event_id' => $this->nominationEvent->id,
                'submitter_id' => $nominator2->id,
                'nominator_id' => $nominator2->id,
                'nominee_id' => $nominee->id,
            ]);

        $this->actingAs($nominator2, 'api')
            ->graphQL($this->submitNominationMutation, [
                'id' => $nomination2->id,
            ]);

        $this->assertEqualsCanonicalizing(
            TalentNominationGroup::withoutGlobalScope('activeNominee')->sole()->nominations->pluck('id')->toArray(),
            [
                $nomination1->id,
                $nomination2->id,
            ]
        );
    }

    public function testStatusRecomputesForNewNominationOnArchivedNominee()
    {
        $nominator1 = $this->makeEmployee('nominator1');
        $nominator2 = $this->makeEmployee('nominator2');
        $nominee = $this->makeEmployee('nominee');

        $nomination1 = TalentNomination::factory()
            ->submittedReviewAndSubmit()
            ->create([
                'talent_nomination_event_id' => $this->nominationEvent->id,
                'submitter_id' => $nominator1->id,
                'nominator_id' => $nominator1->id,
                'nominee_id' => $nominee->id,
                'nominate_for_advancement' => true,
                'nominate_for_lateral_movement' => false,
                'nominate_for_development_programs' => false,
            ]);

        $group = $nomination1->talentNominationGroup;
        $group->update(['advancement_decision' => TalentNominationGroupDecision::APPROVED->name]);
        $this->assertEquals(TalentNominationGroupStatus::APPROVED->name, $group->fresh()->status);

        // archive the nominee
        $nominee->delete();

        // a second nominator nominates the same (now archived) nominee, for a different option
        TalentNomination::factory()
            ->submittedReviewAndSubmit()
            ->create([
                'talent_nomination_event_id' => $this->nominationEvent->id,
                'submitter_id' => $nominator2->id,
                'nominator_id' => $nominator2->id,
                'nominee_id' => $nominee->id,
                'nominate_for_advancement' => false,
                'nominate_for_lateral_movement' => true,
                'nominate_for_development_programs' => false,
            ]);

        // the group's status must reflect the new, undecided nomination - this only works if
        // TalentNomination::talentNominationGroup() can resolve the group even though its
        // nominee is archived (TalentNominationObserver relies on this to call updateStatus())
        $this->assertEquals(
            TalentNominationGroupStatus::IN_PROGRESS->name,
            TalentNominationGroup::withoutGlobalScope('activeNominee')->find($group->id)->status
        );
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

    public function testCoordinatorCanAddAdvancementClassificationsWhenApproved()
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
                'nominate_for_advancement' => true,
            ]);

        $classifications = Classification::factory()->count(2)->create();

        $response = $this->actingAs($coordinator, 'api')
            ->graphQL($this->updateTalentNominationGroup, [
                'id' => $nomination->talentNominationGroup->id,
                'talentNominationGroup' => [
                    'advancementDecision' => 'APPROVED',
                    'advancementClassifications' => [
                        'sync' => $classifications->pluck('id')->toArray(),
                    ],
                    'advancementReferralExpiryDate' => config('constants.far_future_date'),
                    // the real form always submits every track's classifications together
                    'lateralMovementClassifications' => [
                        'sync' => [],
                    ],
                    'lateralMovementReferralExpiryDate' => null,
                ],
            ]);
        $response->assertGraphQLErrorFree();
        $response->assertJsonFragment([
            'advancementClassifications' => [
                ['id' => $classifications[0]->id],
                ['id' => $classifications[1]->id],
            ],
        ]);

        $this->assertEqualsCanonicalizing(
            $classifications->pluck('id')->toArray(),
            $nomination->talentNominationGroup->fresh()->advancementClassifications->pluck('id')->toArray(),
        );
    }

    public function testCannotAddAdvancementClassificationsUnlessAdvancementApproved()
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
                'nominate_for_advancement' => true,
            ]);

        $classification = Classification::factory()->create();

        // decision left as not approved (null) while attempting to sync a classification
        $response = $this->actingAs($coordinator, 'api')
            ->graphQL($this->updateTalentNominationGroup, [
                'id' => $nomination->talentNominationGroup->id,
                'talentNominationGroup' => [
                    'advancementClassifications' => [
                        'sync' => [$classification->id],
                    ],
                ],
            ]);

        $response->assertGraphQLValidationError(
            'talentNominationGroup.advancementClassifications.sync',
            ErrorCode::ADVANCEMENT_CLASSIFICATIONS_PROHIBITED->name
        );

        $this->assertDatabaseEmpty('classification_talent_nomination_group_advancement');
    }

    public function testApprovedAdvancementRequiresAtLeastOneClassification()
    {
        $community = Community::factory()->create();
        [$nomination, $coordinator] = $this->createAdvancementNomination($community);

        $response = $this->actingAs($coordinator, 'api')
            ->graphQL($this->updateTalentNominationGroup, [
                'id' => $nomination->talentNominationGroup->id,
                'talentNominationGroup' => [
                    'advancementDecision' => TalentNominationGroupDecision::APPROVED->name,
                    'advancementClassifications' => [
                        'sync' => [],
                    ],
                    'advancementReferralExpiryDate' => config('constants.far_future_date'),
                ],
            ]);

        $response->assertGraphQLValidationError(
            'talentNominationGroup.advancementClassifications.sync',
            ErrorCode::ADVANCEMENT_CLASSIFICATIONS_REQUIRED->name
        );

        $this->assertDatabaseEmpty('classification_talent_nomination_group_advancement');
    }

    public function testAdvancementClassificationsProhibitedWhenDecisionIsRejected()
    {
        $community = Community::factory()->create();
        [$nomination, $coordinator] = $this->createAdvancementNomination($community);

        $classification = Classification::factory()->create();

        $response = $this->actingAs($coordinator, 'api')
            ->graphQL($this->updateTalentNominationGroup, [
                'id' => $nomination->talentNominationGroup->id,
                'talentNominationGroup' => [
                    'advancementDecision' => TalentNominationGroupDecision::REJECTED->name,
                    'advancementClassifications' => [
                        'sync' => [$classification->id],
                    ],
                    'advancementReferralExpiryDate' => null,
                ],
            ]);

        $response->assertGraphQLValidationError(
            'talentNominationGroup.advancementClassifications.sync',
            ErrorCode::ADVANCEMENT_CLASSIFICATIONS_PROHIBITED->name
        );

        $this->assertDatabaseEmpty('classification_talent_nomination_group_advancement');
    }

    public function testInvalidClassificationIdReturnsValidationError()
    {
        $community = Community::factory()->create();
        [$nomination, $coordinator] = $this->createAdvancementNomination($community);

        $invalidClassificationId = Str::uuid()->toString();

        $response = $this->actingAs($coordinator, 'api')
            ->graphQL($this->updateTalentNominationGroup, [
                'id' => $nomination->talentNominationGroup->id,
                'talentNominationGroup' => [
                    'advancementDecision' => TalentNominationGroupDecision::APPROVED->name,
                    'advancementClassifications' => [
                        'sync' => [$invalidClassificationId],
                    ],
                    'advancementReferralExpiryDate' => config('constants.far_future_date'),
                ],
            ]);

        $response->assertGraphQLValidationError(
            'talentNominationGroup.advancementClassifications.sync.0',
            ErrorCode::CLASSIFICATION_NOT_FOUND->name
        );

        $this->assertDatabaseEmpty('classification_talent_nomination_group_advancement');
    }

    public function testCoordinatorCanAddLateralMovementClassificationsWhenApproved()
    {
        $community = Community::factory()->create();
        [$nomination, $coordinator] = $this->createLateralMovementNomination($community);

        $classifications = Classification::factory()->count(2)->create();

        $response = $this->actingAs($coordinator, 'api')
            ->graphQL($this->updateTalentNominationGroup, [
                'id' => $nomination->talentNominationGroup->id,
                'talentNominationGroup' => [
                    'lateralMovementDecision' => TalentNominationGroupDecision::APPROVED->name,
                    'lateralMovementClassifications' => [
                        'sync' => $classifications->pluck('id')->toArray(),
                    ],
                    'lateralMovementReferralExpiryDate' => config('constants.far_future_date'),
                    // the real form always submits every track's classifications together
                    'advancementClassifications' => [
                        'sync' => [],
                    ],
                    'advancementReferralExpiryDate' => null,
                ],
            ]);
        $response->assertGraphQLErrorFree();
        $response->assertJsonFragment([
            'lateralMovementClassifications' => [
                ['id' => $classifications[0]->id],
                ['id' => $classifications[1]->id],
            ],
        ]);

        $this->assertEqualsCanonicalizing(
            $classifications->pluck('id')->toArray(),
            $nomination->talentNominationGroup->fresh()->lateralMovementClassifications->pluck('id')->toArray(),
        );
    }

    public function testApprovedLateralMovementAllowsNoClassifications()
    {
        $community = Community::factory()->create();
        [$nomination, $coordinator] = $this->createLateralMovementNomination($community);

        $response = $this->actingAs($coordinator, 'api')
            ->graphQL($this->updateTalentNominationGroup, [
                'id' => $nomination->talentNominationGroup->id,
                'talentNominationGroup' => [
                    'lateralMovementDecision' => TalentNominationGroupDecision::APPROVED->name,
                    'lateralMovementClassifications' => [
                        'sync' => [],
                    ],
                    'lateralMovementReferralExpiryDate' => config('constants.far_future_date'),
                    // the real form always submits every track's classifications together
                    'advancementClassifications' => [
                        'sync' => [],
                    ],
                    'advancementReferralExpiryDate' => null,
                ],
            ]);

        $response->assertGraphQLErrorFree();
        $response->assertJsonFragment([
            'lateralMovementClassifications' => [],
        ]);

        $this->assertDatabaseEmpty('classification_talent_nomination_group_lateral_movement');
    }

    public function testLateralMovementClassificationsProhibitedWhenDecisionIsRejected()
    {
        $community = Community::factory()->create();
        [$nomination, $coordinator] = $this->createLateralMovementNomination($community);

        $classification = Classification::factory()->create();

        $response = $this->actingAs($coordinator, 'api')
            ->graphQL($this->updateTalentNominationGroup, [
                'id' => $nomination->talentNominationGroup->id,
                'talentNominationGroup' => [
                    'lateralMovementDecision' => TalentNominationGroupDecision::REJECTED->name,
                    'lateralMovementClassifications' => [
                        'sync' => [$classification->id],
                    ],
                    'lateralMovementReferralExpiryDate' => null,
                ],
            ]);

        $response->assertGraphQLValidationError(
            'talentNominationGroup.lateralMovementClassifications.sync',
            ErrorCode::LATERAL_MOVEMENT_CLASSIFICATIONS_PROHIBITED->name
        );

        $this->assertDatabaseEmpty('classification_talent_nomination_group_lateral_movement');
    }
}
