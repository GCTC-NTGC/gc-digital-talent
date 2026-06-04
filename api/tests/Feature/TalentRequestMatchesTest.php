<?php

namespace Tests\Feature;

use App\Enums\FlexibleWorkLocation;
use App\Enums\LanguageAbility;
use App\Enums\PublishingGroup;
use App\Facades\Notify;
use App\Models\Classification;
use App\Models\Community;
use App\Models\Pool;
use App\Models\PoolCandidate;
use App\Models\Skill;
use App\Models\User;
use App\Models\UserSkill;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
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
                    sources
                    matchingPreQualifiedSources { pool { id } }
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
    private function matchingUser(Pool $pool, array $userAttributes = []): User
    {
        $user = User::factory()->create($userAttributes);
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
            ->assertJson([
                'data' => [
                    'talentRequestMatches' => [
                        'data' => [
                            [
                                'user' => ['id' => $match->id],
                                'sources' => ['PREQUALIFIED'],
                                'matchingPreQualifiedSources' => [['pool' => ['id' => $pool->id]]],
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
            'publishing_group' => PublishingGroup::EXECUTIVE_JOBS->name,
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

    public function testMatchingPreQualifiedSourcesOnlyIncludesPoolsMatchingTheFilter(): void
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
                                'matchingPreQualifiedSources' => [['pool' => ['id' => $matchingPool->id]]],
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

        $this->runMatches()
            ->assertJsonPath('data.talentRequestMatches.paginatorInfo.total', 1)
            ->assertJsonPath('data.talentRequestMatches.data.0.user.id', $user->id)
            ->assertJsonCount(2, 'data.talentRequestMatches.data.0.matchingPreQualifiedSources')
            ->assertJsonFragment(['id' => $poolA->id])
            ->assertJsonFragment(['id' => $poolB->id]);
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

    public function testExcludeTrackedByRequestIdIsAcceptedButDoesNotAffectResults(): void
    {
        $pool = Pool::factory()->candidatesAvailableInSearch()->create();
        $match = $this->matchingUser($pool);

        $this->runMatches([
            'excludeTrackedByRequestId' => Str::uuid()->toString(),
            'applicantFilter' => [],
        ])
            ->assertJsonPath('data.talentRequestMatches.paginatorInfo.total', 1)
            ->assertJsonPath('data.talentRequestMatches.data.0.user.id', $match->id);
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
        $this->graphQL(
            'query ($where: ApplicantFilterInput) { countTalentRequestMatches(where: $where) }',
            ['where' => []]
        )->assertJson(['data' => ['countTalentRequestMatches' => 2]]);
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

        $this->graphQL(
            'query ($where: ApplicantFilterInput) {
                countTalentRequestMatchesByPool(where: $where) { pool { id } count }
            }',
            ['where' => ['qualifiedInClassifications' => [['group' => $matchingClass->group, 'level' => $matchingClass->level]]]]
        )->assertExactJson([
            'data' => [
                'countTalentRequestMatchesByPool' => [
                    ['pool' => ['id' => $matchingPool->id], 'count' => 2],
                ],
            ],
        ]);
    }

    public function testCountAgreesWithTheListTotal(): void
    {
        $pool = Pool::factory()->candidatesAvailableInSearch()->create();
        $this->matchingUser($pool);
        $this->matchingUser($pool);
        $this->matchingUser($pool);

        $listTotal = $this->runMatches()
            ->json('data.talentRequestMatches.paginatorInfo.total');

        $this->graphQL(
            'query ($where: ApplicantFilterInput) { countTalentRequestMatches(where: $where) }',
            ['where' => []]
        )->assertJson(['data' => ['countTalentRequestMatches' => $listTotal]]);
    }
}
