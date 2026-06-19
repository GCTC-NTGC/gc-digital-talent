<?php

namespace Tests\Feature;

use App\Enums\TalentRequestSource;
use App\Enums\TalentRequestTrackedUserNotReferredReason;
use App\Enums\TalentRequestTrackedUserNotSelectedReason;
use App\Enums\TalentRequestTrackedUserReferralDecision;
use App\Enums\TalentRequestTrackedUserSelectionDecision;
use App\Enums\TalentRequestTrackedUserStatus;
use App\Jobs\GenerateUserFile;
use App\Models\ApplicantFilter;
use App\Models\Classification;
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
use Illuminate\Support\Facades\Queue;
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
                    status { value }
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

    protected string $paginatedQuery = <<<'GRAPHQL'
        query PaginatedTrackedUsers($talentRequestId: UUID!, $where: TalentRequestTrackedUserFilterInput) {
            talentRequestTrackedUsers(talentRequestId: $talentRequestId, where: $where) {
                data {
                    skillCount
                    user { id }
                    referralDecision { value }
                    selectionDecision { value }
                }
                paginatorInfo { total }
            }
        }
        GRAPHQL;

    protected string $sourcesQuery = <<<'GRAPHQL'
        query SourcesTrackedUsers($talentRequestId: UUID!) {
            talentRequestTrackedUsers(talentRequestId: $talentRequestId) {
                data {
                    user { id }
                    sources
                    matchingQualifiedInPoolSources { pool { id } }
                    matchingAtLevelSources { id }
                    matchingAdvancementSources { id }
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
                selectionDecision { value }
                notSelectedReason { value }
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
                    'status' => null,
                    'referralDecision' => null,
                    'selectionDecision' => null,
                    'notReferredReason' => null,
                    'notSelectedReason' => null,
                ],
            ],
            'referred' => [
                'referred',
                [
                    'status' => ['value' => TalentRequestTrackedUserStatus::REFERRED->name],
                    'referralDecision' => ['value' => TalentRequestTrackedUserReferralDecision::REFERRED->name],
                    'selectionDecision' => null,
                    'notReferredReason' => null,
                    'notSelectedReason' => null,
                ],
            ],
            'not referred with reason' => [
                'notReferred',
                [
                    'status' => ['value' => TalentRequestTrackedUserStatus::NOT_REFERRED->name],
                    'referralDecision' => ['value' => TalentRequestTrackedUserReferralDecision::NOT_REFERRED->name],
                    'notReferredReason' => ['value' => TalentRequestTrackedUserNotReferredReason::OTHER->name],
                    'selectionDecision' => null,
                    'notSelectedReason' => null,
                ],
            ],
            'selected' => [
                'selected',
                [
                    'status' => ['value' => TalentRequestTrackedUserStatus::SELECTED->name],
                    'referralDecision' => ['value' => TalentRequestTrackedUserReferralDecision::REFERRED->name],
                    'selectionDecision' => ['value' => TalentRequestTrackedUserSelectionDecision::SELECTED->name],
                    'notReferredReason' => null,
                    'notSelectedReason' => null,
                ],
            ],
            'not selected with reason' => [
                'notSelected',
                [
                    'status' => ['value' => TalentRequestTrackedUserStatus::NOT_SELECTED->name],
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
    public static function statusFilterProvider(): array
    {
        return [
            // "Referred" is the awaiting-decision state: a selected/not-selected user was
            // also referred, but their current status is the selection decision, so they
            // must NOT show up here.
            'referred (awaiting decision) only' => [
                [TalentRequestTrackedUserStatus::REFERRED->name],
                ['referred'],
            ],
            'not referred only' => [
                [TalentRequestTrackedUserStatus::NOT_REFERRED->name],
                ['notReferred'],
            ],
            'selected only' => [
                [TalentRequestTrackedUserStatus::SELECTED->name],
                ['selected'],
            ],
            'not selected only' => [
                [TalentRequestTrackedUserStatus::NOT_SELECTED->name],
                ['notSelected'],
            ],
            'referred or selected' => [
                [
                    TalentRequestTrackedUserStatus::REFERRED->name,
                    TalentRequestTrackedUserStatus::SELECTED->name,
                ],
                ['referred', 'selected'],
            ],
            'all statuses' => [
                [
                    TalentRequestTrackedUserStatus::NOT_REFERRED->name,
                    TalentRequestTrackedUserStatus::REFERRED->name,
                    TalentRequestTrackedUserStatus::SELECTED->name,
                    TalentRequestTrackedUserStatus::NOT_SELECTED->name,
                ],
                ['notReferred', 'referred', 'selected', 'notSelected'],
            ],
        ];
    }

    /**
     * Seed one tracked user for each flow state on the given request.
     *
     * @return array<string, User>
     */
    private function seedTrackedUsersForEachStatus(TalentRequest $request): array
    {
        $users = [
            'notReferred' => User::factory()->create(),
            'referred' => User::factory()->create(),
            'selected' => User::factory()->create(),
            'notSelected' => User::factory()->create(),
        ];

        TalentRequestTrackedUser::factory()->notReferred()->create([
            'talent_request_id' => $request->id,
            'user_id' => $users['notReferred']->id,
        ]);
        TalentRequestTrackedUser::factory()->referred()->create([
            'talent_request_id' => $request->id,
            'user_id' => $users['referred']->id,
        ]);
        TalentRequestTrackedUser::factory()->selected()->create([
            'talent_request_id' => $request->id,
            'user_id' => $users['selected']->id,
        ]);
        TalentRequestTrackedUser::factory()->notSelected()->create([
            'talent_request_id' => $request->id,
            'user_id' => $users['notSelected']->id,
        ]);

        return $users;
    }

    /**
     * @param  array<int, string>  $filter
     * @param  array<int, string>  $expectedKeys
     */
    #[DataProvider('statusFilterProvider')]
    public function testFilterByStatus(array $filter, array $expectedKeys): void
    {
        $request = $this->createRequest();
        $users = $this->seedTrackedUsersForEachStatus($request);

        $response = $this->actingAs($this->admin, 'api')
            ->graphQL($this->filterQuery, [
                'id' => $request->id,
                'where' => ['statuses' => $filter],
            ])
            ->assertJsonCount(count($expectedKeys), 'data.talentRequest.trackedUsers');

        foreach ($expectedKeys as $key) {
            $response->assertJsonFragment(['user' => ['id' => $users[$key]->id]]);
        }
    }

    public function testPaginatedScopedToGivenRequest(): void
    {
        $request = $this->createRequest();
        $otherRequest = $this->createRequest();

        $included = User::factory()->create();
        $excluded = User::factory()->create();

        TalentRequestTrackedUser::factory()->create([
            'talent_request_id' => $request->id,
            'user_id' => $included->id,
        ]);
        TalentRequestTrackedUser::factory()->create([
            'talent_request_id' => $otherRequest->id,
            'user_id' => $excluded->id,
        ]);

        $this->actingAs($this->admin, 'api')
            ->graphQL($this->paginatedQuery, ['talentRequestId' => $request->id])
            ->assertJsonCount(1, 'data.talentRequestTrackedUsers.data')
            ->assertJsonFragment(['user' => ['id' => $included->id]])
            ->assertJsonMissing(['user' => ['id' => $excluded->id]]);
    }

    public function testPaginatedPlatformAdminSeesAllTrackedUsers(): void
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
            ->graphQL($this->paginatedQuery, ['talentRequestId' => $request->id])
            ->assertJsonCount(3, 'data.talentRequestTrackedUsers.data')
            ->assertJsonFragment(['total' => 3]);
    }

    public function testPaginatedTrackedUsersFilteredToThoseTheViewerCanSee(): void
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
            ->graphQL($this->paginatedQuery, ['talentRequestId' => $request->id])
            ->assertJsonCount(1, 'data.talentRequestTrackedUsers.data')
            ->assertJsonFragment(['user' => ['id' => $viewableUser->id]])
            ->assertJsonMissing(['user' => ['id' => $hiddenUser->id]]);
    }

    #[DataProvider('skillCountProvider')]
    public function testPaginatedSkillCountCountsOnlyApplicantFilterSkills(int $matching, int $expected): void
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
            ->graphQL($this->paginatedQuery, ['talentRequestId' => $request->id])
            ->assertJsonFragment([
                'user' => ['id' => $user->id],
                'skillCount' => $expected,
            ]);
    }

    #[DataProvider('cannotViewRequestProvider')]
    public function testPaginatedRolesWithoutAccessCannotViewRequest(string $role): void
    {
        $request = $this->createRequest();

        $actor = match ($role) {
            'applicant' => User::factory()->asApplicant()->create(),
            'other_recruiter' => User::factory()->asCommunityRecruiter([Community::factory()->create()->id])->create(),
        };

        $this->actingAs($actor, 'api')
            ->graphQL($this->paginatedQuery, ['talentRequestId' => $request->id])
            ->assertGraphQLErrorMessage('This action is unauthorized.');
    }

    public function testPaginatedUnauthenticatedCannotViewRequest(): void
    {
        $request = $this->createRequest();

        $this->graphQL($this->paginatedQuery, ['talentRequestId' => $request->id])
            ->assertGraphQLErrorMessage('Unauthenticated.');
    }

    /**
     * @param  array<int, string>  $filter
     * @param  array<int, string>  $expectedKeys
     */
    #[DataProvider('statusFilterProvider')]
    public function testPaginatedFilterByStatus(array $filter, array $expectedKeys): void
    {
        $request = $this->createRequest();
        $users = $this->seedTrackedUsersForEachStatus($request);

        $response = $this->actingAs($this->admin, 'api')
            ->graphQL($this->paginatedQuery, [
                'talentRequestId' => $request->id,
                'where' => ['statuses' => $filter],
            ])
            ->assertJsonCount(count($expectedKeys), 'data.talentRequestTrackedUsers.data');

        foreach ($expectedKeys as $key) {
            $response->assertJsonFragment(['user' => ['id' => $users[$key]->id]]);
        }
    }

    /**
     * @return array<string, array{0: string, 1: string}>
     */
    public static function generalSearchProvider(): array
    {
        return [
            'first name' => ['Alice', 'alice'],
            'last name' => ['Jones', 'bob'],
            'full name' => ['Alice Smith', 'alice'],
            'email' => ['bob@example', 'bob'],
        ];
    }

    #[DataProvider('generalSearchProvider')]
    public function testPaginatedGeneralSearchMatchesNameOrEmail(string $search, string $expectedKey): void
    {
        $request = $this->createRequest();
        $users = [
            'alice' => User::factory()->create([
                'first_name' => 'Alice',
                'last_name' => 'Smith',
                'email' => 'alice@example.com',
            ]),
            'bob' => User::factory()->create([
                'first_name' => 'Bob',
                'last_name' => 'Jones',
                'email' => 'bob@example.com',
            ]),
        ];

        foreach ($users as $user) {
            TalentRequestTrackedUser::factory()->create([
                'talent_request_id' => $request->id,
                'user_id' => $user->id,
            ]);
        }

        $this->actingAs($this->admin, 'api')
            ->graphQL($this->paginatedQuery, [
                'talentRequestId' => $request->id,
                'where' => ['generalSearch' => $search],
            ])
            ->assertJsonCount(1, 'data.talentRequestTrackedUsers.data')
            ->assertJsonFragment(['user' => ['id' => $users[$expectedKey]->id]]);
    }

    public function testPaginatedOrderBySkillCount(): void
    {
        $orderedQuery = <<<'GRAPHQL'
            query OrderedTrackedUsers($talentRequestId: UUID!, $orderBy: [AdvancedOrderByInput!]) {
                talentRequestTrackedUsers(talentRequestId: $talentRequestId, orderBy: $orderBy) {
                    data {
                        skillCount
                        user { id }
                    }
                }
            }
            GRAPHQL;

        $filterSkills = Skill::factory()->count(3)->create();
        $filter = ApplicantFilter::factory()->create(['community_id' => $this->community->id]);
        $filter->skills()->sync($filterSkills->pluck('id')->all());

        $request = TalentRequest::factory()->create([
            'community_id' => $this->community->id,
            'applicant_filter_id' => $filter->id,
        ]);

        // none / one / all matching skills
        $none = User::factory()->create();
        $one = User::factory()->create();
        $all = User::factory()->create();

        UserSkill::factory()->create(['user_id' => $one->id, 'skill_id' => $filterSkills[0]->id]);
        foreach ($filterSkills as $skill) {
            UserSkill::factory()->create(['user_id' => $all->id, 'skill_id' => $skill->id]);
        }

        foreach ([$none, $one, $all] as $user) {
            TalentRequestTrackedUser::factory()->create([
                'talent_request_id' => $request->id,
                'user_id' => $user->id,
            ]);
        }

        $descIds = $this->actingAs($this->admin, 'api')
            ->graphQL($orderedQuery, [
                'talentRequestId' => $request->id,
                'orderBy' => [['scope' => 'orderBySkillCount', 'direction' => 'DESC']],
            ])
            ->json('data.talentRequestTrackedUsers.data.*.user.id');
        $this->assertEquals([$all->id, $one->id, $none->id], $descIds);

        $ascIds = $this->actingAs($this->admin, 'api')
            ->graphQL($orderedQuery, [
                'talentRequestId' => $request->id,
                'orderBy' => [['scope' => 'orderBySkillCount', 'direction' => 'ASC']],
            ])
            ->json('data.talentRequestTrackedUsers.data.*.user.id');
        $this->assertEquals([$none->id, $one->id, $all->id], $ascIds);
    }

    public function testDownloadAllTrackedUsersExcelDispatchesJob(): void
    {
        Queue::fake();

        $request = $this->createRequest();
        $this->seedTrackedUsersForEachStatus($request);

        $this->actingAs($this->admin, 'api')
            ->graphQL(/** @lang GraphQL */ '
                mutation DownloadTrackedUsersExcel($talentRequestId: UUID!, $where: TalentRequestTrackedUserFilterInput) {
                    downloadTrackedUsersExcel(talentRequestId: $talentRequestId, where: $where)
                }
            ', [
                'talentRequestId' => $request->id,
                'where' => ['statuses' => [TalentRequestTrackedUserStatus::REFERRED->name]],
            ])
            ->assertJson(['data' => ['downloadTrackedUsersExcel' => true]]);

        Queue::assertPushed(GenerateUserFile::class);
    }

    #[DataProvider('cannotViewRequestProvider')]
    public function testDownloadAllTrackedUsersExcelRolesWithoutAccessCannotDownload(string $role): void
    {
        Queue::fake();

        $request = $this->createRequest();

        $actor = match ($role) {
            'applicant' => User::factory()->asApplicant()->create(),
            'other_recruiter' => User::factory()->asCommunityRecruiter([Community::factory()->create()->id])->create(),
        };

        $this->actingAs($actor, 'api')
            ->graphQL(/** @lang GraphQL */ '
                mutation DownloadTrackedUsersExcel($talentRequestId: UUID!) {
                    downloadTrackedUsersExcel(talentRequestId: $talentRequestId)
                }
            ', ['talentRequestId' => $request->id])
            ->assertGraphQLErrorMessage('This action is unauthorized.');

        Queue::assertNotPushed(GenerateUserFile::class);
    }

    public function testUpdateTrackedUsersReferredBulkIdsMutation(): void
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
            ->graphQL($this->bulkUpdateReferredMutation, [
                'ids' => [$toUpdateA->id, $toUpdateB->id],
            ])
            ->assertGraphQLErrorFree()
            ->assertJsonCount(2, 'data.updateTrackedUsersReferred')
            ->assertJsonFragment([
                'id' => $toUpdateA->id,
                'referralDecision' => ['value' => TalentRequestTrackedUserReferralDecision::REFERRED->name],
                'notReferredReason' => null,
                'selectionDecision' => null,
                'notSelectedReason' => null,
            ])
            ->assertJsonFragment([
                'id' => $toUpdateB->id,
                'referralDecision' => ['value' => TalentRequestTrackedUserReferralDecision::REFERRED->name],
                'notReferredReason' => null,
                'selectionDecision' => null,
                'notSelectedReason' => null,
            ]);

        $this->assertDatabaseHas('talent_request_tracked_users', [
            'id' => $toUpdateA->id,
            'referral_decision' => TalentRequestTrackedUserReferralDecision::REFERRED->name,
            'not_referred_reason' => null,
            'selection_decision' => null,
            'not_selected_reason' => null,
        ]);
        $this->assertDatabaseHas('talent_request_tracked_users', [
            'id' => $toUpdateB->id,
            'referral_decision' => TalentRequestTrackedUserReferralDecision::REFERRED->name,
            'not_referred_reason' => null,
            'selection_decision' => null,
            'not_selected_reason' => null,
        ]);
        $this->assertDatabaseHas('talent_request_tracked_users', [
            'id' => $untouched->id,
            'selection_decision' => TalentRequestTrackedUserSelectionDecision::NOT_SELECTED->name,
            'not_selected_reason' => TalentRequestTrackedUserNotSelectedReason::OTHER->name,
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

        $existing = TalentRequestTrackedUser::factory()->selected()->create([
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
            'selection_decision' => null,
            'not_selected_reason' => null,
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

    public function testFilterByStatusNotReferredDoesNotIncludeRowsWithSelectionDecision(): void
    {
        $request = $this->createRequest();
        $inconsistent = User::factory()->create();

        // Intentionally inconsistent row to verify filter follows status accessor precedence.
        TalentRequestTrackedUser::factory()->create([
            'talent_request_id' => $request->id,
            'user_id' => $inconsistent->id,
            'referral_decision' => TalentRequestTrackedUserReferralDecision::NOT_REFERRED->name,
            'selection_decision' => TalentRequestTrackedUserSelectionDecision::SELECTED->name,
        ]);

        $this->actingAs($this->admin, 'api')
            ->graphQL($this->filterQuery, [
                'id' => $request->id,
                'where' => ['statuses' => [TalentRequestTrackedUserStatus::NOT_REFERRED->name]],
            ])
            ->assertJsonCount(0, 'data.talentRequest.trackedUsers')
            ->assertJsonMissing(['user' => ['id' => $inconsistent->id]]);
    }

    public function testSourcesQualifiedInPoolWhenUserHasMatchingCandidacy(): void
    {
        $classification = Classification::factory()->create();
        $filter = ApplicantFilter::factory()->create(['community_id' => $this->community->id]);
        $filter->qualifiedInClassifications()->sync([$classification->id]);

        $request = TalentRequest::factory()->create([
            'community_id' => $this->community->id,
            'applicant_filter_id' => $filter->id,
        ]);

        $pool = Pool::factory()->candidatesAvailableInSearch()->create([
            'community_id' => $this->community->id,
            'classification_id' => $classification->id,
        ]);

        $user = User::factory()->create();
        PoolCandidate::factory()->availableInSearch()->create([
            'user_id' => $user->id,
            'pool_id' => $pool->id,
        ]);

        TalentRequestTrackedUser::factory()->create([
            'talent_request_id' => $request->id,
            'user_id' => $user->id,
        ]);

        $this->actingAs($this->admin, 'api')
            ->graphQL($this->sourcesQuery, ['talentRequestId' => $request->id])
            ->assertJsonPath('data.talentRequestTrackedUsers.data.0.sources', [TalentRequestSource::QUALIFIED_IN_POOL->name])
            ->assertJsonCount(1, 'data.talentRequestTrackedUsers.data.0.matchingQualifiedInPoolSources');
    }

    public function testSourcesEmptyWhenUserHasNoMatchingCandidacy(): void
    {
        $request = $this->createRequest();
        $user = User::factory()->create();

        TalentRequestTrackedUser::factory()->create([
            'talent_request_id' => $request->id,
            'user_id' => $user->id,
        ]);

        $this->actingAs($this->admin, 'api')
            ->graphQL($this->sourcesQuery, ['talentRequestId' => $request->id])
            ->assertJsonPath('data.talentRequestTrackedUsers.data.0.sources', [])
            ->assertJsonCount(0, 'data.talentRequestTrackedUsers.data.0.matchingQualifiedInPoolSources');
    }

    public function testMatchingQualifiedInPoolSourcesOnlyIncludesFilterMatchingPools(): void
    {
        $matchingClass = Classification::factory()->create();
        $otherClass = Classification::factory()->create();

        $filter = ApplicantFilter::factory()->create(['community_id' => $this->community->id]);
        $filter->qualifiedInClassifications()->sync([$matchingClass->id]);

        $request = TalentRequest::factory()->create([
            'community_id' => $this->community->id,
            'applicant_filter_id' => $filter->id,
        ]);

        $matchingPool = Pool::factory()->candidatesAvailableInSearch()->create([
            'community_id' => $this->community->id,
            'classification_id' => $matchingClass->id,
        ]);
        $otherPool = Pool::factory()->candidatesAvailableInSearch()->create([
            'community_id' => $this->community->id,
            'classification_id' => $otherClass->id,
        ]);

        $user = User::factory()->create();
        PoolCandidate::factory()->availableInSearch()->create([
            'user_id' => $user->id,
            'pool_id' => $matchingPool->id,
        ]);
        PoolCandidate::factory()->availableInSearch()->create([
            'user_id' => $user->id,
            'pool_id' => $otherPool->id,
        ]);

        TalentRequestTrackedUser::factory()->create([
            'talent_request_id' => $request->id,
            'user_id' => $user->id,
        ]);

        $this->actingAs($this->admin, 'api')
            ->graphQL($this->sourcesQuery, ['talentRequestId' => $request->id])
            ->assertJsonPath('data.talentRequestTrackedUsers.data.0.sources', [TalentRequestSource::QUALIFIED_IN_POOL->name])
            ->assertJsonCount(1, 'data.talentRequestTrackedUsers.data.0.matchingQualifiedInPoolSources')
            ->assertJsonPath('data.talentRequestTrackedUsers.data.0.matchingQualifiedInPoolSources.0.pool.id', $matchingPool->id);
    }

    public function testUserQualifiedInTwoMatchingPoolsGetsBothInMatchingQualifiedInPoolSources(): void
    {
        $request = $this->createRequest();

        $poolA = Pool::factory()->candidatesAvailableInSearch()->create([
            'community_id' => $this->community->id,
        ]);
        $poolB = Pool::factory()->candidatesAvailableInSearch()->create([
            'community_id' => $this->community->id,
        ]);

        $user = User::factory()->create();
        PoolCandidate::factory()->availableInSearch()->create([
            'user_id' => $user->id,
            'pool_id' => $poolA->id,
        ]);
        PoolCandidate::factory()->availableInSearch()->create([
            'user_id' => $user->id,
            'pool_id' => $poolB->id,
        ]);

        TalentRequestTrackedUser::factory()->create([
            'talent_request_id' => $request->id,
            'user_id' => $user->id,
        ]);

        $response = $this->actingAs($this->admin, 'api')
            ->graphQL($this->sourcesQuery, ['talentRequestId' => $request->id])
            ->assertJsonCount(2, 'data.talentRequestTrackedUsers.data.0.matchingQualifiedInPoolSources');

        $poolIds = collect($response->json('data.talentRequestTrackedUsers.data.0.matchingQualifiedInPoolSources'))
            ->pluck('pool.id')
            ->all();

        $this->assertEqualsCanonicalizing([$poolA->id, $poolB->id], $poolIds);
    }

    public function testSourcesCorrectOnNestedPathWithoutPaginatedScope(): void
    {
        $classification = Classification::factory()->create();
        $filter = ApplicantFilter::factory()->create(['community_id' => $this->community->id]);
        $filter->qualifiedInClassifications()->sync([$classification->id]);

        $request = TalentRequest::factory()->create([
            'community_id' => $this->community->id,
            'applicant_filter_id' => $filter->id,
        ]);

        $pool = Pool::factory()->candidatesAvailableInSearch()->create([
            'community_id' => $this->community->id,
            'classification_id' => $classification->id,
        ]);

        $withCandidacy = User::factory()->create();
        PoolCandidate::factory()->availableInSearch()->create([
            'user_id' => $withCandidacy->id,
            'pool_id' => $pool->id,
        ]);

        $withoutCandidacy = User::factory()->create();

        foreach ([$withCandidacy, $withoutCandidacy] as $user) {
            TalentRequestTrackedUser::factory()->create([
                'talent_request_id' => $request->id,
                'user_id' => $user->id,
            ]);
        }

        $response = $this->actingAs($this->admin, 'api')
            ->graphQL(/** @lang GraphQL */ '
                query NestedSources($id: UUID!) {
                    talentRequest(id: $id) {
                        trackedUsers {
                            user { id }
                            sources
                        }
                    }
                }
            ', ['id' => $request->id]);

        $byUser = collect($response->json('data.talentRequest.trackedUsers'))
            ->keyBy(fn ($row) => $row['user']['id']);

        $this->assertEquals([TalentRequestSource::QUALIFIED_IN_POOL->name], $byUser[$withCandidacy->id]['sources']);
        $this->assertEquals([], $byUser[$withoutCandidacy->id]['sources']);
    }
}
