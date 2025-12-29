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
        // $this->mockResolver(function ($root, array $args): array {
        //     return ['a', 'b', 'c', 'd', 'e', 'f'];
        // });

        // $this->schema = /** @lang GraphQL */ '
        //     type Query {
        //         foo: [String]
        //         @mock
        //         @cursorPaginate(
        //             defaultCount: 3
        //         )
        //     }
        // ';

        $this->schema = /** @lang GraphQL */ '
            type Community  {
                key: String!
            }

            type Query {
                communities: [Community]!
                @cursorPaginate(
                    defaultCount: 3
                )
            }
        ';

        $this->graphQL(/** @lang GraphQL */ '
        {
            communities {
                data {
                    key
                }
                paginatorInfo {
                    currentPage
                    lastPage
                }
            }
        }
        ')->assertExactJson([
            'data' => [
                'communities' => [
                    'data' => [
                        ['key' => '1'],
                        ['key' => '2'],
                        ['key' => '3'],
                    ],
                    'paginatorInfo' => [
                        'currentPage' => 1,
                        'lastPage' => 2,
                    ],
                ],
            ],
        ]);
    }
}
