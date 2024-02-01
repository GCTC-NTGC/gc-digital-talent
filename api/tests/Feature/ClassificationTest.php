<?php

namespace Tests\Feature;

use App\Models\Classification;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Tests\TestCase;

class ClassificationTest extends TestCase
{
    use MakesGraphQLRequests;
    use RefreshDatabase;
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
        $this->toBeDeletedUUID = $this->faker->UUID();

        Classification::factory()->create([
            'id' => $this->uuid,
        ]);

        Classification::factory()->create([
            'id' => $this->toBeDeletedUUID,
        ]);
    }

    /**
     * Test base user can view any
     *
     * @return void
     */
    public function testViewAnyClassification()
    {
        $this->actingAs($this->baseUser, 'api')
            ->graphQL('query { classifications { id } }')
            ->assertJsonFragment(['id' => $this->uuid]);
    }

    /**
     * Test base user can view any
     *
     * @return void
     */
    public function testViewClassification()
    {

        $variables = ['id' => $this->uuid];

        $query =
            /** @lang GraphQL */
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
    public function testUpdateClassification()
    {

        $variables = [
            'id' => $this->uuid,
            'classification' => [
                'name' => [
                    'en' => 'New Name (EN)',
                    'fr' => 'New Name (FR)',
                ],
            ],
        ];

        $mutation =
            /** @lang GraphQL */
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
            ->graphQL($mutation, $variables)
            ->assertGraphQLErrorMessage('This action is unauthorized.');

        $this->actingAs($this->adminUser, 'api')
            ->graphQL($mutation, $variables)
            ->assertJsonFragment(['id' => $this->uuid, 'name' => $variables['classification']['name']]);
    }

    /**
     * Test creation of classification
     *
     * @return void
     */
    public function testCreateClassification()
    {
        $variables = [
            'classification' => [
                'name' => [
                    'en' => 'New Name (EN)',
                    'fr' => 'New Name (FR)',
                ],
                'group' => 'IT',
                'level' => 1,
            ],
        ];

        $mutation =
            /** @lang GraphQL */
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
            ->assertJsonFragment(['name' => $variables['classification']['name']]);
    }

    /**
     * Test base user cannot update or delete
     *
     * @return void
     */
    public function testDeleteClassification()
    {
        $variables = ['id' => $this->toBeDeletedUUID];

        $mutation =
            /** @lang GraphQL */
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
            ->assertJsonFragment(['id' => $this->toBeDeletedUUID]);
    }
}
