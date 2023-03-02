<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Tests\TestCase;
use App\Models\Classification;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;

class ClassificationTest extends TestCase
{
    use RefreshDatabase;
    use MakesGraphQLRequests;
    use RefreshesSchemaCache;
    use WithFaker;

    protected $baseUser;
    protected $adminUser;
    protected $uuid;
    protected $toBeDeletedUUID;

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
        $this->toBeDeletedUUID = $this->faker->UUID();

        Classification::factory()->create([
            'id' => $this->uuid
        ]);

        Classification::factory()->create([
            'id' => $this->toBeDeletedUUID
        ]);
    }

    /**
     * Test base user can view any
     *
     * @return void
     */
    public function test_view_any_classification()
    {
        $this->actingAs($this->baseUser, 'api')
            ->graphQL('query { classifications { id } }')
            ->assertJsonFragment([ 'id' => $this->uuid ]);
    }

    /**
     * Test base user can view any
     *
     * @return void
     */
    public function test_view_classification()
    {

        $variables = [ 'id' => $this->uuid ];

        $query = /** @lang GraphQL */
        '
            query GetClassification($id: UUID!) {
                classification(id: $id) {
                    id
                }
            }
        ';

        $this->actingAs($this->baseUser, 'api')
            ->graphQL($query, $variables)
            ->assertJsonFragment($variables);
    }

    /**
     * Test updating a classification
     *
     * @return void
     */
    public function test_update_classification()
    {

        $variables = [
            'id' => $this->uuid,
            'classification' => [
                'name' => [
                    'en' => 'New Name (EN)',
                    'fr' => 'New Name (FR)'
                ]
            ]
        ];

        $mutation = /** @lang GraphQL */
        '
            mutation UpdateClassification($id: ID!, $classification: UpdateClassificationInput!) {
                updateClassification(id: $id, classification: $classification) {
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
            ->assertJsonFragment([ 'id' => $this->uuid, 'name' => $variables['classification']['name'] ]);
    }

    /**
     * Test creation of classification
     *
     * @return void
     */
    public function test_create_classification()
    {
        $variables = [
            'classification' => [
                'name' => [
                    'en' => 'New Name (EN)',
                    'fr' => 'New Name (FR)'
                ],
                'group' => 'IT',
                'level' => 1,
            ]
        ];

        $mutation = /** @lang GraphQL */
        '
            mutation Create($classification: CreateClassificationInput!) {
                createClassification(classification: $classification) {
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
            ->assertJsonFragment(['name' => $variables['classification']['name'] ]);

    }

    /**
     * Test base user cannot update or delete
     *
     * @return void
     */
    public function test_delete_classification()
    {
        $variables = [ 'id' => $this->toBeDeletedUUID ];

        $mutation = /** @lang GraphQL */
        '
            mutation Delete($id: ID!) {
                deleteClassification(id: $id) {
                    id
                }
            }
        ';

        $this->actingAs($this->baseUser, 'api')
            ->graphQL($mutation, $variables)
            ->assertGraphQLErrorMessage('This action is unauthorized.');

        $this->actingAs($this->adminUser, 'api')
            ->graphQL($mutation, $variables)
            ->assertJsonFragment(['id' => $this->toBeDeletedUUID ]);
    }
}
