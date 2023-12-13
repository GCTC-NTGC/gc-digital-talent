<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Tests\TestCase;

class KeywordSearchTest extends TestCase
{
    use MakesGraphQLRequests;
    use RefreshDatabase;
    use RefreshesSchemaCache;

    protected $platformAdmin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->bootRefreshesSchemaCache();

        $this->seed(RolePermissionSeeder::class);

        $this->platformAdmin = User::factory()
            ->asAdmin()
            ->create([
                'email' => 'admin@test.com',
                'sub' => 'admin@test.com',
                'looking_for_english' => null,
                'looking_for_french' => null,
                'looking_for_bilingual' => null,
                'accepted_operational_requirements' => null,
                'location_preferences' => [],
                'has_diploma' => false,
                'position_duration' => [],
                'is_gov_employee' => false,
                'telephone' => null,
                'first_name' => null,
                'last_name' => null,
            ]);
    }

    // Test user can be searched by current city which is not available in the user table
    public function testUserSearchByCurrentCity()
    {
        $user1 = User::factory()->create([
            'current_city' => 'Ottawa',
        ]);
        $user2 = User::factory()->create([
            'current_city' => 'Toronto',
        ]);
        $user3 = User::factory()->create([
            'current_city' => 'Montreal',
        ]);

        $response = $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    data {
                        id
                    }
                }
            }
        ', [
                'where' => [
                    'generalSearch' => ['Toronto'],
            ],
        ])->assertJson([
            'data' => [
                'usersPaginated' => [
                    'data' => [
                        [
                            'id' => $user2->id,
                        ],
                    ],
                ],
            ],
        ]);
    }

    // Test user can not be searched once soft deleted
    public function testUserSearchBySoftDeleted()
    {
        $user1 = User::factory()->create([
            'first_name' => 'user',
            'last_name' => 'test',
        ]);
        $user2 = User::factory()->create([
            'first_name' => 'user',
            'last_name' => 'deleted',
            'deleted_at' => '2021-01-01 00:00:00',
        ]);
        $user3 = User::factory()->create([
            'first_name' => 'user',
            'last_name' => 'philip',
        ]);

        $response = $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                    data {
                        id
                    }
                }
            }
        ', [
            'where' => [
                'generalSearch' => ['user'],
            ],
        ])->assertJson([
                'data' => [
                    'usersPaginated' => [
                        'paginatorInfo' => [
                            'total' => 2,
                        ],
                        'data' => [
                            [
                                'id' => $user1->id,
                            ],
                            [
                                'id' => $user3->id,
                            ],
                        ],
            ],
            ],
        ]);
    }
}
