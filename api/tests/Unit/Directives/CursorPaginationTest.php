<?php

namespace Tests\Unit\Directives;

use App\Models\Community;
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

        // Communities are not important to the tests.  They are just a convenient, simple model to use.
        Community::factory()->create(['id' => '00000000-0000-0000-0000-000000000001', 'key' => '1']);
        Community::factory()->create(['id' => '00000000-0000-0000-0000-000000000002', 'key' => '2']);
        Community::factory()->create(['id' => '00000000-0000-0000-0000-000000000003', 'key' => '3']);
        Community::factory()->create(['id' => '00000000-0000-0000-0000-000000000004', 'key' => '4']);
        Community::factory()->create(['id' => '00000000-0000-0000-0000-000000000005', 'key' => '5']);

        $this->schema = /** @lang GraphQL */ '
            type Community  {
                key: String!
            }

            type Query {
                communities: [Community]!
                @cursorPaginate
            }
        ';

        $this->setUpTestSchema();
    }

    public function testSinglePage(): void
    {
        $this->graphQL(/** @lang GraphQL */ '
        {
            communities(first: 3) {
                edges {
                    node {
                        key
                    }
                }
                pageInfo {
                    hasPreviousPage
                    hasNextPage
                }
            }
        }
        ')->assertExactJson([
            'data' => [
                'communities' => [
                    'edges' => [
                        ['node' => ['key' => '1']],
                        ['node' => ['key' => '2']],
                        ['node' => ['key' => '3']],
                    ],
                    'pageInfo' => [
                        'hasPreviousPage' => false,
                        'hasNextPage' => true,
                    ],
                ],
            ],
        ]);
    }

    public function testMultiplePages(): void
    {
        $query = /** @lang GraphQL */ '
            query Communities($after: String) {
                communities(first: 3, after: $after) {
                    edges {
                        node {
                            key
                        }
                    }
                    pageInfo {
                        startCursor
                        endCursor
                    }
                }
            }
        ';

        $response1 = $this->graphQL($query, [
            'after' => null,
        ]);

        $response1->assertGraphQLErrorFree();
        $edges1 = Arr::get($response1, 'data.communities.edges');
        $keys1 = Arr::pluck($edges1, 'node.key');
        $this->assertEquals(['1', '2', '3'], $keys1);

        $response2 = $this->graphQL($query, [
            'after' => Arr::get($response1, 'data.communities.pageInfo.endCursor'),
        ]);

        $response2->assertGraphQLErrorFree();
        $edges2 = Arr::get($response2, 'data.communities.edges');
        $keys2 = Arr::pluck($edges2, 'node.key');
        $this->assertEquals(['4', '5'], $keys2);
    }
}
