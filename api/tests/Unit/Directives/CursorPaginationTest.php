<?php

namespace Tests\Unit\Directives;

use App\Models\Community;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Nuwave\Lighthouse\Testing\MocksResolvers;
use Nuwave\Lighthouse\Testing\UsesTestSchema;
use Tests\TestCase;
use Tests\UsesUnprotectedGraphqlEndpoint;

final class CursorPaginationTest extends TestCase
{
    use MakesGraphQLRequests;

    // use MocksResolvers;
    use RefreshDatabase;
    use UsesTestSchema;
    use UsesUnprotectedGraphqlEndpoint;

    protected function setUp(): void
    {
        parent::setUp();

        Community::factory()->create(['key' => '1']);
        Community::factory()->create(['key' => '2']);
        Community::factory()->create(['key' => '3']);
        Community::factory()->create(['key' => '4']);
        Community::factory()->create(['key' => '5']);

        $this->setUpTestSchema();
    }

    public function testCursorPagination(): void
    {
        $this->schema = /** @lang GraphQL */ '
            type Community  {
                key: String!
            }

            type Query {
                communities: [Community]!
                @cursorPaginate(
                    type: CONNECTION
                )
            }
        ';

        $response = $this->graphQL(/** @lang GraphQL */ '
        {
            communities(first: 3) {
                edges {
                    node {
                        key
                    }
                    # cursor
                }
                pageInfo {
                    currentPage
                    lastPage
                }
            }
        }
        ');

        // $response->ddBody();

        $response->assertExactJson([
            'data' => [
                'communities' => [
                    'edges' => [
                        ['node' => ['key' => '1']],
                        ['node' => ['key' => '2']],
                        ['node' => ['key' => '3']],
                    ],
                    'pageInfo' => [
                        'currentPage' => 1,
                        'lastPage' => 2,
                    ],
                ],
            ],
        ]);
    }
}
