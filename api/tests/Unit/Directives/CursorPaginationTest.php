<?php

namespace Tests\Unit\Directives;

use App\Models\Community;
use Illuminate\Foundation\Testing\RefreshDatabase;
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

        $this->setUpTestSchema();

        $this->schema = /** @lang GraphQL */ '
            type Community  {
                key: String!
            }

            type Query {
                communities: [Community]!
                @cursorPaginate
            }
        ';
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
}
