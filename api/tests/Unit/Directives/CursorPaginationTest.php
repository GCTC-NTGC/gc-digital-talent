<?php

namespace Tests\Unit\Directives;

use App\Models\Classification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Nuwave\Lighthouse\Testing\UsesTestSchema;
use Tests\TestCase;
use Tests\UsesUnprotectedGraphqlEndpoint;

final class CursorPaginationTest extends TestCase
{
    use MakesGraphQLRequests;
    use RefreshDatabase;
    use UsesTestSchema;
    use UsesUnprotectedGraphqlEndpoint;

    protected function setUp(): void
    {
        parent::setUp();

        // Classifications are not important to the tests.  They are just a convenient, simple model to use.
        Classification::factory()->create(['level' => 1, 'is_available_in_search' => true]);
        Classification::factory()->create(['level' => 2, 'is_available_in_search' => false]);
        Classification::factory()->create(['level' => 3, 'is_available_in_search' => true]);
        Classification::factory()->create(['level' => 4, 'is_available_in_search' => false]);
        Classification::factory()->create(['level' => 5, 'is_available_in_search' => true]);

        $this->schema = /** @lang GraphQL */ '
            type Classification  {
                level: Int!
                isAvailableInSearch: Boolean @rename(attribute: "is_available_in_search")
            }

            input ClassificationFilterInput {
               availableInSearch: Boolean @scope
            }

            type Query {
                classifications(
                    where: ClassificationFilterInput
                    orderBy: [OrderByClause!] @orderBy
                ): [Classification!]!
                @cursorPaginate(
                    maxCount: 10,
                )
            }
        ';

        $this->setUpTestSchema();
    }

    public function testSinglePage(): void
    {
        $this->graphQL(/** @lang GraphQL */ '
        {
            classifications(
                orderBy: { column: "level", order: ASC }
                first: 3,
            ) {
                edges {
                    node {
                        level
                    }
                }
                pageInfo {
                    hasNextPage
                }
            }
        }
        ')->assertExactJson([
            'data' => [
                'classifications' => [
                    'edges' => [
                        ['node' => ['level' => 1]],
                        ['node' => ['level' => 2]],
                        ['node' => ['level' => 3]],
                    ],
                    'pageInfo' => [
                        'hasNextPage' => true,
                    ],
                ],
            ],
        ]);
    }

    public function testMultiplePages(): void
    {
        // get first page
        $response1 = $this->graphQL(/** @lang GraphQL */ '
        {
            classifications(
                orderBy: { column: "level", order: ASC }
                first: 3,
            ) {
                edges {
                    node {
                        level
                    }
                }
                pageInfo {
                    startCursor
                    endCursor
                }
            }
        }
        ');

        // first page is "1, 2, 3"
        $response1->assertGraphQLErrorFree();
        $edges1 = Arr::get($response1, 'data.classifications.edges');
        $levels1 = Arr::pluck($edges1, 'node.level');
        $this->assertEquals([1, 2, 3], $levels1);

        // forward paginate to the second page using "after" cursor
        $response2 = $this->graphQL(/** @lang GraphQL */ '
            query Classifications($after: String) {
                classifications(
                    orderBy: { column: "level", order: ASC }
                    first: 3,
                    after: $after
                ) {
                    edges {
                        node {
                            level
                        }
                    }
                    pageInfo {
                        startCursor
                        endCursor
                    }
                }
            }
        ', [
            'after' => Arr::get($response1, 'data.classifications.pageInfo.endCursor'),
        ]);

        // second page is "4, 5"
        $response2->assertGraphQLErrorFree();
        $edges2 = Arr::get($response2, 'data.classifications.edges');
        $levels2 = Arr::pluck($edges2, 'node.level');
        $this->assertEquals([4, 5], $levels2);

        // reverse paginate back to the first page using "before" cursor
        $response3 = $this->graphQL(/** @lang GraphQL */ '
            query Classifications($before: String) {
                classifications(
                    orderBy: { column: "level", order: ASC }
                    last: 3,
                    before: $before
                ) {
                    edges {
                        node {
                            level
                        }
                    }
                    pageInfo {
                        startCursor
                        endCursor
                    }
                }
            }
        ', [
            'before' => Arr::get($response2, 'data.classifications.pageInfo.startCursor'),
        ]);

        // back to first page -> "1, 2, 3"
        $response3->assertGraphQLErrorFree();
        $edges3 = Arr::get($response3, 'data.classifications.edges');
        $levels3 = Arr::pluck($edges3, 'node.level');
        $this->assertEquals([1, 2, 3], $levels3);
    }

    public function testZeroPerPage(): void
    {
        $this->graphQL(/** @lang GraphQL */ '
        {
            classifications(first: 0) {
                edges {
                    node {
                        level
                    }
                }
                pageInfo {
                    startCursor
                    endCursor
                    hasNextPage
                }
            }
        }
        ')->assertExactJson([
            'data' => [
                'classifications' => [
                    'edges' => [],
                    'pageInfo' => [
                        'startCursor' => null,
                        'endCursor' => null,
                        'hasNextPage' => false,
                    ],
                ],
            ],
        ]);
    }

    public function testWorksWithOtherClauses(): void
    {
        $this->graphQL(/** @lang GraphQL */ '
        {
            classifications(
                where: { availableInSearch: true }
                orderBy: { column: "level", order: ASC }
                first: 3,

            ) {
                edges {
                    node {
                        level
                    }
                }
                pageInfo {
                    hasNextPage
                }
            }
        }
        ')->assertExactJson([
            'data' => [
                'classifications' => [
                    'edges' => [
                        ['node' => ['level' => 1]],
                        ['node' => ['level' => 3]],
                        ['node' => ['level' => 5]],
                    ],
                    'pageInfo' => [
                        'hasNextPage' => false,
                    ],
                ],
            ],
        ]);
    }

    public function testMaxCount(): void
    {
        $this->graphQL(/** @lang GraphQL */ '
        {
            classifications(first: 1000) {
                edges {
                    node {
                        level
                    }
                }
            }
        }
        ')->assertGraphQLErrorMessage('Maximum number of 10 requested items exceeded, got 1000. Fetch smaller chunks.');
    }

    public function testMustChooseAtMostForwardOrBackward(): void
    {
        $this->graphQL(/** @lang GraphQL */ '
        {
            classifications(first: 5, last:5) {
                edges {
                    node {
                        level
                    }
                }
            }
        }')->assertGraphQLValidationKeys(['first', 'last']);
    }

    public function testMustChooseAtLeastForwardOrBackward(): void
    {
        $this->graphQL(/** @lang GraphQL */ '
        {
            classifications {
                edges {
                    node {
                        level
                    }
                }
            }
        }')->assertGraphQLValidationKeys(['first', 'last']);
    }

    public function testSpecifyFirstWithAfter(): void
    {
        $this->graphQL(/** @lang GraphQL */ '
        {
            classifications(first: 5, before:"dummy_cursor") {
                edges {
                    node {
                        level
                    }
                }
            }
        }')->assertGraphQLValidationKeys(['first']);
    }

    public function testSpecifyLastWithBefore(): void
    {
        $this->graphQL(/** @lang GraphQL */ '
        {
            classifications(last: 5, after:"dummy_cursor") {
                edges {
                    node {
                        level
                    }
                }
            }
        }')->assertGraphQLValidationKeys(['last']);
    }

    public function testEdgesHaveWorkingCursors(): void
    {
        // Fetch first 3 edges and check their cursors
        $response = $this->graphQL(/** @lang GraphQL */ '
        {
            classifications(orderBy: { column: "level", order: ASC }, first: 3) {
                edges {
                    nextCursor
                    previousCursor
                    node { level }
                }
                pageInfo { hasNextPage }
            }
        }
        ');

        $response->assertGraphQLErrorFree();
        $edges = Arr::get($response, 'data.classifications.edges');
        $this->assertCount(3, $edges);

        // navigating forwards from the edge cursor of the second item returns the third item
        $secondForwardCursor = $edges[1]['nextCursor'];
        $responseForward = $this->graphQL(/** @lang GraphQL */ '
            query Classifications($after: String) {
                classifications(orderBy: { column: "level", order: ASC }, first: 1, after: $after) {
                    edges {
                        node { level }
                    }
                }
            }
        ', ['after' => $secondForwardCursor]);

        $responseForward->assertGraphQLErrorFree();
        $edgesForward = Arr::get($responseForward, 'data.classifications.edges');
        $this->assertCount(1, $edgesForward);
        $this->assertEquals(3, $edgesForward[0]['node']['level']);

        // navigating backwards from the edge cursor of the second item returns the first item
        $secondReverseCursor = $edges[1]['previousCursor'];
        $responseBack = $this->graphQL(/** @lang GraphQL */ '
            query Classifications($before: String) {
                classifications(orderBy: { column: "level", order: ASC }, last: 1, before: $before) {
                    edges {
                        node { level }
                    }
                }
            }
        ', ['before' => $secondReverseCursor]);

        $responseBack->assertGraphQLErrorFree();
        $edgesBack = Arr::get($responseBack, 'data.classifications.edges');
        $this->assertCount(1, $edgesBack);
        $this->assertEquals(1, $edgesBack[0]['node']['level']);
    }

    public function testTotalCountIgnoresPageAndCursor(): void
    {
        $query = /** @lang GraphQL */ '
            query Classifications($after: String) {
                classifications(
                    where: { availableInSearch: true }
                    orderBy: { column: "level", order: ASC }
                    first: 2
                    after: $after
                ) {
                    totalCount
                    edges { node { level } }
                    pageInfo { endCursor }
                }
            }
        ';

        // 3 of the 5 are available in search, whichever page is requested
        $response1 = $this->graphQL($query);
        $response1->assertJsonPath('data.classifications.totalCount', 3);
        $this->assertEquals([1, 3], Arr::pluck(Arr::get($response1, 'data.classifications.edges'), 'node.level'));

        $response2 = $this->graphQL($query, ['after' => Arr::get($response1, 'data.classifications.pageInfo.endCursor')]);
        $response2->assertJsonPath('data.classifications.totalCount', 3);
        $this->assertEquals([5], Arr::pluck(Arr::get($response2, 'data.classifications.edges'), 'node.level'));

        // and when no items are requested
        $this->graphQL(/** @lang GraphQL */ '{ classifications(first: 0) { totalCount } }')
            ->assertJsonPath('data.classifications.totalCount', 5);
    }

    public function testTotalCountOnlyQueriedWhenSelected(): void
    {
        $countQueries = function (string $selection): int {
            DB::flushQueryLog();
            DB::enableQueryLog();
            $this->graphQL("{ classifications(orderBy: { column: \"level\", order: ASC }, first: 2) { $selection } }")
                ->assertGraphQLErrorFree();
            DB::disableQueryLog();

            return count(array_filter(DB::getQueryLog(), fn ($entry) => str_contains($entry['query'], 'count(*)')));
        };

        $this->assertEquals(0, $countQueries('edges { node { level } }'));
        $this->assertEquals(1, $countQueries('totalCount edges { node { level } }'));
    }

    public function testInvalidCursorIsRejected(): void
    {
        $this->graphQL(/** @lang GraphQL */ '
        {
            classifications(first: 2, after: "not-a-cursor") {
                edges { node { level } }
            }
        }')->assertGraphQLErrorMessage('The cursor is not valid.');
    }

    public function testCursorFromAnotherOrderingIsRejected(): void
    {
        $response = $this->graphQL(/** @lang GraphQL */ '
        {
            classifications(orderBy: { column: "level", order: ASC }, first: 2) {
                pageInfo { endCursor }
            }
        }');

        $this->graphQL(/** @lang GraphQL */ '
            query Classifications($after: String) {
                classifications(orderBy: { column: "min_salary", order: ASC }, first: 2, after: $after) {
                    edges { node { level } }
                }
            }
        ', [
            'after' => Arr::get($response, 'data.classifications.pageInfo.endCursor'),
        ])->assertGraphQLErrorMessage('The cursor does not match the ordering of this query.');
    }
}
