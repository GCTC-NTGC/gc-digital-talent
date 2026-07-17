<?php

namespace Tests\Feature;

use App\Enums\ArmedForcesStatus;
use App\Enums\CitizenshipStatus;
use App\Enums\EmployeeVerification;
use App\Enums\EmploymentCategory;
use App\Enums\FlexibleWorkLocation;
use App\Enums\GovEmployeeType;
use App\Enums\GovPositionType;
use App\Enums\LanguageAbility;
use App\Enums\PriorityWeight;
use App\Enums\PublishingGroup;
use App\Enums\TalentRequestSource;
use App\Facades\Notify;
use App\Models\Classification;
use App\Models\Community;
use App\Models\CommunityInterest;
use App\Models\Department;
use App\Models\Pool;
use App\Models\PoolCandidate;
use App\Models\Skill;
use App\Models\TalentRequest;
use App\Models\TalentRequestTrackedUser;
use App\Models\User;
use App\Models\UserSkill;
use App\Models\WorkExperience;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Testing\TestResponse;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Tests\TestCase;
use Tests\UsesProtectedGraphqlEndpoint;

class TalentRequestMatchesTest extends TestCase
{
    use MakesGraphQLRequests;
    use RefreshDatabase;
    use RefreshesSchemaCache;
    use UsesProtectedGraphqlEndpoint;

    protected User $admin;

    protected string $query = <<<'GRAPHQL'
        query TalentRequestMatches($where: TalentRequestMatchFilterInput) {
            talentRequestMatches(where: $where) {
                data {
                    user { id }
                    sources { value }
                    matchingQualifiedInPoolSources { pool { id } }
                    skillCount
                }
                paginatorInfo { total }
            }
        }
        GRAPHQL;

    protected function setUp(): void
    {
        parent::setUp();
        Notify::spy();

        $this->seed(RolePermissionSeeder::class);

        $this->admin = User::factory()->asAdmin()->create();
    }

    // A user with an available, talent-searchable qualified candidacy in $pool.
    private function matchingUser(Pool $pool, ?array $userAttributes = [], ?bool $isGovEmployee = false): User
    {
        $state = $isGovEmployee ? 'withGovEmployeeProfile' : 'withNonGovProfile';
        $user = User::factory()->$state()->create($userAttributes);
        PoolCandidate::factory()->availableInSearch()->create([
            'user_id' => $user->id,
            'pool_id' => $pool->id,
        ]);

        return $user;
    }

    private function runMatches(array $where = [], ?User $actingAs = null): TestResponse
    {
        return $this->actingAs($actingAs ?? $this->admin, 'api')
            ->graphQL($this->query, ['where' => $where]);
    }

    private function runMatchesOrdered(array $where, string $direction): TestResponse
    {
        $query = <<<'GRAPHQL'
            query ($where: TalentRequestMatchFilterInput, $orderBy: [AdvancedOrderByInput!]) {
                talentRequestMatches(where: $where, orderBy: $orderBy) {
                    data { user { id } skillCount }
                }
            }
            GRAPHQL;

        return $this->actingAs($this->admin, 'api')->graphQL($query, [
            'where' => $where,
            'orderBy' => [['scope' => 'orderBySkillCount', 'direction' => $direction]],
        ]);
    }

    private function runCountMatches(array $where = []): TestResponse
    {
        return $this->graphQL(
            'query ($where: TalentRequestMatchFilterInput) { countTalentRequestMatches(where: $where) }',
            ['where' => $where]
        );
    }

    private function runCountByPool(array $where = []): TestResponse
    {
        return $this->graphQL(
            'query ($where: TalentRequestMatchFilterInput) {
                countTalentRequestMatchesByPool(where: $where) { pool { id } count }
            }',
            ['where' => $where]
        );
    }

    private function runCountByCommunity(array $where = []): TestResponse
    {
        return $this->graphQL(
            'query ($where: TalentRequestMatchFilterInput) {
                countTalentRequestMatchesByCommunity(where: $where) {
                    community { id }
                    qualifiedInPoolCount
                    atLevelCount
                    count
                }
            }',
            ['where' => $where]
        );
    }

    // A user with a current substantive classification (for AT_LEVEL matching), no pool candidacy.
    private function atLevelUser(Classification $classification, Community $community): User
    {
        $user = User::factory()->create();
        WorkExperience::factory()->for($user)->create([
            'employment_category' => EmploymentCategory::GOVERNMENT_OF_CANADA->name,
            'gov_employment_type' => GovEmployeeType::INDETERMINATE->name,
            'gov_position_type' => GovPositionType::SUBSTANTIVE->name,
            'classification_id' => $classification->id,
            'end_date' => null,
        ]);
        CommunityInterest::factory()->consented()->create([
            'user_id' => $user->id,
            'community_id' => $community->id,
        ]);

        return $user;
    }

    public function testReturnsOnlyUsersWithAMatchingCandidacy(): void
    {
        $pool = Pool::factory()->candidatesAvailableInSearch()->create();

        $match = $this->matchingUser($pool);

        // unavailable candidacy (referrals paused) — should not match
        $unavailable = User::factory()->create();
        PoolCandidate::factory()->availableInSearch()->referring(false)->create([
            'user_id' => $unavailable->id,
            'pool_id' => $pool->id,
        ]);

        // no candidacy at all — should not match
        User::factory()->create();

        $this->runMatches()
            ->assertExactJson([
                'data' => [
                    'talentRequestMatches' => [
                        'data' => [
                            [
                                'user' => ['id' => $match->id],
                                'sources' => [['value' => TalentRequestSource::QUALIFIED_IN_POOL->name]],
                                'matchingQualifiedInPoolSources' => [['pool' => ['id' => $pool->id]]],
                                'skillCount' => null,
                            ],
                        ],
                        'paginatorInfo' => ['total' => 1],
                    ],
                ],
            ]);
    }

    public function testExcludesCandidacyInANonTalentSearchablePool(): void
    {
        $searchablePool = Pool::factory()->candidatesAvailableInSearch()->create();
        $nonSearchablePool = Pool::factory()->published()->create([
            'publishing_group' => PublishingGroup::IAP->name,
        ]);

        $included = $this->matchingUser($searchablePool);

        $excluded = User::factory()->create();
        PoolCandidate::factory()->availableInSearch()->create([
            'user_id' => $excluded->id,
            'pool_id' => $nonSearchablePool->id,
        ]);

        $this->runMatches()
            ->assertJsonPath('data.talentRequestMatches.paginatorInfo.total', 1)
            ->assertJsonPath('data.talentRequestMatches.data.0.user.id', $included->id);
    }

    // The attribute filters narrow results, AND attributes alone don't match without a candidacy.
    public function testAttributeFilterNarrowsAndStillRequiresACandidacy(): void
    {
        $pool = Pool::factory()->candidatesAvailableInSearch()->create();

        $englishMatch = $this->matchingUser($pool, [
            'looking_for_english' => true,
            'looking_for_french' => false,
            'looking_for_bilingual' => false,
        ]);

        // right candidacy, wrong language — filtered out by the attribute filter
        $this->matchingUser($pool, [
            'looking_for_english' => false,
            'looking_for_french' => true,
            'looking_for_bilingual' => false,
        ]);

        // right language but no candidacy — excluded by the source-membership requirement
        User::factory()->create(['looking_for_english' => true]);

        $this->runMatches(['applicantFilter' => ['languageAbility' => LanguageAbility::ENGLISH->name]])
            ->assertJsonPath('data.talentRequestMatches.paginatorInfo.total', 1)
            ->assertJsonPath('data.talentRequestMatches.data.0.user.id', $englishMatch->id);
    }

    public function testFiltersOnFlexibleWorkLocation(): void
    {
        $pool = Pool::factory()->candidatesAvailableInSearch()->create();

        $remote = $this->matchingUser($pool, [
            'flexible_work_locations' => [FlexibleWorkLocation::REMOTE->name],
        ]);
        $this->matchingUser($pool, [
            'flexible_work_locations' => [FlexibleWorkLocation::ONSITE->name],
        ]);

        $this->runMatches([
            'applicantFilter' => ['flexibleWorkLocations' => [FlexibleWorkLocation::REMOTE->name]],
        ])
            ->assertJsonPath('data.talentRequestMatches.paginatorInfo.total', 1)
            ->assertJsonPath('data.talentRequestMatches.data.0.user.id', $remote->id);
    }

    public function testMatchingQualifiedInPoolsOnlyIncludesPoolsMatchingTheFilter(): void
    {
        $matchingClass = Classification::factory()->create();
        $otherClass = Classification::factory()->create();

        $matchingPool = Pool::factory()->candidatesAvailableInSearch()->create([
            'classification_id' => $matchingClass->id,
        ]);
        $otherPool = Pool::factory()->candidatesAvailableInSearch()->create([
            'classification_id' => $otherClass->id,
        ]);

        // one user qualified in both a matching and a non-matching pool
        $user = User::factory()->create();
        PoolCandidate::factory()->availableInSearch()->create([
            'user_id' => $user->id,
            'pool_id' => $matchingPool->id,
        ]);
        PoolCandidate::factory()->availableInSearch()->create([
            'user_id' => $user->id,
            'pool_id' => $otherPool->id,
        ]);

        $this->runMatches([
            'applicantFilter' => [
                'qualifiedInClassifications' => [
                    ['group' => $matchingClass->group, 'level' => $matchingClass->level],
                ],
            ],
        ])
            ->assertJson([
                'data' => [
                    'talentRequestMatches' => [
                        'data' => [
                            [
                                'user' => ['id' => $user->id],
                                'matchingQualifiedInPoolSources' => [['pool' => ['id' => $matchingPool->id]]],
                            ],
                        ],
                        'paginatorInfo' => ['total' => 1],
                    ],
                ],
            ]);
    }

    public function testUserQualifiedInTwoMatchingPoolsIsOneRowWithBothSources(): void
    {
        $poolA = Pool::factory()->candidatesAvailableInSearch()->create();
        $poolB = Pool::factory()->candidatesAvailableInSearch()->create();

        $user = User::factory()->create();
        PoolCandidate::factory()->availableInSearch()->create([
            'user_id' => $user->id,
            'pool_id' => $poolA->id,
        ]);
        PoolCandidate::factory()->availableInSearch()->create([
            'user_id' => $user->id,
            'pool_id' => $poolB->id,
        ]);

        $response = $this->runMatches()
            ->assertJsonPath('data.talentRequestMatches.paginatorInfo.total', 1)
            ->assertJsonPath('data.talentRequestMatches.data.0.user.id', $user->id)
            ->assertJsonCount(2, 'data.talentRequestMatches.data.0.matchingQualifiedInPoolSources');

        $poolIds = collect($response->json('data.talentRequestMatches.data.0.matchingQualifiedInPoolSources'))
            ->pluck('pool.id')
            ->all();

        $this->assertEqualsCanonicalizing([$poolA->id, $poolB->id], $poolIds);
    }

    public function testSkillCountCountsTheUsersMatchingSkills(): void
    {
        $pool = Pool::factory()->candidatesAvailableInSearch()->create();
        $user = $this->matchingUser($pool);

        $matchingSkill = Skill::factory()->create();
        $otherSkill = Skill::factory()->create();
        UserSkill::factory()->for($user)->create(['skill_id' => $matchingSkill->id]);
        UserSkill::factory()->for($user)->create(['skill_id' => $otherSkill->id]);

        // with a skills filter, skillCount is how many of the user's skills match it
        $this->runMatches(['applicantFilter' => ['skills' => [['id' => $matchingSkill->id]]]])
            ->assertJsonPath('data.talentRequestMatches.data.0.skillCount', 1);

        // with no skills filter, skillCount is null
        $this->runMatches()
            ->assertJsonPath('data.talentRequestMatches.data.0.skillCount', null);
    }

    public function testExcludeTrackedByRequestIdFiltersOutUsersTrackedByThatRequest(): void
    {
        $pool = Pool::factory()->candidatesAvailableInSearch()->create();
        $included = $this->matchingUser($pool);
        $tracked = $this->matchingUser($pool);

        $talentRequest = TalentRequest::factory()->create();
        TalentRequestTrackedUser::factory()->create([
            'talent_request_id' => $talentRequest->id,
            'user_id' => $tracked->id,
        ]);

        $this->runMatches([
            'excludeTrackedByRequestId' => $talentRequest->id,
            'applicantFilter' => [],
        ])
            ->assertJsonPath('data.talentRequestMatches.paginatorInfo.total', 1)
            ->assertJsonPath('data.talentRequestMatches.data.0.user.id', $included->id)
            ->assertJsonMissing([
                'user' => ['id' => $tracked->id],
            ]);
    }

    public function testFiltersByDepartments(): void
    {
        $department = Department::factory()->create();
        $pool = Pool::factory()->candidatesAvailableInSearch()->create();
        $inDepartment = $this->matchingUser($pool, [], true);
        $this->matchingUser($pool, [], false);

        $this->runMatches(['departments' => [$department->id]])
            ->assertJsonPath('data.talentRequestMatches.paginatorInfo.total', 1)
            ->assertJsonPath('data.talentRequestMatches.data.0.user.id', $inDepartment->id);
    }

    public function testFiltersByEmployeeVerification(): void
    {
        $pool = Pool::factory()->candidatesAvailableInSearch()->create();

        // withGovEmployeeProfile creates a user with a verified work email
        $govEmployee = $this->matchingUser($pool, [], true);
        $this->matchingUser($pool, [], false);

        $this->runMatches(['employeeVerification' => [EmployeeVerification::VERIFIED->name]])
            ->assertJsonPath('data.talentRequestMatches.paginatorInfo.total', 1)
            ->assertJsonPath('data.talentRequestMatches.data.0.user.id', $govEmployee->id);
    }

    public function testFiltersByPriorityWeight(): void
    {
        $pool = Pool::factory()->candidatesAvailableInSearch()->create();

        // priority_weight is generated on users: VETERAN armed forces → weight 20
        $veteran = $this->matchingUser($pool, [
            'armed_forces_status' => ArmedForcesStatus::VETERAN->name,
            'has_priority_entitlement' => false,
            'citizenship' => CitizenshipStatus::OTHER->name,
        ]);
        // not a veteran → weight 40 (OTHER)
        $this->matchingUser($pool, [
            'armed_forces_status' => ArmedForcesStatus::NON_CAF->name,
            'has_priority_entitlement' => false,
            'citizenship' => CitizenshipStatus::OTHER->name,
        ]);

        $this->runMatches(['priorityWeight' => [PriorityWeight::VETERAN->name]])
            ->assertJsonPath('data.talentRequestMatches.paginatorInfo.total', 1)
            ->assertJsonPath('data.talentRequestMatches.data.0.user.id', $veteran->id);
    }

    public function testFiltersByGeneralSearch(): void
    {
        $pool = Pool::factory()->candidatesAvailableInSearch()->create();

        $jane = $this->matchingUser($pool, [
            'first_name' => 'Jane',
            'last_name' => 'Doe',
            'email' => 'jane.doe@example.com',
        ]);
        $this->matchingUser($pool, [
            'first_name' => 'Bob',
            'last_name' => 'Smith',
            'email' => 'bob.smith@example.com',
        ]);

        $this->runMatches(['generalSearch' => 'Jane'])
            ->assertJsonPath('data.talentRequestMatches.paginatorInfo.total', 1)
            ->assertJsonPath('data.talentRequestMatches.data.0.user.id', $jane->id);
    }

    public function testFiltersByName(): void
    {
        $pool = Pool::factory()->candidatesAvailableInSearch()->create();

        $jane = $this->matchingUser($pool, ['first_name' => 'Jane', 'last_name' => 'Doe']);
        $this->matchingUser($pool, ['first_name' => 'Bob', 'last_name' => 'Smith']);

        $this->runMatches(['name' => 'Doe'])
            ->assertJsonPath('data.talentRequestMatches.paginatorInfo.total', 1)
            ->assertJsonPath('data.talentRequestMatches.data.0.user.id', $jane->id);
    }

    public function testFiltersByEmail(): void
    {
        $pool = Pool::factory()->candidatesAvailableInSearch()->create();

        $jane = $this->matchingUser($pool, ['email' => 'jane.doe@example.com']);
        $this->matchingUser($pool, ['email' => 'bob.smith@example.com']);

        $this->runMatches(['email' => 'jane.doe@example.com'])
            ->assertJsonPath('data.talentRequestMatches.paginatorInfo.total', 1)
            ->assertJsonPath('data.talentRequestMatches.data.0.user.id', $jane->id);
    }

    public function testOrdersBySkillCount(): void
    {
        $pool = Pool::factory()->candidatesAvailableInSearch()->create();

        $oneSkill = $this->matchingUser($pool);
        $twoSkills = $this->matchingUser($pool);

        $skillA = Skill::factory()->create();
        $skillB = Skill::factory()->create();

        UserSkill::factory()->for($oneSkill)->create(['skill_id' => $skillA->id]);

        UserSkill::factory()->for($twoSkills)->create(['skill_id' => $skillA->id]);
        UserSkill::factory()->for($twoSkills)->create(['skill_id' => $skillB->id]);

        $where = ['applicantFilter' => ['skills' => [['id' => $skillA->id], ['id' => $skillB->id]]]];

        $this->runMatchesOrdered($where, 'DESC')
            ->assertJsonPath('data.talentRequestMatches.data.0.user.id', $twoSkills->id)
            ->assertJsonPath('data.talentRequestMatches.data.1.user.id', $oneSkill->id);

        $this->runMatchesOrdered($where, 'ASC')
            ->assertJsonPath('data.talentRequestMatches.data.0.user.id', $oneSkill->id)
            ->assertJsonPath('data.talentRequestMatches.data.1.user.id', $twoSkills->id);
    }

    public function testOrdersByDepartmentName(): void
    {
        $pool = Pool::factory()->candidatesAvailableInSearch()->create();

        $depA = Department::factory()->create(['name' => ['en' => 'Apricot Agency', 'fr' => 'Agence abricot']]);
        $depB = Department::factory()->create(['name' => ['en' => 'Banana Bureau', 'fr' => 'Bureau banane']]);

        $userA = $this->matchingUser($pool, [], true);
        $expA = $userA->latest_current_government_work_experience;
        $expA->department_id = $depA->id;
        $expA->save();

        $userB = $this->matchingUser($pool, [], true);
        $expB = $userB->latest_current_government_work_experience;
        $expB->department_id = $depB->id;
        $expB->save();

        $query = <<<'GRAPHQL'
            query ($where: TalentRequestMatchFilterInput, $orderBy: [AdvancedOrderByInput!]) {
                talentRequestMatches(where: $where, orderBy: $orderBy) {
                    data { user { id } }
                }
            }
            GRAPHQL;

        $this->actingAs($this->admin, 'api')->graphQL($query, [
            'where' => [],
            'orderBy' => [['relation' => ['name' => 'department', 'column' => 'name->en'], 'direction' => 'ASC']],
        ])
            ->assertJsonPath('data.talentRequestMatches.data.0.user.id', $userA->id)
            ->assertJsonPath('data.talentRequestMatches.data.1.user.id', $userB->id);

        $this->actingAs($this->admin, 'api')->graphQL($query, [
            'where' => [],
            'orderBy' => [['relation' => ['name' => 'department', 'column' => 'name->en'], 'direction' => 'DESC']],
        ])
            ->assertJsonPath('data.talentRequestMatches.data.0.user.id', $userB->id)
            ->assertJsonPath('data.talentRequestMatches.data.1.user.id', $userA->id);
    }

    public function testMatchesAreFilteredByViewAuthorization(): void
    {
        $pool = Pool::factory()->candidatesAvailableInSearch()->create();
        $this->matchingUser($pool);

        // a viewer with no permission to see other users gets no error, but the
        // whereAuthorizedToView scope filters the results down to what their role allows
        $this->runMatches([], User::factory()->create())
            ->assertJsonPath('data.talentRequestMatches.paginatorInfo.total', 0);
    }

    // The full per-role matrix of whereAuthorizedToView lives in UserAuthorizationScopeTest;
    // this confirms the scope is wired into talentRequestMatches and still filters per team —
    // a community recruiter sees a match in their community but not an equally-valid match elsewhere.
    public function testTeamScopedRecruiterSeesOnlyMatchesInTheirCommunity(): void
    {
        $community = Community::factory()->create();
        $pool = Pool::factory()->candidatesAvailableInSearch()->create([
            'community_id' => $community->id,
        ]);
        $visible = $this->matchingUser($pool);

        // an equally-valid match in another community the recruiter has no access to
        // (explicit community: PoolFactory firstOrCreates one, so it would otherwise reuse $community)
        $otherPool = Pool::factory()->candidatesAvailableInSearch()->create([
            'community_id' => Community::factory()->create()->id,
        ]);
        $this->matchingUser($otherPool);

        $recruiter = User::factory()->asCommunityRecruiter($community->id)->create();

        $this->runMatches([], $recruiter)
            ->assertJsonPath('data.talentRequestMatches.paginatorInfo.total', 1)
            ->assertJsonPath('data.talentRequestMatches.data.0.user.id', $visible->id);
    }

    public function testUnauthenticatedCannotQueryMatches(): void
    {
        $this->graphQL($this->query, ['where' => []])
            ->assertGraphQLErrorMessage('Unauthenticated.');
    }

    public function testCountTotalsMatchingUsersAndIsPublic(): void
    {
        $pool = Pool::factory()->candidatesAvailableInSearch()->create();
        $this->matchingUser($pool);
        $this->matchingUser($pool);

        // unavailable candidacy and a user with no candidacy — neither counts
        $unavailable = User::factory()->create();
        PoolCandidate::factory()->availableInSearch()->referring(false)->create([
            'user_id' => $unavailable->id,
            'pool_id' => $pool->id,
        ]);
        User::factory()->create();

        // no actingAs — the count is public, like the legacy search counts
        $this->runCountMatches()
            ->assertJson(['data' => ['countTalentRequestMatches' => 2]]);
    }

    public function testCountByPoolCountsDistinctUsersAndExcludesNonMatchingPools(): void
    {
        $matchingClass = Classification::factory()->create();
        $otherClass = Classification::factory()->create();

        $matchingPool = Pool::factory()->candidatesAvailableInSearch()->create([
            'classification_id' => $matchingClass->id,
        ]);
        $otherPool = Pool::factory()->candidatesAvailableInSearch()->create([
            'classification_id' => $otherClass->id,
        ]);

        // user qualified in both the matching and the non-matching pool
        $both = User::factory()->create();
        PoolCandidate::factory()->availableInSearch()->create(['user_id' => $both->id, 'pool_id' => $matchingPool->id]);
        PoolCandidate::factory()->availableInSearch()->create(['user_id' => $both->id, 'pool_id' => $otherPool->id]);

        // user qualified only in the matching pool
        $this->matchingUser($matchingPool);

        $this->runCountByPool(
            ['applicantFilter' => ['qualifiedInClassifications' => [['group' => $matchingClass->group, 'level' => $matchingClass->level]]]]
        )->assertExactJson([
            'data' => [
                'countTalentRequestMatchesByPool' => [
                    ['pool' => ['id' => $matchingPool->id], 'count' => 2],
                ],
            ],
        ]);
    }

    public function testCountByCommunityCountsBreakdownAndDedupesTotal(): void
    {
        $classification = Classification::factory()->create();
        $community = Community::factory()->create();

        $pool = Pool::factory()->candidatesAvailableInSearch()->create([
            'classification_id' => $classification->id,
            'community_id' => $community->id,
        ]);

        // pool-only user
        $this->matchingUser($pool);

        // at-level-only user: substantive classification + community interest, no pool candidacy
        $this->atLevelUser($classification, $community);

        // user matching both sources for this community — should count once in the total
        $bothUser = $this->matchingUser($pool);
        WorkExperience::factory()->for($bothUser)->create([
            'employment_category' => EmploymentCategory::GOVERNMENT_OF_CANADA->name,
            'gov_employment_type' => GovEmployeeType::INDETERMINATE->name,
            'gov_position_type' => GovPositionType::SUBSTANTIVE->name,
            'classification_id' => $classification->id,
            'end_date' => null,
        ]);
        CommunityInterest::factory()->consented()->create([
            'user_id' => $bothUser->id,
            'community_id' => $community->id,
        ]);

        $this->runCountByCommunity([
            'applicantFilter' => [
                'qualifiedInClassifications' => [['group' => $classification->group, 'level' => $classification->level]],
                'talentSources' => [
                    TalentRequestSource::QUALIFIED_IN_POOL->name,
                    TalentRequestSource::AT_LEVEL->name,
                ],
            ],
        ])
            ->assertJsonPath('data.countTalentRequestMatchesByCommunity.0.community.id', $community->id)
            ->assertJsonPath('data.countTalentRequestMatchesByCommunity.0.qualifiedInPoolCount', 2)
            ->assertJsonPath('data.countTalentRequestMatchesByCommunity.0.atLevelCount', 2)
            ->assertJsonPath('data.countTalentRequestMatchesByCommunity.0.count', 3);
    }

    public function testCountByCommunityDefaultsToAllSourcesWhenTalentSourcesOmitted(): void
    {
        $classification = Classification::factory()->create();
        $poolCommunity = Community::factory()->create();
        $atLevelCommunity = Community::factory()->create();

        $pool = Pool::factory()->candidatesAvailableInSearch()->create([
            'classification_id' => $classification->id,
            'community_id' => $poolCommunity->id,
        ]);
        $this->matchingUser($pool);

        // at-level-only match in a different community — no pool candidacy at all
        $this->atLevelUser($classification, $atLevelCommunity);

        // NOTE: no `talentSources` key at all — TalentRequestSource::selected(null)
        // treats an omitted/empty selection as "all implemented sources".
        $response = $this->runCountByCommunity([
            'applicantFilter' => [
                'qualifiedInClassifications' => [['group' => $classification->group, 'level' => $classification->level]],
            ],
        ]);

        $response
            ->assertJsonCount(2, 'data.countTalentRequestMatchesByCommunity')
            ->assertJsonFragment([
                'community' => ['id' => $poolCommunity->id],
                'qualifiedInPoolCount' => 1,
                'atLevelCount' => 0,
                'count' => 1,
            ])
            ->assertJsonFragment([
                'community' => ['id' => $atLevelCommunity->id],
                'qualifiedInPoolCount' => 0,
                'atLevelCount' => 1,
                'count' => 1,
            ]);
    }

    public function testCountByCommunityExcludesCommunitiesWithNoMatches(): void
    {
        $matchingClassification = Classification::factory()->create();
        $otherClassification = Classification::factory()->create();
        $matchingCommunity = Community::factory()->create();
        $otherCommunity = Community::factory()->create();

        $matchingPool = Pool::factory()->candidatesAvailableInSearch()->create([
            'classification_id' => $matchingClassification->id,
            'community_id' => $matchingCommunity->id,
        ]);
        $this->matchingUser($matchingPool);

        // otherCommunity has real matches, but not for the filtered classification
        $otherPool = Pool::factory()->candidatesAvailableInSearch()->create([
            'classification_id' => $otherClassification->id,
            'community_id' => $otherCommunity->id,
        ]);
        $this->matchingUser($otherPool);

        $this->runCountByCommunity([
            'applicantFilter' => [
                'qualifiedInClassifications' => [['group' => $matchingClassification->group, 'level' => $matchingClassification->level]],
            ],
        ])
            ->assertJsonCount(1, 'data.countTalentRequestMatchesByCommunity')
            ->assertJsonPath('data.countTalentRequestMatchesByCommunity.0.community.id', $matchingCommunity->id);
    }

    public function testCountAgreesWithTheListTotal(): void
    {
        $pool = Pool::factory()->candidatesAvailableInSearch()->create();
        $this->matchingUser($pool);
        $this->matchingUser($pool);
        $this->matchingUser($pool);

        $listTotal = $this->runMatches()
            ->json('data.talentRequestMatches.paginatorInfo.total');

        $this->runCountMatches()
            ->assertJson(['data' => ['countTalentRequestMatches' => $listTotal]]);
    }

    protected string $atLevelQuery = <<<'GRAPHQL'
        query TalentRequestMatches($where: TalentRequestMatchFilterInput) {
            talentRequestMatches(where: $where) {
                data {
                    user { id }
                    sources { value }
                    matchingAtLevelSources { id }
                }
                paginatorInfo { total }
            }
        }
        GRAPHQL;

    public function testAtLevelSourceMatchesUserWithCommunityInterest(): void
    {
        $community = Community::factory()->create();

        $user = User::factory()->create();
        $interest = CommunityInterest::factory()->consented()->create([
            'user_id' => $user->id,
            'community_id' => $community->id,
        ]);

        // no community interest — should not match
        User::factory()->create();

        $this->actingAs($this->admin, 'api')
            ->graphQL($this->atLevelQuery, ['where' => []])
            ->assertJsonPath('data.talentRequestMatches.paginatorInfo.total', 1)
            ->assertJsonPath('data.talentRequestMatches.data.0.user.id', $user->id)
            ->assertJsonPath('data.talentRequestMatches.data.0.matchingAtLevelSources.0.id', $interest->id);
    }

    public function testAtLevelExcludesUsersWhoHaveNotConsentedToShareProfile(): void
    {
        $community = Community::factory()->create();

        $consented = User::factory()->create();
        CommunityInterest::factory()->consented()->create([
            'user_id' => $consented->id,
            'community_id' => $community->id,
        ]);

        $notConsented = User::factory()->create();
        CommunityInterest::factory()->consented(false)->create([
            'user_id' => $notConsented->id,
            'community_id' => $community->id,
        ]);

        $this->actingAs($this->admin, 'api')
            ->graphQL($this->atLevelQuery, ['where' => []])
            ->assertJsonFragment(['user' => ['id' => $consented->id]])
            ->assertJsonMissing(['user' => ['id' => $notConsented->id]]);
    }

    public function testAtLevelCommunityFilterNarrowsResults(): void
    {
        $matching = Community::factory()->create();
        $other = Community::factory()->create();

        $included = User::factory()->create();
        CommunityInterest::factory()->consented()->create([
            'user_id' => $included->id,
            'community_id' => $matching->id,
        ]);

        $excluded = User::factory()->create();
        CommunityInterest::factory()->consented()->create([
            'user_id' => $excluded->id,
            'community_id' => $other->id,
        ]);

        $this->actingAs($this->admin, 'api')
            ->graphQL($this->atLevelQuery, [
                'where' => ['applicantFilter' => ['community' => ['id' => $matching->id]]],
            ])
            ->assertJsonPath('data.talentRequestMatches.paginatorInfo.total', 1)
            ->assertJsonPath('data.talentRequestMatches.data.0.user.id', $included->id);
    }

    public function testTalentSourcesQualifiedInPoolOnlyExcludesAtLevelUsers(): void
    {
        $pool = Pool::factory()->candidatesAvailableInSearch()->create();
        $community = Community::factory()->create();

        $poolUser = $this->matchingUser($pool);

        // AT_LEVEL only — no pool candidates
        $atLevelUser = User::factory()->create();
        CommunityInterest::factory()->consented()->create([
            'user_id' => $atLevelUser->id,
            'community_id' => $community->id,
        ]);

        $this->actingAs($this->admin, 'api')
            ->graphQL($this->atLevelQuery, [
                'where' => ['applicantFilter' => ['talentSources' => [TalentRequestSource::QUALIFIED_IN_POOL->name]]],
            ])
            ->assertJsonPath('data.talentRequestMatches.paginatorInfo.total', 1)
            ->assertJsonPath('data.talentRequestMatches.data.0.user.id', $poolUser->id);
    }

    public function testTalentSourcesAtLevelOnlyExcludesPoolOnlyUsers(): void
    {
        $pool = Pool::factory()->candidatesAvailableInSearch()->create();
        $community = Community::factory()->create();

        // QUALIFIED_IN_POOL only — no community interest
        $this->matchingUser($pool);

        $atLevelUser = User::factory()->create();
        $interest = CommunityInterest::factory()->consented()->create([
            'user_id' => $atLevelUser->id,
            'community_id' => $community->id,
        ]);

        $this->actingAs($this->admin, 'api')
            ->graphQL($this->atLevelQuery, [
                'where' => ['applicantFilter' => ['talentSources' => [TalentRequestSource::AT_LEVEL->name]]],
            ])
            ->assertJsonPath('data.talentRequestMatches.paginatorInfo.total', 1)
            ->assertJsonPath('data.talentRequestMatches.data.0.user.id', $atLevelUser->id)
            ->assertJsonPath('data.talentRequestMatches.data.0.matchingAtLevelSources.0.id', $interest->id);
    }

    public function testAtLevelWorkStreamFilterMatchesUserWithoutCandidacy(): void
    {
        $community = Community::factory()->withWorkStreams()->create();

        $user = User::factory()->create();
        $interest = CommunityInterest::factory()->consented()->withWorkStreams()->for($user)->for($community)->create();
        $workStreamId = $interest->workStreams()->first()->id;

        $this->actingAs($this->admin, 'api')
            ->graphQL($this->atLevelQuery, [
                'where' => [
                    'applicantFilter' => [
                        'talentSources' => [TalentRequestSource::AT_LEVEL->name],
                        'qualifiedInWorkStreams' => [['id' => $workStreamId]],
                    ],
                ],
            ])
            ->assertJsonFragment(['user' => ['id' => $user->id]]);
    }

    public function testAtLevelClassificationFilterMatchesUserWithoutCandidacy(): void
    {
        $classification = Classification::factory()->create();

        $user = User::factory()->create();
        WorkExperience::factory()->for($user)->create([
            'employment_category' => EmploymentCategory::GOVERNMENT_OF_CANADA->name,
            'gov_employment_type' => GovEmployeeType::INDETERMINATE->name,
            'gov_position_type' => GovPositionType::SUBSTANTIVE->name,
            'classification_id' => $classification->id,
            'end_date' => null,
        ]);
        CommunityInterest::factory()->consented()->for($user)->create();

        $this->actingAs($this->admin, 'api')
            ->graphQL($this->atLevelQuery, [
                'where' => [
                    'applicantFilter' => [
                        'talentSources' => [TalentRequestSource::AT_LEVEL->name],
                        'qualifiedInClassifications' => [['group' => $classification->group, 'level' => $classification->level]],
                    ],
                ],
            ])
            ->assertJsonFragment(['user' => ['id' => $user->id]]);
    }

    public function testTalentSourcesAllSourcesReturnsBothPoolAndAtLevelUsers(): void
    {
        $pool = Pool::factory()->candidatesAvailableInSearch()->create();
        $community = Community::factory()->create();

        $poolUser = $this->matchingUser($pool);

        $atLevelUser = User::factory()->create();
        CommunityInterest::factory()->consented()->create([
            'user_id' => $atLevelUser->id,
            'community_id' => $community->id,
        ]);

        $userIds = $this->actingAs($this->admin, 'api')
            ->graphQL($this->atLevelQuery, [
                'where' => ['applicantFilter' => ['talentSources' => [
                    TalentRequestSource::QUALIFIED_IN_POOL->name,
                    TalentRequestSource::AT_LEVEL->name,
                ]]],
            ])
            ->assertJsonPath('data.talentRequestMatches.paginatorInfo.total', 2)
            ->json('data.talentRequestMatches.data.*.user.id');

        $this->assertContains($poolUser->id, $userIds);
        $this->assertContains($atLevelUser->id, $userIds);
    }
}
