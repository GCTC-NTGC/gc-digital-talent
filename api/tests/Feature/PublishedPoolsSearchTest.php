<?php

namespace Tests\Feature;

use App\Enums\LanguageAbility;
use App\Enums\PoolAreaOfSelection;
use App\Enums\PoolLanguage;
use App\Enums\PoolPublishedRange;
use App\Enums\SalaryRange;
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
                    'salaryRange' => SalaryRange::BETWEEN_80000_99999->name,
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
