<?php

namespace Tests\Feature;

use Carbon\Carbon;
use App\Models\PoolCandidate;
use App\Models\User;
use App\Policies\UserPolicy;
use Database\Helpers\ApiEnums;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Testing\Fluent\AssertableJson;
use Mockery;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Nuwave\Lighthouse\Testing\MocksResolvers;
use Nuwave\Lighthouse\Testing\UsesTestSchema;
use Tests\TestCase;

use function PHPUnit\Framework\assertSame;
use function PHPUnit\Framework\assertNotNull;

class DirectivesTest extends TestCase
{
    use UsesTestSchema;
    use MocksResolvers;
    use MakesGraphQLRequests;
    use RefreshDatabase;

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

    // Ensure the canOnParent custom directive works as expected
    public function testCanOnParent(): void
    {
        $admin = User::factory()->create([
            'first_name' => 'Admin',
            'last_name' => 'Test',
            'email' => 'admin@test.com',
            'sub' => 'admin@test.com',
            'legacy_roles' => [ApiEnums::LEGACY_ROLE_ADMIN, ApiEnums::LEGACY_ROLE_APPLICANT]
        ]);
        $applicant = User::factory()->create([
            'first_name' => 'Applicant',
            'last_name' => 'Test',
            'email' => 'applicant@test.com',
            'sub' => 'applicant@test.com',
            'legacy_roles' => [ApiEnums::LEGACY_ROLE_APPLICANT]
        ]);
        $otherApplicant = User::factory()->create([
            'first_name' => 'Other',
            'last_name' => 'Test',
            'email' => 'other@test.com',
            'sub' => 'other@test.com',
            'legacy_roles' => [ApiEnums::LEGACY_ROLE_APPLICANT]
        ]);

        PoolCandidate::factory()->count(3)->availableInSearch()->create([
            'user_id' => $applicant->id,
        ]);

        $this->mockResolver(function () use ($applicant) {
            return $applicant->fresh();
        });

        $this->schema =
        /** @lang GraphQL */
        '
        type PoolCandidate {
            id: ID
            user: User @belongsTo(relation: "user")
        }
        type User {
            id: ID
            poolCandidates: [PoolCandidate] @hasMany @canOnParent(ability: "view")
        }
        type Query {
            user: User @mock
        }
        ';

        $query =
            /** @lang GraphQL */
            '
        query getUser {
            user {
                id
                poolCandidates {
                    id
                }
            }
        }
        ';

        $isUser = function ($user) {
            return function ($argument) use ($user) {
                return $argument instanceof User && $argument->id == $user->id;
            };
        };
        $mock = $this->mock(UserPolicy::class);

        // Admin should be able to view the applicant user, and therefor all its candidates.
        $mock->shouldReceive('view')
            ->with(Mockery::on($isUser($admin)), (Mockery::on($isUser($applicant))))
            ->andReturn(true);
        $adminResponse = $this->actingAs($admin, 'api')->graphQL($query);
        $adminResponse->assertJson(fn (AssertableJson $json) =>
            $json->has('data.user.poolCandidates', 3)
                ->missing('errors')
                ->etc()
        );


        // Applicant should be able to view its own user, and therefor all its candidates.
        $mock->shouldReceive('view')
            ->with(Mockery::on($isUser($applicant)), (Mockery::on($isUser($applicant))))
            ->andReturn(true);
        $applicantResponse = $this->actingAs($applicant, 'api')->graphQL($query);
        $applicantResponse->assertJson(fn (AssertableJson $json) =>
            $json->has('data.user.poolCandidates', 3)
                ->missing('errors')
                ->etc()
        );

        // Other user should not be able to view poolCandidates, as they are protected by UserPolicy.
        $mock->shouldReceive('view')
            ->with(Mockery::on($isUser($otherApplicant)), (Mockery::on($isUser($applicant))))
            ->andReturn(false);
        $otherResponse = $this->actingAs($otherApplicant, 'api')->graphQL($query);
        $otherResponse->assertJson(fn (AssertableJson $json) =>
            $json->where('data.user.poolCandidates', null)
                ->where('errors.0.message', 'This action is unauthorized.')
                ->etc()
        );
    }

    public function testInjectNow(): void {

        $this->mockResolver(function ($root, array $args) {
            return $args["date"];
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

        $executionTime = Carbon::now();

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
                ]
            ]
        );

        $dateReturned = $response->json('data.testMutation');

        // assert current datetime was injected and it is identical to the time recording before running the mutation, to the second
        assertNotNull($dateReturned);
        assertSame($dateReturned, $executionTime->toDateTimeString());
    }
}
