<?php

namespace Tests\Feature;

use App\Enums\DepartmentSize;
use App\Models\Community;
use App\Models\Department;
use App\Models\Pool;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Tests\TestCase;
use Tests\UsesProtectedGraphqlEndpoint;

class DepartmentTest extends TestCase
{
    use MakesGraphQLRequests;
    use RefreshDatabase;
    use RefreshesSchemaCache;
    use UsesProtectedGraphqlEndpoint;
    use WithFaker;

    protected $baseUser;

    protected $adminUser;

    protected $processOperatorUser;

    protected $communityRecruiterUser;

    protected $communityAdminUser;

    protected $community;

    protected $teamPool;

    protected $department;

    protected $toBeDeleted;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);
        $this->setUpFaker();
        $this->bootRefreshesSchemaCache();

        $this->community = Community::factory()->create(['name' => 'test-team']);
        $this->teamPool = Pool::factory()->create([
            'community_id' => $this->community->id,
        ]);

        $this->baseUser = User::create([
            'email' => 'base-user@test.com',
            'sub' => 'base-user@test.com',
        ]);
        $this->baseUser->syncRoles([
            'guest',
            'base_user',
        ]);

        $this->adminUser = User::create([
            'email' => 'admin-user@test.com',
            'sub' => 'admin-user@test.com',
        ]);
        $this->adminUser->addRole('platform_admin');

        $this->processOperatorUser = User::factory()
            ->asProcessOperator($this->teamPool->id)
            ->create([
                'email' => 'process-operator-user@test.com',
            ]);

        $this->communityRecruiterUser = User::factory()
            ->asCommunityRecruiter($this->community->id)
            ->create([
                'email' => 'community-recruiter-user@test.com',
            ]);

        $this->communityAdminUser = User::factory()
            ->asCommunityAdmin($this->community->id)
            ->create([
                'email' => 'community-admin-user@test.com',
            ]);

        $this->department = Department::factory()->create();
        $this->toBeDeleted = Department::factory()->create();
    }

    /**
     * Test base user can view any
     *
     * @return void
     */
    public function testViewAnyDepartment()
    {
        $this->actingAs($this->baseUser, 'api')
            ->graphQL('query { departments { id } }')
            ->assertJsonFragment(['id' => $this->department->id]);
    }

    /**
     * Test base user can view any
     *
     * @return void
     */
    public function testViewDepartment()
    {

        $variables = ['id' => $this->department->id];

        $query =
            /** @lang GraphQL */
            '
            query Get($id: UUID!) {
                department(id: $id) {
                    id
                }
            }
        ';

        $this->actingAs($this->baseUser, 'api')
            ->graphQL($query, $variables)
            ->assertJsonFragment($variables);
    }

    /**
     * Only Platform Admin can update
     *
     * @return void
     */
    public function testUpdateDepartment()
    {

        $variables = [
            'id' => $this->department->id,
            'department' => [
                'name' => [
                    'en' => 'New Name (EN)',
                    'fr' => 'New Name (FR)',
                ],
            ],
        ];

        $mutation =
            /** @lang GraphQL */
            '
            mutation UpdateDepartment($id: ID!, $department: UpdateDepartmentInput!) {
                updateDepartment(id: $id, department: $department) {
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
        $this->actingAs($this->processOperatorUser, 'api')
            ->graphQL($mutation, $variables)
            ->assertGraphQLErrorMessage('This action is unauthorized.');
        $this->actingAs($this->communityRecruiterUser, 'api')
            ->graphQL($mutation, $variables)
            ->assertGraphQLErrorMessage('This action is unauthorized.');
        $this->actingAs($this->communityAdminUser, 'api')
            ->graphQL($mutation, $variables)
            ->assertGraphQLErrorMessage('This action is unauthorized.');

        // succeeds
        $this->actingAs($this->adminUser, 'api')
            ->graphQL($mutation, $variables)
            ->assertJsonFragment(['id' => $this->department->id, 'name' => $variables['department']['name']]);
    }

    /**
     * Only Platform Admin can create
     *
     * @return void
     */
    public function testCreateDepartment()
    {
        $variables = [
            'department' => [
                'departmentNumber' => 1,
                'orgIdentifier' => 2,
                'name' => [
                    'en' => 'New Name (EN)',
                    'fr' => 'New Name (FR)',
                ],
                'size' => DepartmentSize::MEDIUM->name,
                'isCorePublicAdministration' => true,
                'isCentralAgency' => true,
                'isRegulatory' => true,
                'isScience' => true,
            ],
        ];

        $mutation =
        <<<'GRAPHQL'
            mutation Create($department: CreateDepartmentInput!) {
                createDepartment(department: $department) {
                    id
                    departmentNumber
                    orgIdentifier
                    name {
                        en
                        fr
                    }
                    isScience
                    size {
                        value
                    }
                }
            }
        GRAPHQL;

        $this->actingAs($this->baseUser, 'api')
            ->graphQL($mutation, $variables)
            ->assertGraphQLErrorMessage('This action is unauthorized.');
        $this->actingAs($this->processOperatorUser, 'api')
            ->graphQL($mutation, $variables)
            ->assertGraphQLErrorMessage('This action is unauthorized.');
        $this->actingAs($this->communityRecruiterUser, 'api')
            ->graphQL($mutation, $variables)
            ->assertGraphQLErrorMessage('This action is unauthorized.');
        $this->actingAs($this->communityAdminUser, 'api')
            ->graphQL($mutation, $variables)
            ->assertGraphQLErrorMessage('This action is unauthorized.');

        // succeeds
        $this->actingAs($this->adminUser, 'api')
            ->graphQL($mutation, $variables)
            ->assertJsonFragment([
                'name' => $variables['department']['name'],
                'departmentNumber' => $variables['department']['departmentNumber'],
                'orgIdentifier' => $variables['department']['orgIdentifier'],
                'isScience' => $variables['department']['isScience'],
                'size' => ['value' => $variables['department']['size']],
            ]);
    }

    /**
     * Only Platform Admin can delete
     *
     * @return void
     */
    public function testDeleteDepartment()
    {
        $variables = ['id' => $this->toBeDeleted->id];

        $mutation =
            /** @lang GraphQL */
            '
            mutation Delete($id: ID!) {
                deleteDepartment(id: $id) {
                    id
                }
            }
        ';

        $this->actingAs($this->baseUser, 'api')
            ->graphQL($mutation, $variables)
            ->assertGraphQLErrorMessage('This action is unauthorized.');
        $this->actingAs($this->processOperatorUser, 'api')
            ->graphQL($mutation, $variables)
            ->assertGraphQLErrorMessage('This action is unauthorized.');
        $this->actingAs($this->communityRecruiterUser, 'api')
            ->graphQL($mutation, $variables)
            ->assertGraphQLErrorMessage('This action is unauthorized.');
        $this->actingAs($this->communityAdminUser, 'api')
            ->graphQL($mutation, $variables)
            ->assertGraphQLErrorMessage('This action is unauthorized.');

        // succeeds
        $this->actingAs($this->adminUser, 'api')
            ->graphQL($mutation, $variables)
            ->assertJsonFragment(['id' => $this->toBeDeleted->id]);
    }

    public function testCanViewPools()
    {
        // a draft pool shouldn't be visible to a regular user
        $draftPool = Pool::factory()
            ->draft()
            ->for($this->adminUser)
            ->for($this->department)
            ->create();

        // a published pool should be visible to a regular user
        $publishedPool = Pool::factory()
            ->published()
            ->for($this->adminUser)
            ->for($this->department)
            ->create();

        $response = $this->actingAs($this->baseUser, 'api')
            ->graphQL(
                /** @lang GraphQL */ '
                query Get($id: UUID!) {
                    department(id: $id) {
                        pools {
                            id
                        }
                    }
                } ', ['id' => $this->department->id]
            );

        $response->assertJsonFragment([
            'pools' => [
                ['id' => $publishedPool->id],
            ],
        ]);

    }
}
