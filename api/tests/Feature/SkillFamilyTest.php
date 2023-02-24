<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Tests\TestCase;
use App\Models\SkillFamily;
use App\Models\User;
use Database\Helpers\ApiEnums;
use Database\Seeders\RolePermissionSeeder;

class SkillFamilyTest extends TestCase
{
    use RefreshDatabase;
    use MakesGraphQLRequests;
    use RefreshesSchemaCache;
    use WithFaker;

    protected $baseUser;
    protected $adminUser;
    protected $uuid;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);
        $this->setUpFaker();
        $this->bootRefreshesSchemaCache();

        $this->baseUser = User::create([
            'email' => 'base-user@test.com',
            'sub' => 'base-user@test.com',
        ]);
        $this->baseUser->syncRoles([
            "guest",
            "base_user",
            "pool_operator",
            "request_responder"
        ]);

        $this->adminUser = User::create([
            'email' => 'admin-user@test.com',
            'sub' => 'admin-user@test.com',
        ]);
        $this->adminUser->attachRole("platform_admin");

        $this->uuid = $this->faker->UUID();

        SkillFamily::factory()->create([
            'id' => $this->uuid
        ]);
    }

    /**
     * Test base user can view any
     *
     * @return void
     */
    public function test_view_any_skill_family()
    {
        $this->actingAs($this->baseUser, 'api')
            ->graphQL('query { skillFamilies { id } }')
            ->assertJsonFragment([ 'id' => $this->uuid ]);
    }

    /**
     * Test base user can view any
     *
     * @return void
     */
    public function test_view_skill_family()
    {

        $variables = [ 'id' => $this->uuid ];

        $query = /** @lang GraphQL */
        '
            query Get($id: UUID!) {
                skillFamily(id: $id) {
                    id
                }
            }
        ';

        $this->actingAs($this->baseUser, 'api')
            ->graphQL($query, $variables)
            ->assertJsonFragment($variables);
    }

    /**
     * Test updating a skillFamily
     *
     * @return void
     */
    public function test_update_skill_family()
    {

        $variables = [
            'id' => $this->uuid,
            'skillFamily' => [
                'name' => [
                    'en' => 'New Name (EN)',
                    'fr' => 'New Name (FR)'
                ]
            ]
        ];

        $mutation = /** @lang GraphQL */
        '
            mutation UpdateSkillFamily($id: ID!, $skillFamily: UpdateSkillFamilyInput!) {
                updateSkillFamily(id: $id, skillFamily: $skillFamily) {
                    id
                    name {
                        en
                        fr
                    }
                }
            }
        ';

        $this->actingAs($this->baseUser, 'api')
            ->graphQL($mutation, $variables )
            ->assertGraphQLErrorMessage('This action is unauthorized.');

        $this->actingAs($this->adminUser, 'api')
            ->graphQL($mutation, $variables )
            ->assertJsonFragment([ 'id' => $this->uuid, 'name' => $variables['skillFamily']['name'] ]);
    }

    /**
     * Test creation of skillFamily
     *
     * @return void
     */
    public function test_create_skill_family()
    {
        $variables = [
            'skillFamily' => [
                'key' => 'key',
                'category' => ApiEnums::SKILL_CATEGORY_BEHAVIOURAL,
                'name' => [
                    'en' => 'New Name (EN)',
                    'fr' => 'New Name (FR)'
                ],
            ]
        ];

        $mutation = /** @lang GraphQL */
        '
            mutation Create($skillFamily: CreateSkillFamilyInput!) {
                createSkillFamily(skillFamily: $skillFamily) {
                    id
                    name {
                        en
                        fr
                    }
                }
            }
        ';

        $this->actingAs($this->baseUser, 'api')
            ->graphQL($mutation, $variables)
            ->assertGraphQLErrorMessage('This action is unauthorized.');

        $this->actingAs($this->adminUser, 'api')
            ->graphQL($mutation, $variables)
            ->assertJsonFragment(['name' => $variables['skillFamily']['name'] ]);

    }
}
