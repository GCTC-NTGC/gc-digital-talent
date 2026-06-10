<?php

namespace Tests\Feature;

use App\Enums\TalentRequestTrackedUserNotReferredReason;
use App\Enums\TalentRequestTrackedUserNotSelectedReason;
use App\Enums\TalentRequestTrackedUserReferralDecision;
use App\Enums\TalentRequestTrackedUserSelectionDecision;
use App\Models\ApplicantFilter;
use App\Models\Community;
use App\Models\Pool;
use App\Models\PoolCandidate;
use App\Models\Skill;
use App\Models\TalentRequest;
use App\Models\TalentRequestTrackedUser;
use App\Models\User;
use App\Models\UserSkill;
use Carbon\CarbonImmutable;
use Database\Seeders\DepartmentSeeder;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;
use Tests\UsesProtectedGraphqlEndpoint;

class TalentRequestTrackedUserTest extends TestCase
{
    use MakesGraphQLRequests;
    use RefreshDatabase;
    use RefreshesSchemaCache;
    use UsesProtectedGraphqlEndpoint;

    protected Community $community;

    protected User $admin;

    protected User $recruiter;

    protected string $query = <<<'GRAPHQL'
        query TrackedUsers($id: UUID!) {
            talentRequest(id: $id) {
                trackedUsers {
                    skillCount
                    user { id }
                    referralDecision { value }
                    selectionDecision { value }
                    notReferredReason { value }
                    notSelectedReason { value }
                }
            }
        }
        GRAPHQL;

    protected string $filterQuery = <<<'GRAPHQL'
        query FilteredTrackedUsers($id: UUID!, $where: TalentRequestTrackedUserFilterInput) {
            talentRequest(id: $id) {
                trackedUsers(where: $where) {
                    user { id }
                    referralDecision { value }
                    selectionDecision { value }
                }
            }
        }
        GRAPHQL;

    protected string $bulkUpdateReferredMutation = <<<'GRAPHQL'
        mutation UpdateTrackedUsersReferred($ids: [UUID!]!) {
            updateTrackedUsersReferred(ids: $ids) {
                id
                referralDecision { value }
                notReferredReason { value }
            }
        }
        GRAPHQL;

    protected string $bulkCreateReferredMutation = <<<'GRAPHQL'
        mutation CreateTrackedUsersReferred($userIds: [UUID!]!, $talentRequestId: UUID!) {
            createTrackedUsersReferred(userIds: $userIds, talentRequestId: $talentRequestId)
        }
        GRAPHQL;

    protected string $bulkCreateNotReferredMutation = <<<'GRAPHQL'
        mutation CreateTrackedUsersNotReferred(
            $userIds: [UUID!]!
            $talentRequestId: UUID!
            $notReferredReason: TalentRequestTrackedUserNotReferredReason!
        ) {
            createTrackedUsersNotReferred(
                userIds: $userIds
                talentRequestId: $talentRequestId
                notReferredReason: $notReferredReason
            )
        }
        GRAPHQL;

    protected string $bulkUpdateNotReferredMutation = <<<'GRAPHQL'
        mutation UpdateTrackedUsersNotReferred($ids: [UUID!]!, $notReferredReason: TalentRequestTrackedUserNotReferredReason!) {
            updateTrackedUsersNotReferred(ids: $ids, notReferredReason: $notReferredReason) {
                id
                referralDecision { value }
                notReferredReason { value }
                selectionDecision { value }
                notSelectedReason { value }
            }
        }
        GRAPHQL;

    protected string $bulkUpdateSelectedMutation = <<<'GRAPHQL'
        mutation UpdateTrackedUsersSelected($ids: [UUID!]!) {
            updateTrackedUsersSelected(ids: $ids) {
                id
                referralDecision { value }
                notReferredReason { value }
                selectionDecision { value }
            }
        }
        GRAPHQL;

    protected string $bulkUpdateNotSelectedMutation = <<<'GRAPHQL'
        mutation UpdateTrackedUsersNotSelected($ids: [UUID!]!, $notSelectedReason: TalentRequestTrackedUserNotSelectedReason!) {
            updateTrackedUsersNotSelected(ids: $ids, notSelectedReason: $notSelectedReason) {
                id
                referralDecision { value }
                selectionDecision { value }
                notSelectedReason { value }
            }
        }
        GRAPHQL;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed([
            RolePermissionSeeder::class,
            DepartmentSeeder::class,
        ]);

        $this->community = Community::factory()->create();

        $this->admin = User::factory()
            ->asAdmin()
            ->create([
                'email' => 'admin@test.com',
                'sub' => 'admin@test.com',
            ]);

        $this->recruiter = User::factory()
            ->asCommunityRecruiter([$this->community->id])
            ->create([
                'email' => 'recruiter@test.com',
                'sub' => 'recruiter@test.com',
            ]);
    }

    private function createRequest(): TalentRequest
    {
        return TalentRequest::factory()->create(['community_id' => $this->community->id]);
    }

    public function testReturnsEmptyArrayWhenNoTrackedUsers(): void
    {
        $request = $this->createRequest();

        $this->actingAs($this->admin, 'api')
            ->graphQL($this->query, ['id' => $request->id])
            ->assertJson(['data' => ['talentRequest' => ['trackedUsers' => []]]]);
    }

    /**
     * @return array<string, array{0: string, 1: array<string, mixed>}>
     */
    public static function decisionFieldsProvider(): array
    {
        return [
            'no decisions' => [
                'default',
                [
                    'referralDecision' => null,
                    'selectionDecision' => null,
                    'notReferredReason' => null,
                    'notSelectedReason' => null,
                ],
            ],
            'referred' => [
                'referred',
                [
                    'referralDecision' => ['value' => TalentRequestTrackedUserReferralDecision::REFERRED->name],
                    'selectionDecision' => null,
                    'notReferredReason' => null,
                    'notSelectedReason' => null,
                ],
            ],
            'not referred with reason' => [
                'notReferred',
                [
                    'referralDecision' => ['value' => TalentRequestTrackedUserReferralDecision::NOT_REFERRED->name],
                    'notReferredReason' => ['value' => TalentRequestTrackedUserNotReferredReason::OTHER->name],
                    'selectionDecision' => null,
                    'notSelectedReason' => null,
                ],
            ],
            'selected' => [
                'selected',
                [
                    'referralDecision' => ['value' => TalentRequestTrackedUserReferralDecision::REFERRED->name],
                    'selectionDecision' => ['value' => TalentRequestTrackedUserSelectionDecision::SELECTED->name],
                    'notReferredReason' => null,
                    'notSelectedReason' => null,
                ],
            ],
            'not selected with reason' => [
                'notSelected',
                [
                    'referralDecision' => ['value' => TalentRequestTrackedUserReferralDecision::REFERRED->name],
                    'selectionDecision' => ['value' => TalentRequestTrackedUserSelectionDecision::NOT_SELECTED->name],
                    'notSelectedReason' => ['value' => TalentRequestTrackedUserNotSelectedReason::OTHER->name],
                    'notReferredReason' => null,
                ],
            ],
        ];
    }

    /**
     * @param  array<string, mixed>  $expected
     */
    #[DataProvider('decisionFieldsProvider')]
    public function testDecisionFieldsResolve(string $state, array $expected): void
    {
        $request = $this->createRequest();
        $user = User::factory()->create();

        $factory = match ($state) {
            'default' => TalentRequestTrackedUser::factory(),
            'referred' => TalentRequestTrackedUser::factory()->referred(),
            'notReferred' => TalentRequestTrackedUser::factory()->notReferred(TalentRequestTrackedUserNotReferredReason::OTHER),
            'selected' => TalentRequestTrackedUser::factory()->selected(),
            'notSelected' => TalentRequestTrackedUser::factory()->notSelected(TalentRequestTrackedUserNotSelectedReason::OTHER),
        };
        $factory->create([
            'talent_request_id' => $request->id,
            'user_id' => $user->id,
        ]);

        $this->actingAs($this->admin, 'api')
            ->graphQL($this->query, ['id' => $request->id])
            ->assertJsonFragment([
                'user' => ['id' => $user->id],
                ...$expected,
            ]);
    }

    /**
     * @return array<string, array{0: int, 1: int}>
     */
    public static function skillCountProvider(): array
    {
        return [
            'no matching skills' => [0, 0],
            'one matching skill' => [1, 1],
            'all matching skills' => [3, 3],
        ];
    }

    #[DataProvider('skillCountProvider')]
    public function testSkillCountCountsOnlyApplicantFilterSkills(int $matching, int $expected): void
    {
        $filterSkills = Skill::factory()->count(3)->create();
        $filter = ApplicantFilter::factory()->create(['community_id' => $this->community->id]);
        $filter->skills()->sync($filterSkills->pluck('id')->all());

        $request = TalentRequest::factory()->create([
            'community_id' => $this->community->id,
            'applicant_filter_id' => $filter->id,
        ]);

        $user = User::factory()->create();
        // an unrelated skill that must never be counted
        UserSkill::factory()->create(['user_id' => $user->id, 'skill_id' => Skill::factory()->create()->id]);
        foreach ($filterSkills->take($matching) as $skill) {
            UserSkill::factory()->create(['user_id' => $user->id, 'skill_id' => $skill->id]);
        }

        TalentRequestTrackedUser::factory()->create([
            'talent_request_id' => $request->id,
            'user_id' => $user->id,
        ]);

        $this->actingAs($this->admin, 'api')
            ->graphQL($this->query, ['id' => $request->id])
            ->assertJsonFragment([
                'user' => ['id' => $user->id],
                'skillCount' => $expected,
            ]);
    }

    public function testPlatformAdminSeesAllTrackedUsers(): void
    {
        $request = $this->createRequest();
        $users = User::factory()->count(3)->create();
        foreach ($users as $user) {
            TalentRequestTrackedUser::factory()->create([
                'talent_request_id' => $request->id,
                'user_id' => $user->id,
            ]);
        }

        $this->actingAs($this->admin, 'api')
            ->graphQL($this->query, ['id' => $request->id])
            ->assertJsonCount(3, 'data.talentRequest.trackedUsers');
    }

    public function testTrackedUsersFilteredToThoseTheViewerCanSee(): void
    {
        $request = $this->createRequest();

        // viewable: applicant with a submitted candidate in a published pool of the community
        $pool = Pool::factory()->for($this->admin)->published()
            ->create(['community_id' => $this->community->id]);
        $viewableUser = User::factory()->asApplicant()->create();
        PoolCandidate::factory()->for($viewableUser)->for($pool)
            ->create(['submitted_at' => CarbonImmutable::now()]);

        // hidden: plain applicant with no candidacy in the community
        $hiddenUser = User::factory()->asApplicant()->create();

        foreach ([$viewableUser, $hiddenUser] as $user) {
            TalentRequestTrackedUser::factory()->create([
                'talent_request_id' => $request->id,
                'user_id' => $user->id,
            ]);
        }

        $this->actingAs($this->recruiter, 'api')
            ->graphQL($this->query, ['id' => $request->id])
            ->assertJsonCount(1, 'data.talentRequest.trackedUsers')
            ->assertJsonFragment(['user' => ['id' => $viewableUser->id]])
            ->assertJsonMissing(['user' => ['id' => $hiddenUser->id]]);
    }

    /**
     * @return array<string, array{0: string}>
     */
    public static function cannotViewRequestProvider(): array
    {
        return [
            'applicant' => ['applicant'],
            'recruiter of other community' => ['other_recruiter'],
        ];
    }

    #[DataProvider('cannotViewRequestProvider')]
    public function testRolesWithoutAccessCannotViewRequest(string $role): void
    {
        $request = $this->createRequest();

        $actor = match ($role) {
            'applicant' => User::factory()->asApplicant()->create(),
            'other_recruiter' => User::factory()->asCommunityRecruiter([Community::factory()->create()->id])->create(),
        };

        $this->actingAs($actor, 'api')
            ->graphQL($this->query, ['id' => $request->id])
            ->assertGraphQLErrorMessage('This action is unauthorized.');
    }

    public function testUnauthenticatedCannotViewRequest(): void
    {
        $request = $this->createRequest();

        $this->graphQL($this->query, ['id' => $request->id])
            ->assertGraphQLErrorMessage('Unauthenticated.');
    }

    /**
     * @return array<string, array{0: array<int, string>, 1: array<int, string>}>
     */
    public static function referralFilterProvider(): array
    {
        return [
            'referred only' => [
                [TalentRequestTrackedUserReferralDecision::REFERRED->name],
                ['referred'],
            ],
            'not referred only' => [
                [TalentRequestTrackedUserReferralDecision::NOT_REFERRED->name],
                ['notReferred'],
            ],
            'both decisions' => [
                [
                    TalentRequestTrackedUserReferralDecision::REFERRED->name,
                    TalentRequestTrackedUserReferralDecision::NOT_REFERRED->name,
                ],
                ['referred', 'notReferred'],
            ],
        ];
    }

    /**
     * @param  array<int, string>  $filter
     * @param  array<int, string>  $expectedKeys
     */
    #[DataProvider('referralFilterProvider')]
    public function testFilterByReferralDecisions(array $filter, array $expectedKeys): void
    {
        $request = $this->createRequest();
        $users = [
            'referred' => User::factory()->create(),
            'notReferred' => User::factory()->create(),
        ];

        TalentRequestTrackedUser::factory()->referred()->create([
            'talent_request_id' => $request->id,
            'user_id' => $users['referred']->id,
        ]);
        TalentRequestTrackedUser::factory()->notReferred()->create([
            'talent_request_id' => $request->id,
            'user_id' => $users['notReferred']->id,
        ]);

        $response = $this->actingAs($this->admin, 'api')
            ->graphQL($this->filterQuery, [
                'id' => $request->id,
                'where' => ['referralDecisions' => $filter],
            ])
            ->assertJsonCount(count($expectedKeys), 'data.talentRequest.trackedUsers');

        foreach ($expectedKeys as $key) {
            $response->assertJsonFragment(['user' => ['id' => $users[$key]->id]]);
        }
    }

    /**
     * @return array<string, array{0: array<int, string>, 1: array<int, string>}>
     */
    public static function selectionFilterProvider(): array
    {
        return [
            'selected only' => [
                [TalentRequestTrackedUserSelectionDecision::SELECTED->name],
                ['selected'],
            ],
            'not selected only' => [
                [TalentRequestTrackedUserSelectionDecision::NOT_SELECTED->name],
                ['notSelected'],
            ],
            'both decisions' => [
                [
                    TalentRequestTrackedUserSelectionDecision::SELECTED->name,
                    TalentRequestTrackedUserSelectionDecision::NOT_SELECTED->name,
                ],
                ['selected', 'notSelected'],
            ],
        ];
    }

    /**
     * @param  array<int, string>  $filter
     * @param  array<int, string>  $expectedKeys
     */
    #[DataProvider('selectionFilterProvider')]
    public function testFilterBySelectionDecisions(array $filter, array $expectedKeys): void
    {
        $request = $this->createRequest();
        $users = [
            'selected' => User::factory()->create(),
            'notSelected' => User::factory()->create(),
        ];

        TalentRequestTrackedUser::factory()->selected()->create([
            'talent_request_id' => $request->id,
            'user_id' => $users['selected']->id,
        ]);
        TalentRequestTrackedUser::factory()->notSelected()->create([
            'talent_request_id' => $request->id,
            'user_id' => $users['notSelected']->id,
        ]);

        $response = $this->actingAs($this->admin, 'api')
            ->graphQL($this->filterQuery, [
                'id' => $request->id,
                'where' => ['selectionDecisions' => $filter],
            ])
            ->assertJsonCount(count($expectedKeys), 'data.talentRequest.trackedUsers');

        foreach ($expectedKeys as $key) {
            $response->assertJsonFragment(['user' => ['id' => $users[$key]->id]]);
        }
    }

    public function testUpdateTrackedUsersReferredBulkIdsMutation(): void
    {
        $request = $this->createRequest();
        $users = User::factory()->count(3)->create();

        $toUpdateA = TalentRequestTrackedUser::factory()->notReferred(TalentRequestTrackedUserNotReferredReason::OTHER)->create([
            'talent_request_id' => $request->id,
            'user_id' => $users[0]->id,
        ]);
        $toUpdateB = TalentRequestTrackedUser::factory()->notReferred(TalentRequestTrackedUserNotReferredReason::OTHER)->create([
            'talent_request_id' => $request->id,
            'user_id' => $users[1]->id,
        ]);
        $untouched = TalentRequestTrackedUser::factory()->notReferred(TalentRequestTrackedUserNotReferredReason::OTHER)->create([
            'talent_request_id' => $request->id,
            'user_id' => $users[2]->id,
        ]);

        $this->actingAs($this->recruiter, 'api')
            ->graphQL($this->bulkUpdateReferredMutation, [
                'ids' => [$toUpdateA->id, $toUpdateB->id],
            ])
            ->assertGraphQLErrorFree()
            ->assertJsonCount(2, 'data.updateTrackedUsersReferred')
            ->assertJsonFragment([
                'id' => $toUpdateA->id,
                'referralDecision' => ['value' => TalentRequestTrackedUserReferralDecision::REFERRED->name],
                'notReferredReason' => null,
            ])
            ->assertJsonFragment([
                'id' => $toUpdateB->id,
                'referralDecision' => ['value' => TalentRequestTrackedUserReferralDecision::REFERRED->name],
                'notReferredReason' => null,
            ]);

        $this->assertDatabaseHas('talent_request_tracked_users', [
            'id' => $toUpdateA->id,
            'referral_decision' => TalentRequestTrackedUserReferralDecision::REFERRED->name,
            'not_referred_reason' => null,
        ]);
        $this->assertDatabaseHas('talent_request_tracked_users', [
            'id' => $toUpdateB->id,
            'referral_decision' => TalentRequestTrackedUserReferralDecision::REFERRED->name,
            'not_referred_reason' => null,
        ]);
        $this->assertDatabaseHas('talent_request_tracked_users', [
            'id' => $untouched->id,
            'referral_decision' => TalentRequestTrackedUserReferralDecision::NOT_REFERRED->name,
            'not_referred_reason' => TalentRequestTrackedUserNotReferredReason::OTHER->name,
        ]);
    }

    public function testUnauthorizedUserCannotUpdateTrackedUsersReferredBulkIdsMutation(): void
    {
        $request = $this->createRequest();
        $trackedUser = TalentRequestTrackedUser::factory()->notReferred(TalentRequestTrackedUserNotReferredReason::OTHER)->create([
            'talent_request_id' => $request->id,
            'user_id' => User::factory()->create()->id,
        ]);
        $unauthorizedUser = User::factory()->asApplicant()->create();

        $this->actingAs($unauthorizedUser, 'api')
            ->graphQL($this->bulkUpdateReferredMutation, [
                'ids' => [$trackedUser->id],
            ])
            ->assertGraphQLErrorMessage('This action is unauthorized.');

        $this->assertDatabaseHas('talent_request_tracked_users', [
            'id' => $trackedUser->id,
            'referral_decision' => TalentRequestTrackedUserReferralDecision::NOT_REFERRED->name,
            'not_referred_reason' => TalentRequestTrackedUserNotReferredReason::OTHER->name,
        ]);
    }

    public function testCreateTrackedUsersReferred(): void
    {
        $request = $this->createRequest();
        $users = User::factory()->count(3)->create();

        $existing = TalentRequestTrackedUser::factory()->notReferred(TalentRequestTrackedUserNotReferredReason::OTHER)->create([
            'talent_request_id' => $request->id,
            'user_id' => $users[0]->id,
        ]);

        $this->actingAs($this->recruiter, 'api')
            ->graphQL($this->bulkCreateReferredMutation, [
                'userIds' => [$users[0]->id, $users[1]->id],
                'talentRequestId' => $request->id,
            ])
            ->assertGraphQLErrorFree()
            ->assertJsonFragment([
                'createTrackedUsersReferred' => true,
            ]);

        $this->assertDatabaseHas('talent_request_tracked_users', [
            'id' => $existing->id,
            'talent_request_id' => $request->id,
            'user_id' => $users[0]->id,
            'referral_decision' => TalentRequestTrackedUserReferralDecision::REFERRED->name,
            'not_referred_reason' => null,
        ]);
        $this->assertDatabaseHas('talent_request_tracked_users', [
            'talent_request_id' => $request->id,
            'user_id' => $users[1]->id,
            'referral_decision' => TalentRequestTrackedUserReferralDecision::REFERRED->name,
            'not_referred_reason' => null,
        ]);
        $this->assertDatabaseMissing('talent_request_tracked_users', [
            'talent_request_id' => $request->id,
            'user_id' => $users[2]->id,
        ]);
        $this->assertDatabaseCount('talent_request_tracked_users', 2);
    }

    public function testUnauthorizedUserCannotCreateTrackedUsersReferred(): void
    {
        $request = $this->createRequest();
        $user = User::factory()->create();
        $unauthorizedUser = User::factory()->asApplicant()->create();

        $this->actingAs($unauthorizedUser, 'api')
            ->graphQL($this->bulkCreateReferredMutation, [
                'userIds' => [$user->id],
                'talentRequestId' => $request->id,
            ])
            ->assertGraphQLErrorMessage('This action is unauthorized.');

        $this->assertDatabaseMissing('talent_request_tracked_users', [
            'talent_request_id' => $request->id,
            'user_id' => $user->id,
        ]);
    }

    public function testCreateTrackedUsersNotReferred(): void
    {
        $request = $this->createRequest();
        $users = User::factory()->count(3)->create();

        $existing = TalentRequestTrackedUser::factory()->selected()->create([
            'talent_request_id' => $request->id,
            'user_id' => $users[0]->id,
        ]);

        $this->actingAs($this->recruiter, 'api')
            ->graphQL($this->bulkCreateNotReferredMutation, [
                'userIds' => [$users[0]->id, $users[1]->id],
                'talentRequestId' => $request->id,
                'notReferredReason' => TalentRequestTrackedUserNotReferredReason::OTHER->name,
            ])
            ->assertGraphQLErrorFree()
            ->assertJsonFragment([
                'createTrackedUsersNotReferred' => true,
            ]);

        $this->assertDatabaseHas('talent_request_tracked_users', [
            'id' => $existing->id,
            'talent_request_id' => $request->id,
            'user_id' => $users[0]->id,
            'referral_decision' => TalentRequestTrackedUserReferralDecision::NOT_REFERRED->name,
            'not_referred_reason' => TalentRequestTrackedUserNotReferredReason::OTHER->name,
            'selection_decision' => null,
            'not_selected_reason' => null,
        ]);
        $this->assertDatabaseHas('talent_request_tracked_users', [
            'talent_request_id' => $request->id,
            'user_id' => $users[1]->id,
            'referral_decision' => TalentRequestTrackedUserReferralDecision::NOT_REFERRED->name,
            'not_referred_reason' => TalentRequestTrackedUserNotReferredReason::OTHER->name,
            'selection_decision' => null,
            'not_selected_reason' => null,
        ]);
        $this->assertDatabaseMissing('talent_request_tracked_users', [
            'talent_request_id' => $request->id,
            'user_id' => $users[2]->id,
        ]);
        $this->assertDatabaseCount('talent_request_tracked_users', 2);
    }

    public function testUnauthorizedUserCannotCreateTrackedUsersNotReferred(): void
    {
        $request = $this->createRequest();
        $user = User::factory()->create();
        $unauthorizedUser = User::factory()->asApplicant()->create();

        $this->actingAs($unauthorizedUser, 'api')
            ->graphQL($this->bulkCreateNotReferredMutation, [
                'userIds' => [$user->id],
                'talentRequestId' => $request->id,
                'notReferredReason' => TalentRequestTrackedUserNotReferredReason::OTHER->name,
            ])
            ->assertGraphQLErrorMessage('This action is unauthorized.');

        $this->assertDatabaseMissing('talent_request_tracked_users', [
            'talent_request_id' => $request->id,
            'user_id' => $user->id,
        ]);
    }

    public function testUpdateTrackedUsersNotReferredBulkIdsMutation(): void
    {
        $request = $this->createRequest();
        $users = User::factory()->count(3)->create();

        $toUpdateA = TalentRequestTrackedUser::factory()->selected()->create([
            'talent_request_id' => $request->id,
            'user_id' => $users[0]->id,
        ]);
        $toUpdateB = TalentRequestTrackedUser::factory()->selected()->create([
            'talent_request_id' => $request->id,
            'user_id' => $users[1]->id,
        ]);
        $untouched = TalentRequestTrackedUser::factory()->selected()->create([
            'talent_request_id' => $request->id,
            'user_id' => $users[2]->id,
        ]);

        $this->actingAs($this->recruiter, 'api')
            ->graphQL($this->bulkUpdateNotReferredMutation, [
                'ids' => [$toUpdateA->id, $toUpdateB->id],
                'notReferredReason' => TalentRequestTrackedUserNotReferredReason::OTHER->name,
            ])
            ->assertGraphQLErrorFree()
            ->assertJsonCount(2, 'data.updateTrackedUsersNotReferred')
            ->assertJsonFragment([
                'id' => $toUpdateA->id,
                'referralDecision' => ['value' => TalentRequestTrackedUserReferralDecision::NOT_REFERRED->name],
                'notReferredReason' => ['value' => TalentRequestTrackedUserNotReferredReason::OTHER->name],
                'selectionDecision' => null,
                'notSelectedReason' => null,
            ])
            ->assertJsonFragment([
                'id' => $toUpdateB->id,
                'referralDecision' => ['value' => TalentRequestTrackedUserReferralDecision::NOT_REFERRED->name],
                'notReferredReason' => ['value' => TalentRequestTrackedUserNotReferredReason::OTHER->name],
                'selectionDecision' => null,
                'notSelectedReason' => null,
            ]);

        $this->assertDatabaseHas('talent_request_tracked_users', [
            'id' => $toUpdateA->id,
            'referral_decision' => TalentRequestTrackedUserReferralDecision::NOT_REFERRED->name,
            'not_referred_reason' => TalentRequestTrackedUserNotReferredReason::OTHER->name,
            'selection_decision' => null,
            'not_selected_reason' => null,
        ]);
        $this->assertDatabaseHas('talent_request_tracked_users', [
            'id' => $toUpdateB->id,
            'referral_decision' => TalentRequestTrackedUserReferralDecision::NOT_REFERRED->name,
            'not_referred_reason' => TalentRequestTrackedUserNotReferredReason::OTHER->name,
            'selection_decision' => null,
            'not_selected_reason' => null,
        ]);
        $this->assertDatabaseHas('talent_request_tracked_users', [
            'id' => $untouched->id,
            'selection_decision' => TalentRequestTrackedUserSelectionDecision::SELECTED->name,
        ]);
    }

    public function testUnauthorizedUserCannotUpdateTrackedUsersNotReferredBulkIdsMutation(): void
    {
        $request = $this->createRequest();
        $trackedUser = TalentRequestTrackedUser::factory()->selected()->create([
            'talent_request_id' => $request->id,
            'user_id' => User::factory()->create()->id,
        ]);
        $unauthorizedUser = User::factory()->asApplicant()->create();

        $this->actingAs($unauthorizedUser, 'api')
            ->graphQL($this->bulkUpdateNotReferredMutation, [
                'ids' => [$trackedUser->id],
                'notReferredReason' => TalentRequestTrackedUserNotReferredReason::OTHER->name,
            ])
            ->assertGraphQLErrorMessage('This action is unauthorized.');

        $this->assertDatabaseHas('talent_request_tracked_users', [
            'id' => $trackedUser->id,
            'selection_decision' => TalentRequestTrackedUserSelectionDecision::SELECTED->name,
            'referral_decision' => TalentRequestTrackedUserReferralDecision::REFERRED->name,
            'not_referred_reason' => null,
        ]);
    }

    public function testUpdateTrackedUsersSelectedBulkIdsMutation(): void
    {
        $request = $this->createRequest();
        $users = User::factory()->count(3)->create();

        $toUpdateA = TalentRequestTrackedUser::factory()->notSelected(TalentRequestTrackedUserNotSelectedReason::OTHER)->create([
            'talent_request_id' => $request->id,
            'user_id' => $users[0]->id,
        ]);
        $toUpdateB = TalentRequestTrackedUser::factory()->notSelected(TalentRequestTrackedUserNotSelectedReason::OTHER)->create([
            'talent_request_id' => $request->id,
            'user_id' => $users[1]->id,
        ]);
        $untouched = TalentRequestTrackedUser::factory()->notSelected(TalentRequestTrackedUserNotSelectedReason::OTHER)->create([
            'talent_request_id' => $request->id,
            'user_id' => $users[2]->id,
        ]);

        $this->actingAs($this->recruiter, 'api')
            ->graphQL($this->bulkUpdateSelectedMutation, [
                'ids' => [$toUpdateA->id, $toUpdateB->id],
            ])
            ->assertGraphQLErrorFree()
            ->assertJsonCount(2, 'data.updateTrackedUsersSelected')
            ->assertJsonFragment([
                'id' => $toUpdateA->id,
                'referralDecision' => ['value' => TalentRequestTrackedUserReferralDecision::REFERRED->name],
                'selectionDecision' => ['value' => TalentRequestTrackedUserSelectionDecision::SELECTED->name],
                'notReferredReason' => null,
            ])
            ->assertJsonFragment([
                'id' => $toUpdateB->id,
                'referralDecision' => ['value' => TalentRequestTrackedUserReferralDecision::REFERRED->name],
                'selectionDecision' => ['value' => TalentRequestTrackedUserSelectionDecision::SELECTED->name],
                'notReferredReason' => null,
            ]);

        $this->assertDatabaseHas('talent_request_tracked_users', [
            'id' => $toUpdateA->id,
            'referral_decision' => TalentRequestTrackedUserReferralDecision::REFERRED->name,
            'selection_decision' => TalentRequestTrackedUserSelectionDecision::SELECTED->name,
            'not_referred_reason' => null,
        ]);
        $this->assertDatabaseHas('talent_request_tracked_users', [
            'id' => $toUpdateB->id,
            'referral_decision' => TalentRequestTrackedUserReferralDecision::REFERRED->name,
            'selection_decision' => TalentRequestTrackedUserSelectionDecision::SELECTED->name,
            'not_referred_reason' => null,
        ]);
        $this->assertDatabaseHas('talent_request_tracked_users', [
            'id' => $untouched->id,
            'selection_decision' => TalentRequestTrackedUserSelectionDecision::NOT_SELECTED->name,
        ]);
    }

    public function testUnauthorizedUserCannotUpdateTrackedUsersSelectedBulkIdsMutation(): void
    {
        $request = $this->createRequest();
        $trackedUser = TalentRequestTrackedUser::factory()->notSelected(TalentRequestTrackedUserNotSelectedReason::OTHER)->create([
            'talent_request_id' => $request->id,
            'user_id' => User::factory()->create()->id,
        ]);
        $unauthorizedUser = User::factory()->asApplicant()->create();

        $this->actingAs($unauthorizedUser, 'api')
            ->graphQL($this->bulkUpdateSelectedMutation, [
                'ids' => [$trackedUser->id],
            ])
            ->assertGraphQLErrorMessage('This action is unauthorized.');

        $this->assertDatabaseHas('talent_request_tracked_users', [
            'id' => $trackedUser->id,
            'selection_decision' => TalentRequestTrackedUserSelectionDecision::NOT_SELECTED->name,
            'not_selected_reason' => TalentRequestTrackedUserNotSelectedReason::OTHER->name,
        ]);
    }

    public function testUpdateTrackedUsersNotSelectedBulkIdsMutation(): void
    {
        $request = $this->createRequest();
        $users = User::factory()->count(3)->create();

        $toUpdateA = TalentRequestTrackedUser::factory()->selected()->create([
            'talent_request_id' => $request->id,
            'user_id' => $users[0]->id,
        ]);
        $toUpdateB = TalentRequestTrackedUser::factory()->selected()->create([
            'talent_request_id' => $request->id,
            'user_id' => $users[1]->id,
        ]);
        $untouched = TalentRequestTrackedUser::factory()->selected()->create([
            'talent_request_id' => $request->id,
            'user_id' => $users[2]->id,
        ]);

        $this->actingAs($this->recruiter, 'api')
            ->graphQL($this->bulkUpdateNotSelectedMutation, [
                'ids' => [$toUpdateA->id, $toUpdateB->id],
                'notSelectedReason' => TalentRequestTrackedUserNotSelectedReason::OTHER->name,
            ])
            ->assertGraphQLErrorFree()
            ->assertJsonCount(2, 'data.updateTrackedUsersNotSelected')
            ->assertJsonFragment([
                'id' => $toUpdateA->id,
                'referralDecision' => ['value' => TalentRequestTrackedUserReferralDecision::REFERRED->name],
                'selectionDecision' => ['value' => TalentRequestTrackedUserSelectionDecision::NOT_SELECTED->name],
                'notSelectedReason' => ['value' => TalentRequestTrackedUserNotSelectedReason::OTHER->name],
            ])
            ->assertJsonFragment([
                'id' => $toUpdateB->id,
                'referralDecision' => ['value' => TalentRequestTrackedUserReferralDecision::REFERRED->name],
                'selectionDecision' => ['value' => TalentRequestTrackedUserSelectionDecision::NOT_SELECTED->name],
                'notSelectedReason' => ['value' => TalentRequestTrackedUserNotSelectedReason::OTHER->name],
            ]);

        $this->assertDatabaseHas('talent_request_tracked_users', [
            'id' => $toUpdateA->id,
            'referral_decision' => TalentRequestTrackedUserReferralDecision::REFERRED->name,
            'selection_decision' => TalentRequestTrackedUserSelectionDecision::NOT_SELECTED->name,
            'not_selected_reason' => TalentRequestTrackedUserNotSelectedReason::OTHER->name,
        ]);
        $this->assertDatabaseHas('talent_request_tracked_users', [
            'id' => $toUpdateB->id,
            'referral_decision' => TalentRequestTrackedUserReferralDecision::REFERRED->name,
            'selection_decision' => TalentRequestTrackedUserSelectionDecision::NOT_SELECTED->name,
            'not_selected_reason' => TalentRequestTrackedUserNotSelectedReason::OTHER->name,
        ]);
        $this->assertDatabaseHas('talent_request_tracked_users', [
            'id' => $untouched->id,
            'selection_decision' => TalentRequestTrackedUserSelectionDecision::SELECTED->name,
        ]);
    }

    public function testUnauthorizedUserCannotUpdateTrackedUsersNotSelectedBulkIdsMutation(): void
    {
        $request = $this->createRequest();
        $trackedUser = TalentRequestTrackedUser::factory()->selected()->create([
            'talent_request_id' => $request->id,
            'user_id' => User::factory()->create()->id,
        ]);
        $unauthorizedUser = User::factory()->asApplicant()->create();

        $this->actingAs($unauthorizedUser, 'api')
            ->graphQL($this->bulkUpdateNotSelectedMutation, [
                'ids' => [$trackedUser->id],
                'notSelectedReason' => TalentRequestTrackedUserNotSelectedReason::OTHER->name,
            ])
            ->assertGraphQLErrorMessage('This action is unauthorized.');

        $this->assertDatabaseHas('talent_request_tracked_users', [
            'id' => $trackedUser->id,
            'selection_decision' => TalentRequestTrackedUserSelectionDecision::SELECTED->name,
            'not_selected_reason' => null,
        ]);
    }
}
