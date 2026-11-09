<?php

namespace Tests\Feature;

use App\Enums\ClassificationSalaryRange;
use App\Enums\LanguageAbility;
use App\Enums\PoolAreaOfSelection;
use App\Enums\PoolLanguage;
use App\Enums\PoolPublishedRange;
use App\Models\Classification;
use App\Models\Department;
use App\Models\Pool;
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
        $response->assertJsonFragment([
            'id' => $publishedPool->id,
        ]);
        $response->assertJsonFragment([
            'id' => $closedPool->id,
        ]);
        assertEquals(
            2,
            count($response['data']['publishedPoolsSearch']['data'])
        );
    }

    // just exercises the name scope at the moment
    public function testKeywordSearchScope(): void
    {
        $englishMatch = Pool::factory()->published()->create(
            [
                'name' => [
                    'en' => 'english',
                    'fr' => 'abc',
                ],
            ]
        );
        $frenchMatch = Pool::factory()->published()->create(
            [
                'name' => [
                    'en' => 'def',
                    'fr' => 'french',
                ],
            ]
        );
        $noMatch = Pool::factory()->published()->create(
            [
                'name' => [
                    'en' => 'abc',
                    'fr' => 'def',
                ],
            ]
        );

        // matches searching by name in English and French
        // match english
        $poolIds = Pool::query()->keywordSearch(['english'])->get()->pluck('id')->toArray();
        assertEqualsCanonicalizing([
            $englishMatch->id,
        ], $poolIds);
        // match french
        $poolIds = Pool::query()->keywordSearch(['french'])->get()->pluck('id')->toArray();
        assertEqualsCanonicalizing([
            $frenchMatch->id,
        ], $poolIds);
        // match english AND french returns no one
        $poolIds = Pool::query()->keywordSearch(['english', 'french'])->get()->pluck('id')->toArray();
        assertEqualsCanonicalizing([], $poolIds);
        // match both names of $english match returns it
        $poolIds = Pool::query()->keywordSearch(['english', 'abc'])->get()->pluck('id')->toArray();
        assertEqualsCanonicalizing([
            $englishMatch->id,
        ], $poolIds);
    }

    public function testAreaOfSelectionScope(): void
    {
        $publicPool = Pool::factory()->published()->create([
            'area_of_selection' => PoolAreaOfSelection::PUBLIC->name,
        ]);
        $employeesPool = Pool::factory()->published()->create([
            'area_of_selection' => PoolAreaOfSelection::EMPLOYEES->name,
        ]);

        // only public
        $poolIds = Pool::query()->whereAreaOfSelectionIn([PoolAreaOfSelection::PUBLIC->name])->get()->pluck('id')->toArray();
        assertEqualsCanonicalizing([
            $publicPool->id,
        ], $poolIds);

        // OR matched
        $poolIds = Pool::query()->whereAreaOfSelectionIn([
            PoolAreaOfSelection::PUBLIC->name,
            PoolAreaOfSelection::EMPLOYEES->name,
        ])->get()->pluck('id')->toArray();
        assertEqualsCanonicalizing([
            $publicPool->id,
            $employeesPool->id,
        ], $poolIds);
    }

    public function testPublishedAtRangeScope(): void
    {
        $this->freezeTime();

        $postedHoursAgo = Pool::factory()->published()->create([
            'published_at' => now()->subHours(47),
        ]);
        $postedDaysAgo = Pool::factory()->published()->create([
            'published_at' => now()->subDays(10),
        ]);
        $postedMonthsAgo = Pool::factory()->published()->create([
            'published_at' => now()->subDays(40),
        ]);

        // returns the newest only
        $poolIds = Pool::query()->wherePublishedAtIn([PoolPublishedRange::UNDER_48_HOURS->name])->get()->pluck('id')->toArray();
        assertEqualsCanonicalizing([
            $postedHoursAgo->id,
        ], $poolIds);

        // returns the one from 47 hours and 10 days
        $poolIds = Pool::query()->wherePublishedAtIn([PoolPublishedRange::UNDER_30_DAYS->name])->get()->pluck('id')->toArray();
        assertEqualsCanonicalizing([
            $postedHoursAgo->id,
            $postedDaysAgo->id,
        ], $poolIds);

        // only the 40 days ago
        $poolIds = Pool::query()->wherePublishedAtIn([PoolPublishedRange::OVER_30_DAYS->name])->get()->pluck('id')->toArray();
        assertEqualsCanonicalizing([
            $postedMonthsAgo->id,
        ], $poolIds);

        // OR matched
        $poolIds = Pool::query()->wherePublishedAtIn([
            PoolPublishedRange::UNDER_48_HOURS->name,
            PoolPublishedRange::OVER_30_DAYS->name,
        ])->get()->pluck('id')->toArray();
        assertEqualsCanonicalizing([
            $postedHoursAgo->id,
            $postedMonthsAgo->id,
        ], $poolIds);
    }

    public function testLanguagesScope(): void
    {
        $englishPool = Pool::factory()->published()->create([
            'advertisement_language' => PoolLanguage::ENGLISH->name,
        ]);
        $frenchPool = Pool::factory()->published()->create([
            'advertisement_language' => PoolLanguage::FRENCH->name,
        ]);
        $variousPool = Pool::factory()->published()->create([
            'advertisement_language' => PoolLanguage::VARIOUS->name,
        ]);
        $bilingualIntermediatePool = Pool::factory()->published()->create([
            'advertisement_language' => PoolLanguage::BILINGUAL_INTERMEDIATE->name,
        ]);
        $bilingualAdvancedPool = Pool::factory()->published()->create([
            'advertisement_language' => PoolLanguage::BILINGUAL_ADVANCED->name,
        ]);
        $variousBilingualPool = Pool::factory()->published()->create([
            'advertisement_language' => PoolLanguage::VARIOUS_BILINGUAL->name,
        ]);

        // VARIOUS always matches
        // english and various
        $poolIds = Pool::query()->whereLanguagesIn([LanguageAbility::ENGLISH->name])->get()->pluck('id')->toArray();
        assertEqualsCanonicalizing([
            $englishPool->id,
            $variousPool->id,
        ], $poolIds);

        // all three bilingual plus various
        $poolIds = Pool::query()->whereLanguagesIn([LanguageAbility::BILINGUAL->name])->get()->pluck('id')->toArray();
        assertEqualsCanonicalizing([
            $bilingualIntermediatePool->id,
            $bilingualAdvancedPool->id,
            $variousBilingualPool->id,
            $variousPool->id,
        ], $poolIds);

        // OR matched
        $poolIds = Pool::query()->whereLanguagesIn([
            LanguageAbility::ENGLISH->name,
            LanguageAbility::FRENCH->name,
        ])->get()->pluck('id')->toArray();
        assertEqualsCanonicalizing([
            $englishPool->id,
            $frenchPool->id,
            $variousPool->id,
        ], $poolIds);
    }

    public function testSalaryRangeScope(): void
    {
        $belowBoundary = Pool::factory()->published()->create([
            'classification_id' => Classification::factory()->create(['min_salary' => 39999, 'max_salary' => 49999])->id,
        ]);
        $onBoundary = Pool::factory()->published()->create([
            'classification_id' => Classification::factory()->create(['min_salary' => 40000, 'max_salary' => 50000])->id,
        ]);
        $onTopBoundary = Pool::factory()->published()->create([
            'classification_id' => Classification::factory()->create(['min_salary' => 120000, 'max_salary' => 130000])->id,
        ]);

        // match 39999 and below, inclusive on 39999
        $poolIds = Pool::query()->whereSalaryRangeIn(ClassificationSalaryRange::BETWEEN_0_39999->name)->get()->pluck('id')->toArray();
        assertEqualsCanonicalizing([
            $belowBoundary->id,
        ], $poolIds);

        // match 40000-59999 inclusive on 40000
        $poolIds = Pool::query()->whereSalaryRangeIn(ClassificationSalaryRange::BETWEEN_40000_59999->name)->get()->pluck('id')->toArray();
        assertEqualsCanonicalizing([
            $onBoundary->id,
        ], $poolIds);

        // match 120000 and above, inclusive on 120000
        $poolIds = Pool::query()->whereSalaryRangeIn(ClassificationSalaryRange::OVER_120000->name)->get()->pluck('id')->toArray();
        assertEqualsCanonicalizing([
            $onTopBoundary->id,
        ], $poolIds);
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
        $matchingPool = Pool::factory()->published()->create($matching);

        // each misses exactly one filter
        $misses = [
            'keywordSearch' => ['name' => ['en' => 'Other pool', 'fr' => 'abc']],
            'eligibility' => ['area_of_selection' => PoolAreaOfSelection::EMPLOYEES->name],
            'departments' => ['department_id' => $otherDepartment->id],
            'classifications' => ['classification_id' => $otherClassification->id],
            'publishedAtRange' => ['published_at' => now()->subDays(40)],
            'languages' => ['advertisement_language' => PoolLanguage::FRENCH->name],
            'salaryRange' => ['classification_id' => $higherPaidClassification->id],
            'processNumber' => ['process_number' => 'OTHER-002'],
        ];
        foreach ($misses as $override) {
            Pool::factory()->published()->create(array_merge($matching, $override));
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
                    'salaryRange' => ClassificationSalaryRange::BETWEEN_80000_99999->name,
                    'processNumber' => 'MATCH',
                ],
            ]
        );

        assertEquals(
            [$matchingPool->id],
            array_column($response['data']['publishedPoolsSearch']['data'], 'id')
        );
    }
}
