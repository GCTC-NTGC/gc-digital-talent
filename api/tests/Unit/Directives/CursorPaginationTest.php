<?php

namespace Tests\Unit\Directives;

use App\Models\Classification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Arr;
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
}
