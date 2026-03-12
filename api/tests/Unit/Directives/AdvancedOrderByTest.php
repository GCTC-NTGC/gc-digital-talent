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

    public function testItThrowsErrorWhenMultipleSourcesProvided(): void
    {
        $response = $this->actingAs($this->admin, 'api')->graphQL($this->query, [
            'orderBy' => [[
                'order' => [
                    'column' => 'notes',
                    'scope' => 'orderByFlagged',
                ],
                'direction' => 'ASC',
            ]],
        ]);

        $response->assertGraphQLErrorMessage(
            'AdvancedOrderSource is mutually exclusive. You provided: column, scope'
        );
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
            $path = is_string($expectedValue) && str_starts_with($expectedValue, 'user:')
                ? "data.testCandidates.{$index}.user.firstName"
                : "data.testCandidates.{$index}.notes";

            $cleanValue = (is_string($expectedValue))
                ? str_replace('user:', '', $expectedValue)
                : $expectedValue;

            $response->assertJsonPath($path, $cleanValue);
        }
    }

    public static function orderByDataProvider(): array
    {
        return [
            'Standard Column ASC' => [
                [['notes' => 'C'], ['notes' => 'A'], ['notes' => 'B']],
                [['order' => ['column' => 'notes'], 'direction' => 'ASC']],
                ['A', 'B', 'C'],
            ],
            'Relation Column with Postgres Unaccent' => [
                [['user_name' => 'Élodie'], ['user_name' => 'Alphonse']],
                [[
                    'order' => ['relation' => ['name' => 'user', 'column' => 'first_name']],
                    'direction' => 'ASC',
                    'accentInsensitive' => true,
                    'caseInsensitive' => true,
                ]],
                ['user:Alphonse', 'user:Élodie'],
            ],
            'Nulls Last' => [
                [['notes' => null], ['notes' => 'Z']],
                [['order' => ['column' => 'notes'], 'direction' => 'ASC', 'nulls' => 'LAST']],
                ['Z', null],
            ],
            'Case Insensitive Standard' => [
                [['notes' => 'apple'], ['notes' => 'Banana'], ['notes' => 'Zebra']],
                [['order' => ['column' => 'notes'], 'direction' => 'ASC', 'caseInsensitive' => true]],
                ['apple', 'Banana', 'Zebra'],
            ],
            'Builder Scope: orderByPoolName' => [
                [
                    ['notes' => 'Candidate B', 'pool_name' => 'Beta Pool'],
                    ['notes' => 'Candidate A', 'pool_name' => 'Alpha Pool'],
                ],
                [[
                    'order' => ['scope' => 'orderByPoolName'],
                    'direction' => 'ASC',
                ]],
                ['Candidate A', 'Candidate B'],
            ],
        ];
    }
}
