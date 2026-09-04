<?php

namespace Tests\Unit\Directives;

use App\Models\Pool;
use App\Models\PoolCandidate;
use App\Models\User;
use App\Support\Query\AdvancedOrder;
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
                    'is_flagged' => $data['is_flagged'] ?? false,
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
            'Builder Scope: orderByFlag' => [
                [
                    ['notes' => 'Candidate B', 'is_flagged' => false],
                    ['notes' => 'Candidate A', 'is_flagged' => true],
                ],
                [[
                    'scope' => 'orderByFlag',
                    'direction' => 'DESC',
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

    #[DataProvider('injectionDataProvider')]
    public function testItRejectsInjectionAttempts(array $orderByArgs, string $expectedMessage): void
    {
        PoolCandidate::factory()->create(['notes' => 'A']);

        $this->actingAs($this->admin, 'api')->graphQL($this->query, [
            'orderBy' => $orderByArgs,
        ])->assertGraphQLErrorMessage($expectedMessage);
    }

    public static function injectionDataProvider(): array
    {
        return [
            'Unknown column with trailing SQL' => [
                [['column' => "notes' , (SELECT 1/0) --"]],
                "Invalid column: notes' , (SELECT 1/0) --",
            ],
            'Relation column with trailing SQL' => [
                [['relation' => ['name' => 'user', 'column' => "first_name' , (SELECT 1/0) --"]]],
                "Invalid related column: first_name' , (SELECT 1/0) --",
            ],
            'Nested JSON keys' => [
                [['relation' => ['name' => 'pool', 'column' => 'name->en->fr']]],
                'Only one JSON key is supported: name->en->fr',
            ],
        ];
    }

    #[DataProvider('boundJsonKeyDataProvider')]
    public function testItBindsJsonKeysWithoutExecutingThem(array $orderByArgs): void
    {
        PoolCandidate::factory()->create(['notes' => 'A']);

        $this->actingAs($this->admin, 'api')->graphQL($this->query, [
            'orderBy' => $orderByArgs,
        ])->assertGraphQLErrorFree();
    }

    public static function boundJsonKeyDataProvider(): array
    {
        return [
            'JSON key with quote and subquery' => [
                [['relation' => ['name' => 'pool', 'column' => "name->en' , (SELECT CASE WHEN (1=1) THEN 1 ELSE (SELECT 1/0) END) --"]]],
            ],
            'JSON key that is only a comment' => [
                [['relation' => ['name' => 'pool', 'column' => 'name-> --']]],
            ],
        ];
    }

    #[DataProvider('rejectedSourceDataProvider')]
    public function testItRejectsUnusableSources(array $orderByArgs, string $expectedMessage): void
    {
        PoolCandidate::factory()->create(['notes' => 'A']);

        $this->actingAs($this->admin, 'api')->graphQL($this->query, [
            'orderBy' => $orderByArgs,
        ])->assertGraphQLErrorMessage($expectedMessage);
    }

    public static function rejectedSourceDataProvider(): array
    {
        return [
            'Unknown relation name' => [
                [['relation' => ['name' => 'notARelation', 'column' => 'notes']]],
                'Invalid relation: notARelation',
            ],
            'Model method that is not a relation' => [
                [['relation' => ['name' => 'isDraft', 'column' => 'notes']]],
                'Method isDraft is not a valid Eloquent relation.',
            ],
            'Model method with a side effect' => [
                [['relation' => ['name' => 'save', 'column' => 'notes']]],
                'Method save is not a valid Eloquent relation.',
            ],
            'Many to many relation' => [
                [['relation' => ['name' => 'bookmarkedByUsers', 'column' => 'first_name']]],
                'Relation type Illuminate\Database\Eloquent\Relations\BelongsToMany is not supported for sub-query sorting.',
            ],
            'Unknown scope with the orderBy prefix' => [
                [['scope' => 'orderByNothing']],
                'Invalid scope: orderByNothing',
            ],
        ];
    }

    /**
     * A relation name is client supplied, so the method it names must be rejected on its
     * signature rather than by inspecting what a call returned.
     */
    public function testItDoesNotCallMethodsThatAreNotRelations(): void
    {
        PoolCandidate::factory()->create(['notes' => 'A']);
        $before = PoolCandidate::count();

        $this->actingAs($this->admin, 'api')->graphQL($this->query, [
            'orderBy' => [['relation' => ['name' => 'save', 'column' => 'notes']]],
        ])->assertGraphQLErrorMessage('Method save is not a valid Eloquent relation.');

        $this->assertSame($before, PoolCandidate::count());
    }

    public function testItIgnoresScopesWithoutTheOrderByPrefix(): void
    {
        PoolCandidate::factory()->create(['notes' => 'A']);

        $this->actingAs($this->admin, 'api')->graphQL($this->query, [
            'orderBy' => [['scope' => 'authorizedToView']],
        ])->assertGraphQLErrorFree()->assertJsonFragment(['notes' => 'A']);
    }

    #[DataProvider('advancedOrderArgsDataProvider')]
    public function testItNormalisesDirectionAndNulls(array $input, string $expectedDirection, ?string $expectedNulls): void
    {
        $args = new AdvancedOrder($input);

        $this->assertSame($expectedDirection, $args->direction);
        $this->assertSame($expectedNulls, $args->nulls);
    }

    public static function advancedOrderArgsDataProvider(): array
    {
        return [
            'Empty input' => [[], 'ASC', null],
            'Lowercase values' => [['direction' => 'desc', 'nulls' => 'first'], 'DESC', 'FIRST'],
            'Unknown direction' => [['direction' => 'ASC NULLS LAST --'], 'ASC', null],
            'Unknown nulls' => [['nulls' => "LAST' , (SELECT 1/0) --"], 'ASC', null],
            'Null nulls' => [['nulls' => null], 'ASC', null],
        ];
    }
}
