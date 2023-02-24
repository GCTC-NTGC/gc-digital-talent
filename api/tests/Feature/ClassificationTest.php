<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Tests\TestCase;
use App\Models\Classification;
use App\Models\User;
use App\Models\Role;
use Database\Seeders\RolePermissionSeeder;

class ClassificationTest extends TestCase
{
    use RefreshDatabase;
    use MakesGraphQLRequests;
    use RefreshesSchemaCache;
    use WithFaker;

    protected $baseUser;
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
        $this->baseUser->attachRole("base_user");


        $this->uuid = $this->faker->UUID();

        Classification::factory()->create([
            'id' => $this->uuid
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
        $this->actingAs($this->baseUser, 'api')
            ->graphQL(
                'query GetClassification($id: UUID!){ classification(id: $id) { id } }',
                [ 'id' => $this->uuid ]
            )
            ->assertJsonFragment([ 'id' => $this->uuid ]);
    }
}
