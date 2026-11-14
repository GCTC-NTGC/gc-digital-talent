<?php

namespace Tests\Unit;

use App\Builders\PoolBuilder;
use App\Enums\LanguageAbility;
use App\Enums\PoolAreaOfSelection;
use App\Enums\PoolLanguage;
use App\Enums\PoolPublishedRange;
use App\Enums\PoolSkillType;
use App\Enums\SalaryRange;
use App\Enums\SkillCategory;
use App\Models\Classification;
use App\Models\Pool;
use App\Models\Skill;
use App\Models\WorkStream;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use Throwable;

use function PHPUnit\Framework\assertEquals;
use function PHPUnit\Framework\assertEqualsCanonicalizing;

class PoolBuilderTest extends TestCase
{
    use RefreshDatabase;
    use WithFaker;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);
    }

    public function testOrderByColumnSortsDescWithNullsLast()
    {
        Pool::factory()->create([
            'id' => '00000000-0000-0000-0000-000000000001',
            'published_at' => null,
        ]);
        Pool::factory()->create([
            'id' => '00000000-0000-0000-0000-000000000002',
            'published_at' => '2020-01-01',
        ]);
        Pool::factory()->create([
            'id' => '00000000-0000-0000-0000-000000000003',
            'published_at' => '2021-01-01',
        ]);

        $sorted = Pool::orderByColumn([
            'column' => 'published_at',
            'order' => 'DESC',
            'nulls' => 'ORDER_LAST',
        ])->get(['id'])->pluck('id')->toArray();

        assertEquals($sorted, [
            '00000000-0000-0000-0000-000000000003',
            '00000000-0000-0000-0000-000000000002',
            '00000000-0000-0000-0000-000000000001', // null forced last
        ]);
    }

    public function testOrderByColumnSortsDescWithNullsDefault()
    {
        Pool::factory()->create([
            'id' => '00000000-0000-0000-0000-000000000003',
            'published_at' => '2021-01-01',
        ]);
        Pool::factory()->create([
            'id' => '00000000-0000-0000-0000-000000000002',
            'published_at' => '2020-01-01',
        ]);
        Pool::factory()->create([
            'id' => '00000000-0000-0000-0000-000000000001',
            'published_at' => null,
        ]);

        $sorted = Pool::orderByColumn([
            'column' => 'published_at',
            'order' => 'DESC',
        ])->get(['id'])->pluck('id')->toArray();

        assertEquals($sorted, [
            '00000000-0000-0000-0000-000000000001', // null first by default, for DESC
            '00000000-0000-0000-0000-000000000003',
            '00000000-0000-0000-0000-000000000002',
        ]);
    }

    public function testOrderByColumnSortsAscWithNullsFirst()
    {
        Pool::factory()->create([
            'id' => '00000000-0000-0000-0000-000000000003',
            'published_at' => '2021-01-01',
        ]);
        Pool::factory()->create([
            'id' => '00000000-0000-0000-0000-000000000002',
            'published_at' => '2020-01-01',
        ]);
        Pool::factory()->create([
            'id' => '00000000-0000-0000-0000-000000000001',
            'published_at' => null,
        ]);

        $sorted = Pool::orderByColumn([
            'column' => 'published_at',
            'order' => 'ASC',
            'nulls' => 'ORDER_FIRST',
        ])->get(['id'])->pluck('id')->toArray();

        assertEquals($sorted, [
            '00000000-0000-0000-0000-000000000001', // null forced first
            '00000000-0000-0000-0000-000000000002',
            '00000000-0000-0000-0000-000000000003',
        ]);
    }

    public function testOrderByWorkStreamNameSortsByLocale()
    {
        // English and French names sort in opposite orders
        $alphaZulu = WorkStream::factory()->create(['name' => ['en' => 'Alpha', 'fr' => 'Zulu']]);
        $bravoAlpha = WorkStream::factory()->create(['name' => ['en' => 'Bravo', 'fr' => 'Alpha']]);
        Pool::factory()->create([
            'id' => '00000000-0000-0000-0000-000000000001',
            'work_stream_id' => $alphaZulu->id,
        ]);
        Pool::factory()->create([
            'id' => '00000000-0000-0000-0000-000000000002',
            'work_stream_id' => $bravoAlpha->id,
        ]);

        $sortedEn = Pool::orderByWorkStreamName([
            'order' => 'ASC',
            'locale' => 'EN',
        ])->get(['id'])->pluck('id')->toArray();

        $sortedFr = Pool::orderByWorkStreamName([
            'order' => 'ASC',
            'locale' => 'FR',
        ])->get(['id'])->pluck('id')->toArray();

        assertEquals($sortedEn, [
            '00000000-0000-0000-0000-000000000001',
            '00000000-0000-0000-0000-000000000002',
        ]);
        assertEquals($sortedFr, [
            '00000000-0000-0000-0000-000000000002',
            '00000000-0000-0000-0000-000000000001',
        ]);
    }

    public function testOrderByColumnRejectsBadOrder()
    {
        try {
            Pool::orderByColumn([
                'column' => 'published_at',
                'order' => 'bad_order',
            ]);
        } catch (Throwable $e) {
            assertEquals('Invalid order option', $e->getMessage());

            return;
        }
        $this->fail('Expected exception');
    }

    public function testOrderByColumnRejectsBadNullsOption()
    {
        try {
            Pool::orderByColumn([
                'column' => 'published_at',
                'order' => 'ASC',
                'nulls' => 'bad_nulls',
            ]);
        } catch (Throwable $e) {
            assertEquals('Invalid nulls option', $e->getMessage());

            return;
        }
        $this->fail('Expected exception');
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
        $poolIds = Pool::query()->whereSalaryRangeIn(SalaryRange::BETWEEN_0_39999->name)->get()->pluck('id')->toArray();
        assertEqualsCanonicalizing([
            $belowBoundary->id,
        ], $poolIds);

        // match 40000-59999 inclusive on 40000
        $poolIds = Pool::query()->whereSalaryRangeIn(SalaryRange::BETWEEN_40000_59999->name)->get()->pluck('id')->toArray();
        assertEqualsCanonicalizing([
            $onBoundary->id,
        ], $poolIds);

        // match 120000 and above, inclusive on 120000
        $poolIds = Pool::query()->whereSalaryRangeIn(SalaryRange::OVER_120000->name)->get()->pluck('id')->toArray();
        assertEqualsCanonicalizing([
            $onTopBoundary->id,
        ], $poolIds);
    }

    public function testSkillsScope(): void
    {
        $skillA = Skill::factory()->create(['category' => SkillCategory::BEHAVIOURAL->name]);
        $skillB = Skill::factory()->create(['category' => SkillCategory::BEHAVIOURAL->name]);
        $essentialA = Pool::factory()->published()->create();
        $essentialA->poolSkills()->create(['skill_id' => $skillA->id, 'type' => PoolSkillType::ESSENTIAL->name]);
        $nonessentialB = Pool::factory()->published()->create();
        $nonessentialB->poolSkills()->create(['skill_id' => $skillB->id, 'type' => PoolSkillType::NONESSENTIAL->name]);
        Pool::factory()->published()->create();

        // essential skills match
        $poolIds = Pool::query()->whereSkillsIn([$skillA->id])->get()->pluck('id')->toArray();
        assertEqualsCanonicalizing([
            $essentialA->id,
        ], $poolIds);

        // nonessential skills match, and selected skills are OR matched
        $poolIds = Pool::query()->whereSkillsIn([$skillA->id, $skillB->id])->get()->pluck('id')->toArray();
        assertEqualsCanonicalizing([
            $essentialA->id,
            $nonessentialB->id,
        ], $poolIds);
    }

    public function testMatchScoreRanksSkillOverlap(): void
    {
        $skillA = Skill::factory()->create(['category' => SkillCategory::BEHAVIOURAL->name]);
        $skillB = Skill::factory()->create(['category' => SkillCategory::BEHAVIOURAL->name]);
        $makePool = function (array $skills) {
            $pool = Pool::factory()->published()->create();
            foreach ($skills as [$skill, $type]) {
                $pool->poolSkills()->create(['skill_id' => $skill->id, 'type' => $type->name]);
            }

            return $pool;
        };

        // scores are (sum of essential 1.0 / nonessential 0.5) / 2 skills selected
        $nonessentialA = $makePool([[$skillA, PoolSkillType::NONESSENTIAL]]); // 0.25
        $essentialBoth = $makePool([[$skillA, PoolSkillType::ESSENTIAL], [$skillB, PoolSkillType::ESSENTIAL]]); // 1.0
        $essentialA = $makePool([[$skillA, PoolSkillType::ESSENTIAL]]); // 0.5
        $essentialANonessentialB = $makePool([[$skillA, PoolSkillType::ESSENTIAL], [$skillB, PoolSkillType::NONESSENTIAL]]); // 0.75

        $poolIds = Pool::query()
            ->whereSkillsIn([$skillA->id, $skillB->id])
            ->withMatchScore()
            ->orderBy(PoolBuilder::MATCH_SCORE_COLUMN, 'desc')
            ->get()->pluck('id')->toArray();
        assertEquals([
            $essentialBoth->id,
            $essentialANonessentialB->id,
            $essentialA->id,
            $nonessentialA->id,
        ], $poolIds);

        // ascending reverses the score order
        $poolIds = Pool::query()
            ->whereSkillsIn([$skillA->id, $skillB->id])
            ->withMatchScore()
            ->orderBy(PoolBuilder::MATCH_SCORE_COLUMN, 'asc')
            ->get()->pluck('id')->toArray();
        assertEquals([
            $nonessentialA->id,
            $essentialA->id,
            $essentialANonessentialB->id,
            $essentialBoth->id,
        ], $poolIds);
    }

    public function testMatchScoreWithoutScoredFiltersLeavesOrderToNextSort(): void
    {
        Pool::factory()->count(3)->published()->create();

        // every pool scores 0, so the next sort decides the order
        $poolIds = Pool::query()
            ->withMatchScore()
            ->orderBy(PoolBuilder::MATCH_SCORE_COLUMN, 'desc')
            ->orderBy('id', 'desc')
            ->get()->pluck('id')->toArray();
        assertEquals(Pool::query()->orderBy('id', 'desc')->pluck('id')->toArray(), $poolIds);
    }

    public function testMatchScoreRanksWholeWordKeywordsAboveSubstrings(): void
    {
        $substring = Pool::factory()->published()->create(['name' => ['en' => 'Database administrator', 'fr' => 'abc']]);
        $wholeWordFrench = Pool::factory()->published()->create(['name' => ['en' => 'abc', 'fr' => 'Analyste de data']]);
        $wholeWord = Pool::factory()->published()->create(['name' => ['en' => 'Data analyst', 'fr' => 'abc']]);
        // regex characters in a term are escaped, so they don't break the score expression
        $literal = Pool::factory()->published()->create(['name' => ['en' => 'C++ developer', 'fr' => 'abc']]);

        $poolIds = Pool::query()
            ->keywordSearch(['data'])
            ->withMatchScore()
            ->orderBy(PoolBuilder::MATCH_SCORE_COLUMN, 'desc')
            ->orderBy('id', 'desc')
            ->get()->pluck('id')->toArray();
        $tiedWholeWords = collect([$wholeWord->id, $wholeWordFrench->id])->sortDesc()->values()->all();
        assertEquals([...$tiedWholeWords, $substring->id], $poolIds);

        // every term must still match: both pools score (1.0 for 'data' + 0.5 for 'analys') / 2
        $poolIds = Pool::query()
            ->keywordSearch(['data', 'analys'])
            ->withMatchScore()
            ->orderBy(PoolBuilder::MATCH_SCORE_COLUMN, 'desc')
            ->get()->pluck('id')->toArray();
        assertEqualsCanonicalizing([$wholeWord->id, $wholeWordFrench->id], $poolIds);

        $poolIds = Pool::query()
            ->keywordSearch(['c++'])
            ->withMatchScore()
            ->orderBy(PoolBuilder::MATCH_SCORE_COLUMN, 'desc')
            ->get()->pluck('id')->toArray();
        assertEquals([$literal->id], $poolIds);
    }

    public function testMatchScoreGivesWholeWordCreditToTermsEndingInSymbols(): void
    {
        $wholeWord = Pool::factory()->published()->create(['name' => ['en' => 'C++ developer', 'fr' => 'abc']]);
        $partOfWord = Pool::factory()->published()->create(['name' => ['en' => 'C++Builder specialist', 'fr' => 'abc']]);

        $scores = Pool::query()
            ->keywordSearch(['c++'])
            ->withMatchScore()
            ->get()->pluck(PoolBuilder::MATCH_SCORE_COLUMN, 'id');

        assertEquals(1.0, (float) $scores[$wholeWord->id]);
        assertEquals(0.5, (float) $scores[$partOfWord->id]);
    }

    public function testMatchScoreCombinesKeywordsAndSkills(): void
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

        // Each pool needs both parts of its score to land where it does: the keyword part alone
        // would put the whole word pool first, and the skills part alone would put it last.
        // The earlier pools tied once the keyword part was taken away, so the test could pass by chance.
        $substringBothSkills = $makePool('Database analyst', [[$skillA, PoolSkillType::ESSENTIAL], [$skillB, PoolSkillType::ESSENTIAL]]); // 0.5 + 1.0
        $wholeWordWeakSkill = $makePool('Data analyst', [[$skillA, PoolSkillType::NONESSENTIAL]]); // 1.0 + 0.25
        $substringOneSkill = $makePool('Database administrator', [[$skillA, PoolSkillType::ESSENTIAL]]); // 0.5 + 0.5

        $poolIds = Pool::query()
            ->keywordSearch(['data'])
            ->whereSkillsIn([$skillA->id, $skillB->id])
            ->withMatchScore()
            ->orderBy(PoolBuilder::MATCH_SCORE_COLUMN, 'desc')
            ->get()->pluck('id')->toArray();
        assertEquals([
            $substringBothSkills->id,
            $wholeWordWeakSkill->id,
            $substringOneSkill->id,
        ], $poolIds);
    }
}
