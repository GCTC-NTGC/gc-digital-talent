<?php

namespace Tests\Feature;

use App\Models\SkillFamily;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Tests\TestCase;

class SkillFamilyTest extends TestCase
{
    use MakesGraphQLRequests;
    use RefreshDatabase;
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
            'guest',
            'base_user',
            'pool_operator',
            'request_responder',
        ]);

        $this->adminUser = User::create([
            'email' => 'admin-user@test.com',
            'sub' => 'admin-user@test.com',
        ]);
        $this->adminUser->addRole('platform_admin');

        $this->uuid = $this->faker->UUID();

        SkillFamily::factory()->create([
            'id' => $this->uuid,
        ]);
    }

    /**
     * Test guest user can view any
     *
     * @return void
     */
    public function testViewAnySkillFamily()
    {
        $this->graphQL('query { skillFamilies { id } }')
            ->assertJsonFragment(['id' => $this->uuid]);
    }

    /**
     * Test guest user can view one
     *
     * @return void
     */
    public function testViewSkillFamily()
    {

        $variables = ['id' => $this->uuid];

        $query =
            /** @lang GraphQL */
            '
            query Get($id: UUID!) {
                skillFamily(id: $id) {
                    id
                }
            }
        ';

        $this->graphQL($query, $variables)
            ->assertJsonFragment($variables);
    }

    /**
     * Test updating a skillFamily
     *
     * @return void
     */
    public function testUpdateSkillFamily()
    {

        $variables = [
            'id' => $this->uuid,
            'skillFamily' => [
                'name' => [
                    'en' => 'New Name (EN)',
                    'fr' => 'New Name (FR)',
                ],
            ],
        ];

        $mutation =
            /** @lang GraphQL */
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
            ->graphQL($mutation, $variables)
            ->assertGraphQLErrorMessage('This action is unauthorized.');

        $this->actingAs($this->adminUser, 'api')
            ->graphQL($mutation, $variables)
            ->assertJsonFragment(['id' => $this->uuid, 'name' => $variables['skillFamily']['name']]);
    }

    /**
     * Test creation of skillFamily
     *
     * @return void
     */
    public function testCreateSkillFamily()
    {
        $variables = [
            'skillFamily' => [
                'key' => 'key',
                'name' => [
                    'en' => 'New Name (EN)',
                    'fr' => 'New Name (FR)',
                ],
            ],
        ];

        $mutation =
            /** @lang GraphQL */
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
            ->assertJsonFragment(['name' => $variables['skillFamily']['name']]);
    }
}
