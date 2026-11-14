<?php

namespace Tests\Feature;

use App\Enums\LanguageAbility;
use App\Enums\PoolAreaOfSelection;
use App\Enums\PoolLanguage;
use App\Enums\PoolPublishedRange;
use App\Enums\PoolSkillType;
use App\Enums\PoolStatus;
use App\Enums\SalaryRange;
use App\Enums\SkillCategory;
use App\Models\Classification;
use App\Models\Department;
use App\Models\Pool;
use App\Models\Skill;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Tests\TestCase;
use Tests\UsesProtectedGraphqlEndpoint;

use function PHPUnit\Framework\assertEquals;
use function PHPUnit\Framework\assertEqualsCanonicalizing;

class PublishedPoolsSearchTest extends TestCase
{
    use MakesGraphQLRequests;
    use RefreshDatabase;
    use RefreshesSchemaCache;
    use UsesProtectedGraphqlEndpoint;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);
    }

    public function testQueryDoesNotReturnDraftsOrArchivedOrHidden(): void
    {
        $draftPool = Pool::factory()->draft()->create();
        $publishedPool = Pool::factory()->published()->create();
        $closedPool = Pool::factory()->closed()->create();
        $archivedPool = Pool::factory()->archived()->create();
        $hiddenPool = Pool::factory()->published()->create(['is_hidden' => true]);

        $response = $this->graphQL(
            /** @lang GraphQL */
            '
        query publishedPoolsSearch {
            publishedPoolsSearch {
                data {
                    id
                }
            }
        }
    '
        );

        // published and closed returned
        // 2 pools total, so no draft or archived or hidden
        assertEqualsCanonicalizing(
            [$publishedPool->id, $closedPool->id],
            $response->json('data.publishedPoolsSearch.data.*.id')
        );
    }

    // every filter input through the API, so a field wired to the wrong scope or type fails here
    public function testAllFiltersThroughQuery(): void
    {
        $this->freezeTime();

        $department = Department::factory()->create();
        $otherDepartment = Department::factory()->create();
        // two classifications in the filter, so the salary filter can be missed without missing the classification filter
        $classification = Classification::factory()->create(['min_salary' => 85000, 'max_salary' => 95000]);
        $higherPaidClassification = Classification::factory()->create(['min_salary' => 120000, 'max_salary' => 130000]);
        $otherClassification = Classification::factory()->create(['min_salary' => 85000, 'max_salary' => 95000]);

        // matches every filter below
        $matching = [
            'name' => ['en' => 'Matching pool', 'fr' => 'abc'],
            'area_of_selection' => PoolAreaOfSelection::PUBLIC->name,
            'department_id' => $department->id,
            'classification_id' => $classification->id,
            'published_at' => now()->subDays(10),
            'advertisement_language' => PoolLanguage::ENGLISH->name,
            'process_number' => 'MATCH-001',
        ];
        $skill = Skill::factory()->create(['category' => SkillCategory::BEHAVIOURAL->name]);
        $matchingPool = Pool::factory()->published()->create($matching);
        $matchingPool->poolSkills()->create(['skill_id' => $skill->id, 'type' => PoolSkillType::NONESSENTIAL->name]);

        // each misses exactly one filter
        $misses = [
            'keywordSearch' => ['name' => ['en' => 'Other pool', 'fr' => 'abc']],
            'eligibility' => ['area_of_selection' => PoolAreaOfSelection::EMPLOYEES->name],
            'departments' => ['department_id' => $otherDepartment->id],
            'classifications' => ['classification_id' => $otherClassification->id],
            'publishedAtRange' => ['published_at' => now()->subDays(40)],
            'languages' => ['advertisement_language' => PoolLanguage::FRENCH->name],
            'salaryRange' => ['classification_id' => $higherPaidClassification->id],
            'skills' => [],
            'processNumber' => ['process_number' => 'OTHER-002'],
            'poolStatuses' => ['closing_date' => now()->subDay()],
        ];
        foreach ($misses as $filter => $override) {
            $pool = Pool::factory()->published()->create(array_merge($matching, $override));
            if ($filter !== 'skills') {
                $pool->poolSkills()->create(['skill_id' => $skill->id, 'type' => PoolSkillType::NONESSENTIAL->name]);
            }
        }

        $response = $this->graphQL(
            /** @lang GraphQL */
            '
            query publishedPoolsSearch($where: PublishedPoolsSearchInput) {
                publishedPoolsSearch(where: $where) {
                    data {
                        id
                    }
                }
            }
        ',
            [
                'where' => [
                    'keywordSearch' => ['matching'],
                    'eligibility' => [PoolAreaOfSelection::PUBLIC->name],
                    'departments' => [$department->id],
                    'classifications' => [$classification->id, $higherPaidClassification->id],
                    'publishedAtRange' => [PoolPublishedRange::UNDER_30_DAYS->name],
                    'languages' => [LanguageAbility::ENGLISH->name],
                    'salaryRange' => SalaryRange::BETWEEN_80000_99999->name,
                    'skills' => [$skill->id],
                    'processNumber' => 'MATCH',
                    'poolStatuses' => [PoolStatus::PUBLISHED->name],
                ],
            ]
        );

        assertEquals(
            [$matchingPool->id],
            array_column($response['data']['publishedPoolsSearch']['data'], 'id')
        );
    }

    public function testMatchRankOrdersBySkillOverlapThenId(): void
    {
        $skillA = Skill::factory()->create(['category' => SkillCategory::BEHAVIOURAL->name]);
        $skillB = Skill::factory()->create(['category' => SkillCategory::BEHAVIOURAL->name]);

        $bothSkills = Pool::factory()->published()->create();
        $bothSkills->poolSkills()->create(['skill_id' => $skillA->id, 'type' => PoolSkillType::ESSENTIAL->name]);
        $bothSkills->poolSkills()->create(['skill_id' => $skillB->id, 'type' => PoolSkillType::ESSENTIAL->name]);
        // two pools with the same score, tie broken by the default id sort
        $tiedPools = Pool::factory()->count(2)->published()->create();
        foreach ($tiedPools as $pool) {
            $pool->poolSkills()->create(['skill_id' => $skillA->id, 'type' => PoolSkillType::ESSENTIAL->name]);
        }
        $tiedIdsDesc = $tiedPools->pluck('id')->sortDesc()->values()->all();

        $query = /** @lang GraphQL */ '
            query publishedPoolsSearch($where: PublishedPoolsSearchInput, $orderBy: [QueryPublishedPoolsSearchOrderByOrderByClause!]) {
                publishedPoolsSearch(where: $where, orderBy: $orderBy) {
                    data {
                        id
                    }
                }
            }
        ';

        $response = $this->graphQL($query, [
            'where' => ['skills' => [$skillA->id, $skillB->id]],
            'orderBy' => [['column' => 'MATCH_RANK', 'order' => 'DESC']],
        ]);
        assertEquals(
            [$bothSkills->id, ...$tiedIdsDesc],
            $response->json('data.publishedPoolsSearch.data.*.id')
        );

        // nothing scored, so every pool ties and the default id sort applies
        $response = $this->graphQL($query, [
            'orderBy' => [['column' => 'MATCH_RANK', 'order' => 'DESC']],
        ]);
        assertEquals(
            Pool::query()->pluck('id')->sortDesc()->values()->all(),
            $response->json('data.publishedPoolsSearch.data.*.id')
        );
    }

    public function testMatchRankPagesWithCursor(): void
    {
        $skillA = Skill::factory()->create(['category' => SkillCategory::BEHAVIOURAL->name]);
        $skillB = Skill::factory()->create(['category' => SkillCategory::BEHAVIOURAL->name]);
        $makePool = function (string $name, array $skills) {
            $pool = Pool::factory()->published()->create(['name' => ['en' => $name, 'fr' => 'abc']]);
            foreach ($skills as [$skill, $type]) {
                $pool->poolSkills()->create(['skill_id' => $skill->id, 'type' => $type->name]);
            }

            return $pool;
        };

        // the last two only rank this way round because of the keyword: on skills alone they swap
        $partWordStrongSkill = $makePool('Database admin', [[$skillA, PoolSkillType::ESSENTIAL]]); // 0.5 + 0.5
        $wholeWordWeakSkill = $makePool('Data officer', [[$skillA, PoolSkillType::NONESSENTIAL]]); // 1.0 + 0.25
        // three pools with the same score, so the tie spans the first two pages
        $tiedIdsDesc = collect([1, 2, 3])
            ->map(fn () => $makePool('Data analyst', [[$skillA, PoolSkillType::ESSENTIAL]])->id) // 1.0 + 0.5
            ->sortDesc()->values()->all();
        $highest = $makePool('Data lead', [[$skillA, PoolSkillType::ESSENTIAL], [$skillB, PoolSkillType::ESSENTIAL]]); // 1.0 + 1.0

        $query = /** @lang GraphQL */ '
            query publishedPoolsSearchWithCursor($where: PublishedPoolsSearchInput, $after: String) {
                publishedPoolsSearchWithCursor(
                    where: $where
                    orderBy: [{ column: MATCH_RANK, order: DESC }]
                    first: 2
                    after: $after
                ) {
                    totalCount
                    edges {
                        node {
                            id
                        }
                    }
                    pageInfo {
                        hasNextPage
                        endCursor
                    }
                }
            }
        ';
        $where = ['keywordSearch' => ['data'], 'skills' => [$skillA->id, $skillB->id]];

        $ids = [];
        $after = null;
        do {
            $response = $this->graphQL($query, ['where' => $where, 'after' => $after]);
            $response->assertJsonPath('data.publishedPoolsSearchWithCursor.totalCount', 6);
            $ids = [...$ids, ...$response->json('data.publishedPoolsSearchWithCursor.edges.*.node.id')];
            $after = $response->json('data.publishedPoolsSearchWithCursor.pageInfo.endCursor');
        } while ($response->json('data.publishedPoolsSearchWithCursor.pageInfo.hasNextPage'));

        assertEquals([$highest->id, ...$tiedIdsDesc, $wholeWordWeakSkill->id, $partWordStrongSkill->id], $ids);
    }

    public function testRankedCursorCanBeReplayedWithoutFilters(): void
    {
        $skill = Skill::factory()->create(['category' => SkillCategory::BEHAVIOURAL->name]);
        $pools = Pool::factory()->count(2)->published()->create();
        foreach ($pools as $pool) {
            $pool->poolSkills()->create(['skill_id' => $skill->id, 'type' => PoolSkillType::ESSENTIAL->name]);
        }

        $query = /** @lang GraphQL */ '
            query publishedPoolsSearchWithCursor($where: PublishedPoolsSearchInput, $after: String) {
                publishedPoolsSearchWithCursor(
                    where: $where
                    orderBy: [{ column: MATCH_RANK, order: DESC }]
                    first: 1
                    after: $after
                ) {
                    edges {
                        node {
                            id
                        }
                    }
                    pageInfo {
                        endCursor
                    }
                }
            }
        ';

        $cursor = $this->graphQL($query, ['where' => ['skills' => [$skill->id]]])
            ->json('data.publishedPoolsSearchWithCursor.pageInfo.endCursor');

        // with no filters every pool scores 0, which must still compare against the cursor's decimal score
        $this->graphQL($query, ['after' => $cursor])->assertGraphQLErrorFree();
    }
}
