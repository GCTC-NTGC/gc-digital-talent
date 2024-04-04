<?php

namespace Tests\Feature;

use Carbon\Carbon;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Nuwave\Lighthouse\Testing\MocksResolvers;
use Nuwave\Lighthouse\Testing\UsesTestSchema;
use Tests\TestCase;

use function PHPUnit\Framework\assertNotNull;
use function PHPUnit\Framework\assertSame;

class DirectivesTest extends TestCase
{
    use MakesGraphQLRequests;
    use MocksResolvers;
    use RefreshDatabase;
    use UsesTestSchema;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);
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
                            'id' => '1',
                            'key' => 'key-one',
                        ],
                        [
                            'id' => '2',
                            'key' => 'key-two',
                        ],
                    ],
                ],
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
                        'id' => '1',
                        'key' => 'key-one',
                    ],
                ],
            ]
        );
        // List should have been transformed by pluck before being returned by mockResolver.
        $response->assertJson([
            'data' => [
                'test' => '1',
            ],
        ]);
    }

    public function testInjectNow(): void
    {

        $this->mockResolver(function ($root, array $args) {
            return $args['date'];
        });

        $this->schema =
            /** @lang GraphQL */
            '
        input TestInput {
            id: ID
        }
        type Query {
            testQuery(t: TestInput): ID @mock
        }
        type Mutation {
            testMutation(t: TestInput): ID @mock @injectNow(name: "date")
        }
        ';

        $executionTime = Carbon::now()->toDateTimeString();
        $executionTime = substr($executionTime, 0, -3); // round to minute for test reliability purposes

        $response = $this->graphQL(
            /** @lang GraphQL */
            '
            mutation testMutation($t: TestInput) {
                testMutation(t: $t)
            }
        ',
            [
                't' => [
                    'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
                ],
            ]
        );

        $dateReturned = $response->json('data.testMutation');
        $dateReturned = substr($dateReturned, 0, -3);

        // assert current datetime was injected and it is identical to the time recording before running the mutation, rounded to the minute
        assertNotNull($dateReturned);
        assertSame($dateReturned, $executionTime);
    }

    public function testLowerCase(): void
    {
        // testing Lighthouse with PHPUnit https://lighthouse-php.com/6/testing/extensions.html
        $this->mockResolver(function ($root, array $args): string {
            return $args['bar'];
        });

        $this->schema =
            /** @lang GraphQL */
            '
        type Query {
            foo(bar: String @lowerCase): String @mock
        }
        ';

        // assert input string is set to lowercase
        $this->graphQL(
            /** @lang GraphQL */
            '
        {
            foo(bar: "UPPERCASE")
        }
        '
        )->assertExactJson([
            'data' => [
                'foo' => 'uppercase',
            ],
        ]);
    }
}
