<?php

namespace Tests\Feature;

use App\Models\GenericJobTitle;
use App\Models\User;
use Database\Seeders\ClassificationSeeder;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Tests\TestCase;
use Tests\UsesProtectedGraphqlEndpoint;

class GenericJobTitleTest extends TestCase
{
    use MakesGraphQLRequests;
    use RefreshDatabase;
    use RefreshesSchemaCache;
    use UsesProtectedGraphqlEndpoint;
    use WithFaker;

    protected $baseUser;

    protected $adminUser;

    protected $genericJobTitle;

    protected $toBeDeleted;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);
        $this->seed(ClassificationSeeder::class);
        $this->setUpFaker();
        $this->bootRefreshesSchemaCache();

        $this->baseUser = User::create([
            'email' => 'base-user@test.com',
            'sub' => 'base-user@test.com',
        ]);
        $this->baseUser->syncRoles([
            'guest',
            'base_user',
            'process_operator',
            'community_recruiter',
        ]);

        $this->adminUser = User::create([
            'email' => 'admin-user@test.com',
            'sub' => 'admin-user@test.com',
        ]);
        $this->adminUser->addRole('platform_admin');

        $this->genericJobTitle = GenericJobTitle::factory()->create();
    }

    /**
     * Test base user can view any
     *
     * @return void
     */
    public function testViewGenericJobTitle()
    {

        $variables = ['id' => $this->genericJobTitle->id];

        $query =
            /** @lang GraphQL */
            '
            query Get($id: UUID!) {
                genericJobTitle(id: $id) {
                    id
                }
            }
        ';

        $this->actingAs($this->baseUser, 'api')
            ->graphQL($query, $variables)
            ->assertJsonFragment($variables);
    }
}
