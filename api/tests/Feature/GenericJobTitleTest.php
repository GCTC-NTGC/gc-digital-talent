<?php

namespace Tests\Feature;

use App\Models\GenericJobTitle;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Tests\TestCase;
use App\Models\User;
use Database\Helpers\ApiEnums;
use Database\Seeders\ClassificationSeeder;
use Database\Seeders\GenericJobTitleSeeder;
use Database\Seeders\RolePermissionSeeder;

class GenericJobTitleTest extends TestCase
{
    use RefreshDatabase;
    use MakesGraphQLRequests;
    use RefreshesSchemaCache;
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
            "guest",
            "base_user",
            "pool_operator",
            "request_responder"
        ]);

        $this->adminUser = User::create([
            'email' => 'admin-user@test.com',
            'sub' => 'admin-user@test.com',
        ]);
        $this->adminUser->addRole("platform_admin");

        $this->genericJobTitle = GenericJobTitle::factory()->create();
    }

    /**
     * Test base user can view any
     *
     * @return void
     */
    public function test_view_any_generic_job_title()
    {
        $this->actingAs($this->baseUser, 'api')
            ->graphQL('query { genericJobTitles { id } }')
            ->assertJsonFragment(['id' => $this->genericJobTitle->id]);
    }

    /**
     * Test base user can view any
     *
     * @return void
     */
    public function test_view_generic_job_title()
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
