<?php

namespace Tests\Feature;

use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Nuwave\Lighthouse\Testing\MocksResolvers;
use Nuwave\Lighthouse\Testing\UsesTestSchema;
use Tests\TestCase;

class DirectivesTest extends TestCase
{
    use UsesTestSchema;
    use MocksResolvers;
    use MakesGraphQLRequests;

    protected function setUp(): void
    {
        parent::setUp();

        $this->setUpTestSchema();
    }

    public function testPluckFromArray(): void
    {
        // Mock up a resolver that returns the args we're interested in
        $this->mockResolver(function ($root, array $args) {
            return $args['t']['list'];
        });

        $this->schema =
            /** @lang GraphQL */
            '
        type Item {
            id: ID
            key: String
        }
        input ItemInput {
            id: ID
            key: String
        }
        input TestInput {
            list: [ItemInput] @pluck(key: "id")
        }
        type Query {
            test(t: TestInput): [ID] @mock
        }
        ';

        $response = $this->graphQL(
            /** @lang GraphQL */
            '
            query test($t: TestInput) {
                test(t: $t)
            }
        ',
            [
                't' => [
                    'list' => [
                        [
                            'id' => "1",
                            'key' => "key-one"
                        ],
                        [
                            'id' => "2",
                            'key' => "key-two"
                        ]
                    ]
                ]
            ]
        );
        // List should have been transformed by pluck before being returned by mockResolver.
        $response->assertJson([
            'data' => [
                'test' => [
                    '1',
                    '2',
                ],
            ],
        ]);
    }

    public function testPluckFromObject(): void
    {
        // Mock up a resolver that returns the args we're interested in
        $this->mockResolver(function ($root, array $args) {
            return $args['t']['obj'];
        });

        $this->schema =
            /** @lang GraphQL */
            '
        type Item {
            id: ID
            key: String
        }
        input ItemInput {
            id: ID
            key: String
        }
        input TestInput {
            obj: ItemInput @pluck(key: "id")
        }
        type Query {
            test(t: TestInput): ID @mock
        }
        ';

        $response = $this->graphQL(
            /** @lang GraphQL */
            '
            query test($t: TestInput) {
                test(t: $t)
            }
        ',
            [
                't' => [
                    'obj' => [
                        'id' => "1",
                        'key' => "key-one"
                    ]
                ]
            ]
        );
        // List should have been transformed by pluck before being returned by mockResolver.
        $response->assertJson([
            'data' => [
                'test' => '1'
            ],
        ]);
    }
}
