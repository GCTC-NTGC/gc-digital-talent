<?php

namespace Tests\Feature;

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
}
