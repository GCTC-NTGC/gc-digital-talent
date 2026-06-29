<?php

namespace Tests\Unit\Directives;

use App\Models\Pool;
use App\Models\PoolCandidate;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Nuwave\Lighthouse\Testing\UsesTestSchema;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;
use Tests\UsesUnprotectedGraphqlEndpoint;

class AdvancedOrderByTest extends TestCase
{
    use MakesGraphQLRequests;
    use RefreshDatabase;
    use UsesTestSchema;
    use UsesUnprotectedGraphqlEndpoint;

    protected User $admin;

    protected Pool $pool;

    protected string $query = <<<'GRAPHQL'
        query TestAdvancedOrder($orderBy: [AdvancedOrderByInput!]) {
            testCandidates(orderBy: $orderBy) {
                notes
                user {
                    firstName
                }
                pool {
                    name {
                        en
                        fr
                    }
                }
            }
        }
    GRAPHQL;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);
        $this->admin = User::factory()->asAdmin()->create();

        $this->schema = <<<'GRAPHQL'
            type User {
                id: UUID!
                firstName: String @rename(attribute: "first_name")
            }

            type Pool {
                id: UUID!
                name: LocalizedString
            }


            type PoolCandidate {
                id: UUID!
                notes: String
                user: User @belongsTo
                pool: Pool @belongsTo
            }

            type Query {
                testCandidates: [PoolCandidate!]! @all @advancedOrderBy
            }
        GRAPHQL;

        $this->setUpTestSchema();
    }

    #[DataProvider('orderByDataProvider')]
    public function testAdvancedOrderingLogic(array $setupData, array $orderByArgs, array $expectedOrder): void
    {
        foreach ($setupData as $data) {
            $pool = Pool::factory()->create(
                isset($data['pool_name']) ? ['name' => ['en' => $data['pool_name']]] : []
            );

            $user = User::factory()->create(
                isset($data['user_name']) ? ['first_name' => $data['user_name']] : []
            );

            PoolCandidate::factory()
                ->for($user)
                ->for($pool)
                ->create([
                    'notes' => $data['notes'] ?? null,
                ]);
        }

        $response = $this->actingAs($this->admin, 'api')->graphQL($this->query, [
            'orderBy' => $orderByArgs,
        ]);

        foreach ($expectedOrder as $index => $expectedValue) {
            if (is_string($expectedValue) && str_starts_with($expectedValue, 'user:')) {
                $path = "data.testCandidates.{$index}.user.firstName";
            } elseif (is_string($expectedValue) && str_starts_with($expectedValue, 'pool:')) {
                $path = "data.testCandidates.{$index}.pool.name.en";
            } else {
                $path = "data.testCandidates.{$index}.notes";
            }

            $cleanValue = (is_string($expectedValue))
                ? str_replace(['user:', 'pool:'], '', $expectedValue)
                : $expectedValue;

            $response->assertJsonPath($path, $cleanValue);
        }
    }

    public static function orderByDataProvider(): array
    {
        return [
            'Standard Column ASC' => [
                [['notes' => 'C'], ['notes' => 'A'], ['notes' => 'B']],
                [['column' => 'notes', 'direction' => 'ASC']],
                ['A', 'B', 'C'],
            ],
            'Relation Column with Postgres Unaccent' => [
                [['user_name' => 'Élodie'], ['user_name' => 'Alphonse']],
                [[
                    'relation' => ['name' => 'user', 'column' => 'first_name'],
                    'direction' => 'ASC',
                    'accentInsensitive' => true,
                    'caseInsensitive' => true,
                ]],
                ['user:Alphonse', 'user:Élodie'],
            ],
            'Nulls Last' => [
                [['notes' => null], ['notes' => 'Z']],
                [['column' => 'notes', 'direction' => 'ASC', 'nulls' => 'LAST']],
                ['Z', null],
            ],
            'Case Insensitive Standard' => [
                [['notes' => 'apple'], ['notes' => 'Banana'], ['notes' => 'Zebra']],
                [['column' => 'notes', 'direction' => 'ASC', 'caseInsensitive' => true]],
                ['apple', 'Banana', 'Zebra'],
            ],
            'Builder Scope: orderByPoolName' => [
                [
                    ['notes' => 'Candidate B', 'pool_name' => 'Beta Pool'],
                    ['notes' => 'Candidate A', 'pool_name' => 'Alpha Pool'],
                ],
                [[
                    'scope' => 'orderByPoolName',
                    'direction' => 'ASC',
                ]],
                ['Candidate A', 'Candidate B'],
            ],
            'JSON Column ASC' => [
                [
                    ['notes' => 'A', 'pool_name' => 'Zebra'],
                    ['notes' => 'B', 'pool_name' => 'Apple'],
                ],
                [[
                    'relation' => ['name' => 'pool', 'column' => 'name->en'],
                    'direction' => 'ASC',
                ]],
                ['pool:Apple', 'pool:Zebra'],
            ],

            'JSON with Accents' => [
                [
                    ['notes' => 'Item 1', 'pool_name' => 'École'],
                    ['notes' => 'Item 2', 'pool_name' => 'Alphonse'],
                ],
                [[
                    'relation' => ['name' => 'pool', 'column' => 'name->en'],
                    'direction' => 'ASC',
                    'accentInsensitive' => true,
                ]],
                ['pool:Alphonse', 'pool:École'],
            ],
        ];
    }

    public function testItThrowsValidationErrorWhenMultipleSourcesProvided(): void
    {
        $this->actingAs($this->admin, 'api')->graphQL($this->query, [
            'orderBy' => [[
                'column' => 'notes',
                'scope' => 'orderByFlagged',
                'direction' => 'ASC',
            ]],
        ])->assertGraphQLValidationError('orderBy.0.column', 'Column, scope and relation keys are mutually exclusive.');
    }

    /**
     * Test that providing none of the required sources also fails
     */
    public function testItRequiresAtLeastOneSource(): void
    {
        $this->actingAs($this->admin, 'api')->graphQL($this->query, [
            'orderBy' => [[
                'direction' => 'DESC',
            ]],
        ])->assertGraphQLValidationError('orderBy.0.column', 'You must provide a column, scope, or relation.');
    }
}
