<?php

namespace Tests\Feature;

use App\Enums\TalentNominationGroupDecision;
use App\Models\TalentNomination;
use App\Models\TalentNominationEvent;
use App\Models\TalentNominationGroup;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Database\Seeders\SkillFamilySeeder;
use Database\Seeders\SkillSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;
use Tests\UsesProtectedGraphqlEndpoint;

class TalentNominationGroupAsNomineeTest extends TestCase
{
    use MakesGraphQLRequests;
    use RefreshDatabase;
    use RefreshesSchemaCache;
    use UsesProtectedGraphqlEndpoint;

    protected TalentNominationEvent $talentNominationEvent;

    protected User $nominee;

    protected User $advancementNominator;

    protected User $lateralMovementNominator;

    protected $queryNominationsReceived = <<<'GRAPHQL'
        query NominationsReceived {
            me {
                talentNominationGroupsAsNominee {
                    id
                    talentNominationEvent { id }
                    approvedForAdvancement
                    approvedForLateralMovement
                    approvedForDevelopmentPrograms
                    nominatorNames
                    updatedAt
                }
            }
        }
    GRAPHQL;

    protected $queryUserNominationsReceived = <<<'GRAPHQL'
        query UserNominationsReceived($id: UUID!) {
            user(id: $id) {
                talentNominationGroupsAsNominee { id }
            }
        }
    GRAPHQL;

    protected $queryTalentNominationGroup = <<<'GRAPHQL'
        query TalentNominationGroup($id: UUID!) {
            talentNominationGroup(id: $id) {
                id
                nominations { id }
            }
        }
    GRAPHQL;

    protected $queryTalentNomination = <<<'GRAPHQL'
        query TalentNomination($id: UUID!) {
            talentNomination(id: $id) { id }
        }
    GRAPHQL;

    protected $queryEventNominationGroups = <<<'GRAPHQL'
        query EventNominationGroups($id: UUID!) {
            talentNominationEvent(id: $id) {
                talentNominationGroups { id }
                countTalentNominationGroups
            }
        }
    GRAPHQL;

    protected function setUp(): void
    {
        parent::setUp();

        Notification::fake();
        $this->seed(RolePermissionSeeder::class);
        $this->seed(SkillFamilySeeder::class);
        $this->seed(SkillSeeder::class);

        $this->talentNominationEvent = TalentNominationEvent::factory()->create([
            'open_date' => config('constants.past_datetime'),
            'close_date' => config('constants.far_future_datetime'),
        ]);
        $this->nominee = $this->makeEmployee('nominee', 'Nomi', 'Nee');
        $this->advancementNominator = $this->makeEmployee('advancement', 'Ada', 'Vance');
        $this->lateralMovementNominator = $this->makeEmployee('lateral', 'Lat', 'Eral');
    }

    protected function makeEmployee(string $userName, string $firstName, string $lastName): User
    {
        return User::factory()
            ->asApplicant()
            ->create([
                'email' => $userName.'@test.com',
                'first_name' => $firstName,
                'last_name' => $lastName,
                'computed_is_gov_employee' => true,
                'work_email' => $userName.'@gc.ca',
                'work_email_verified_at' => now(),
            ]);
    }

    /**
     * Submit a nomination of the nominee, which creates or joins the nominee's group for the event.
     */
    protected function createNomination(?User $nominator, array $attributes): TalentNomination
    {
        return TalentNomination::factory()
            ->submittedReviewAndSubmit()
            ->create([
                'talent_nomination_event_id' => $this->talentNominationEvent->id,
                'submitter_id' => $nominator?->id ?? $this->advancementNominator->id,
                'nominator_id' => $nominator?->id,
                'nominee_id' => $this->nominee->id,
                'nominate_for_advancement' => false,
                'nominate_for_lateral_movement' => false,
                'nominate_for_development_programs' => false,
                ...$attributes,
            ]);
    }

    /**
     * Nominate the nominee for advancement and lateral movement by different nominators.
     */
    protected function createAdvancementAndLateralMovementGroup(): TalentNominationGroup
    {
        $this->createNomination($this->advancementNominator, ['nominate_for_advancement' => true]);
        $this->createNomination($this->lateralMovementNominator, ['nominate_for_lateral_movement' => true]);

        return TalentNominationGroup::sole();
    }

    protected function decide(TalentNominationGroup $group, array $decisions): void
    {
        $group->refresh();
        $group->update($decisions);
    }

    protected function queryAsNominee()
    {
        return $this->actingAs($this->nominee, 'api')->graphQL($this->queryNominationsReceived);
    }

    public function testNomineeSeesApprovedGroup()
    {
        $group = $this->createAdvancementAndLateralMovementGroup();
        $this->decide($group, [
            'advancement_decision' => TalentNominationGroupDecision::APPROVED->name,
            'lateral_movement_decision' => TalentNominationGroupDecision::APPROVED->name,
        ]);

        $groups = $this->queryAsNominee()
            ->assertGraphQLErrorFree()
            ->json('data.me.talentNominationGroupsAsNominee');

        $this->assertCount(1, $groups);
        $this->assertSame($group->id, $groups[0]['id']);
        $this->assertSame($this->talentNominationEvent->id, $groups[0]['talentNominationEvent']['id']);
        $this->assertTrue($groups[0]['approvedForAdvancement']);
        $this->assertTrue($groups[0]['approvedForLateralMovement']);
        $this->assertFalse($groups[0]['approvedForDevelopmentPrograms']);
        $this->assertEqualsCanonicalizing(['Ada Vance', 'Lat Eral'], $groups[0]['nominatorNames']);
        $this->assertNotNull($groups[0]['updatedAt']);
    }

    public function testNomineeSeesOnlyApprovedOptionsOfPartiallyApprovedGroup()
    {
        $group = $this->createAdvancementAndLateralMovementGroup();
        $this->decide($group, [
            'advancement_decision' => TalentNominationGroupDecision::REJECTED->name,
            'lateral_movement_decision' => TalentNominationGroupDecision::APPROVED->name,
        ]);

        $groups = $this->queryAsNominee()
            ->assertGraphQLErrorFree()
            ->json('data.me.talentNominationGroupsAsNominee');

        $this->assertCount(1, $groups);
        $this->assertFalse($groups[0]['approvedForAdvancement']);
        $this->assertTrue($groups[0]['approvedForLateralMovement']);
        $this->assertFalse($groups[0]['approvedForDevelopmentPrograms']);
        $this->assertSame(['Lat Eral'], $groups[0]['nominatorNames']);
    }

    public function testNomineeDoesNotSeeRejectedGroup()
    {
        $group = $this->createAdvancementAndLateralMovementGroup();
        $this->decide($group, [
            'advancement_decision' => TalentNominationGroupDecision::REJECTED->name,
            'lateral_movement_decision' => TalentNominationGroupDecision::REJECTED->name,
        ]);

        $this->queryAsNominee()
            ->assertGraphQLErrorFree()
            ->assertJsonPath('data.me.talentNominationGroupsAsNominee', []);
    }

    public function testNomineeDoesNotSeeInProgressGroup()
    {
        $group = $this->createAdvancementAndLateralMovementGroup();
        $this->decide($group, [
            'lateral_movement_decision' => TalentNominationGroupDecision::APPROVED->name,
        ]);

        $this->queryAsNominee()
            ->assertGraphQLErrorFree()
            ->assertJsonPath('data.me.talentNominationGroupsAsNominee', []);
    }

    public function testNominatorNamesUseFallbackNameAndAreDistinct()
    {
        $this->createNomination($this->advancementNominator, ['nominate_for_advancement' => true]);
        $this->createNomination($this->advancementNominator, ['nominate_for_advancement' => true]);
        $this->createNomination(null, [
            'nominate_for_advancement' => true,
            'nominator_fallback_name' => 'Fallback Nominator',
        ]);
        $this->decide(TalentNominationGroup::sole(), [
            'advancement_decision' => TalentNominationGroupDecision::APPROVED->name,
        ]);

        $groups = $this->queryAsNominee()
            ->assertGraphQLErrorFree()
            ->json('data.me.talentNominationGroupsAsNominee');

        $this->assertEqualsCanonicalizing(['Ada Vance', 'Fallback Nominator'], $groups[0]['nominatorNames']);
    }

    public function testNomineeWithoutPermissionSeesNothing()
    {
        $group = $this->createAdvancementAndLateralMovementGroup();
        $this->decide($group, [
            'advancement_decision' => TalentNominationGroupDecision::APPROVED->name,
            'lateral_movement_decision' => TalentNominationGroupDecision::APPROVED->name,
        ]);
        $this->nominee->removeRole('applicant');

        $this->queryAsNominee()
            ->assertGraphQLErrorFree()
            ->assertJsonPath('data.me.talentNominationGroupsAsNominee', []);
    }

    public function testAdminCannotViewAnotherUsersNominationsReceived()
    {
        $group = $this->createAdvancementAndLateralMovementGroup();
        $this->decide($group, [
            'advancement_decision' => TalentNominationGroupDecision::APPROVED->name,
            'lateral_movement_decision' => TalentNominationGroupDecision::APPROVED->name,
        ]);
        $admin = User::factory()->asAdmin()->create();

        $this->actingAs($admin, 'api')
            ->graphQL($this->queryUserNominationsReceived, ['id' => $this->nominee->id])
            ->assertGraphQLErrorFree()
            ->assertJsonPath('data.user.talentNominationGroupsAsNominee', []);
    }

    public function testNominatorCannotViewNomineesNominationsReceived()
    {
        $group = $this->createAdvancementAndLateralMovementGroup();
        $this->decide($group, [
            'advancement_decision' => TalentNominationGroupDecision::APPROVED->name,
            'lateral_movement_decision' => TalentNominationGroupDecision::APPROVED->name,
        ]);

        $this->actingAs($this->advancementNominator, 'api')
            ->graphQL($this->queryNominationsReceived)
            ->assertGraphQLErrorFree()
            ->assertJsonPath('data.me.talentNominationGroupsAsNominee', []);

        $this->actingAs($this->advancementNominator, 'api')
            ->graphQL($this->queryUserNominationsReceived, ['id' => $this->nominee->id])
            ->assertGraphQLErrorMessage('This action is unauthorized.')
            ->assertJsonMissing(['id' => $group->id]);
    }

    public static function decisionsProvider(): array
    {
        return [
            'approved' => [[
                'advancement_decision' => TalentNominationGroupDecision::APPROVED->name,
                'lateral_movement_decision' => TalentNominationGroupDecision::APPROVED->name,
            ]],
            'partially approved' => [[
                'advancement_decision' => TalentNominationGroupDecision::REJECTED->name,
                'lateral_movement_decision' => TalentNominationGroupDecision::APPROVED->name,
            ]],
            'rejected' => [[
                'advancement_decision' => TalentNominationGroupDecision::REJECTED->name,
                'lateral_movement_decision' => TalentNominationGroupDecision::REJECTED->name,
            ]],
            'in progress' => [[]],
        ];
    }

    #[DataProvider('decisionsProvider')]
    public function testNomineeCannotViewNominationGroupOrNominations(array $decisions)
    {
        $group = $this->createAdvancementAndLateralMovementGroup();
        $this->decide($group, $decisions);

        $this->actingAs($this->nominee, 'api')
            ->graphQL($this->queryTalentNominationGroup, ['id' => $group->id])
            ->assertGraphQLErrorMessage('This action is unauthorized.');

        $group->nominations->each(fn (TalentNomination $nomination) => $this->actingAs($this->nominee, 'api')
            ->graphQL($this->queryTalentNomination, ['id' => $nomination->id])
            ->assertGraphQLErrorMessage('This action is unauthorized.'));

        $this->actingAs($this->nominee, 'api')
            ->graphQL($this->queryEventNominationGroups, ['id' => $this->talentNominationEvent->id])
            ->assertGraphQLErrorFree()
            ->assertJsonPath('data.talentNominationEvent.talentNominationGroups', [])
            ->assertJsonPath('data.talentNominationEvent.countTalentNominationGroups', 0);
    }

    public function testAdminCanViewNominationGroupAndNominations()
    {
        $group = $this->createAdvancementAndLateralMovementGroup();
        $this->decide($group, [
            'advancement_decision' => TalentNominationGroupDecision::APPROVED->name,
            'lateral_movement_decision' => TalentNominationGroupDecision::APPROVED->name,
        ]);
        $admin = User::factory()->asAdmin()->create();

        $this->actingAs($admin, 'api')
            ->graphQL($this->queryTalentNominationGroup, ['id' => $group->id])
            ->assertGraphQLErrorFree()
            ->assertJsonCount(2, 'data.talentNominationGroup.nominations');
    }

    public function testCommunityCoordinatorCanViewNominationGroupAndNominations()
    {
        $group = $this->createAdvancementAndLateralMovementGroup();
        $coordinator = User::factory()
            ->asCommunityTalentCoordinator($this->talentNominationEvent->community_id)
            ->create();

        $this->actingAs($coordinator, 'api')
            ->graphQL($this->queryTalentNominationGroup, ['id' => $group->id])
            ->assertGraphQLErrorFree()
            ->assertJsonCount(2, 'data.talentNominationGroup.nominations');

        $this->actingAs($coordinator, 'api')
            ->graphQL($this->queryEventNominationGroups, ['id' => $this->talentNominationEvent->id])
            ->assertGraphQLErrorFree()
            ->assertJsonPath('data.talentNominationEvent.countTalentNominationGroups', 1);
    }

    public function testSubmitterCanStillViewOwnNomination()
    {
        $nomination = $this->createNomination($this->advancementNominator, ['nominate_for_advancement' => true]);

        $this->actingAs($this->advancementNominator, 'api')
            ->graphQL($this->queryTalentNomination, ['id' => $nomination->id])
            ->assertGraphQLErrorFree()
            ->assertJsonPath('data.talentNomination.id', $nomination->id);
    }
}
