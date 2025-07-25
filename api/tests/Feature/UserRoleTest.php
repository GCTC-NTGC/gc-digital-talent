<?php

namespace Tests\Feature;

use App\Models\Community;
use App\Models\Role;
use App\Models\Team;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Testing\Fluent\AssertableJson;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Tests\TestCase;
use Tests\UsesProtectedGraphqlEndpoint;

class UserRoleTest extends TestCase
{
    use MakesGraphQLRequests;
    use RefreshDatabase;
    use RefreshesSchemaCache;
    use UsesProtectedGraphqlEndpoint;

    protected $adminUser;

    protected $baseUser;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);
        $this->bootRefreshesSchemaCache();

        $this->baseUser = User::factory()
            ->asApplicant()
            ->create([
                'email' => 'base-user@test.com',
                'sub' => 'base-user@test.com',
            ]);

        $this->adminUser = User::factory()
            ->asApplicant()
            ->asAdmin()
            ->create([
                'email' => 'admin-user@test.com',
                'sub' => 'admin-user@test.com',
            ]);
    }

    // Create a user added with a test role and team.  Assert that the admin can query the user's role.
    public function testAdminCanSeeUsersRoles()
    {
        $role = Role::factory()->create(['is_team_based' => false]);
        $user = User::create()->syncRoles([$role]);

        $this->actingAs($this->adminUser, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query user($id: UUID!) {
                user(id: $id) {
                    authInfo {
                        roleAssignments {
                            role { name }
                        }
                    }
                }
              }
        ',
            ['id' => $user->id]
        )->assertJson([
            'data' => [
                'user' => [
                    'authInfo' => [
                        'roleAssignments' => [
                            [
                                'role' => [
                                    'name' => $role->name,
                                ],
                            ],
                        ],
                    ],
                ],
            ],
        ]);
    }

    // Create several users with different roles.  Assert that an admin can see the users in each role.
    public function testAdminCanSeeRoleUsers()
    {
        $platformAdminRole = Role::where('name', 'platform_admin')->sole();
        $baseRole = Role::where('name', 'base_user')->sole();
        $roleCount = Role::count();

        $this->actingAs($this->adminUser, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query roles {
                roles {
                  id
                  roleAssignments {
                    user { id }
                  }
                }
              }
        '
        )->assertJson(
            fn (AssertableJson $json) => $json->has('data.roles', $roleCount) // Returns all the roles
        )->assertJsonFragment(
            [
                'id' => $platformAdminRole->id, // Check that platform_admin role has one user
                'roleAssignments' => [[
                    'user' => [
                        'id' => $this->adminUser->id,
                    ],
                ]],
            ],
        )->assertJsonFragment(
            [
                'id' => $baseRole->id, // Check that base_role has two users.
                'roleAssignments' => [[
                    'user' => [
                        'id' => $this->baseUser->id,
                    ],
                    'user' => [
                        'id' => $this->adminUser->id,
                    ],
                ]],
            ]
        );
    }

    // Create a user added with several teams.  Assert that the admin can query the user's teams.
    public function testAdminCanSeeUsersTeams()
    {
        $role = Role::factory()->create(['is_team_based' => true]);
        $communities = Community::factory()->count(3)->create();
        $user = User::factory()->create();

        $communities->each(function ($community) use ($user, $role) {
            $user->syncRoles([$role], $community->team);
        });

        $this->actingAs($this->adminUser, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query user($id: UUID!) {
                user(id: $id) {
                  authInfo {
                    sub
                    roleAssignments {
                        team { id }
                    }
                }
                }
              }
        ',
            ['id' => $user->id]
        )->assertJsonFragment($communities->flatMap(function ($community) {
            return [
                'team' => [
                    'id' => $community->team->id,
                ],
            ];
        })->toArray());
    }

    // Create a user with an old role.  Assert that the admin can remove the old role and add the new role.
    public function testAdminCanAddAndRemoveNonTeamRoleToUser()
    {
        $oldRole = Role::where('name', 'guest')->sole();
        $newRole = Role::where('name', 'base_user')->sole();
        $user = User::factory()->create()->syncRoles([$oldRole]);

        $this->actingAs($this->adminUser, 'api')->graphQL(
            /** @lang GraphQL */
            '
            mutation updateUserRoles($updateUserRolesInput:UpdateUserRolesInput!) {
                updateUserRoles(updateUserRolesInput:$updateUserRolesInput) {
                    roleAssignments {
                        role { id }
                    }
                }
              }
        ',
            [
                'updateUserRolesInput' => [
                    'userId' => $user->id,
                    'roleAssignmentsInput' => [
                        'attach' => [
                            ['roleId' => $newRole->id],
                        ],
                        'detach' => [
                            ['roleId' => $oldRole->id],
                        ],
                    ],
                ],
            ]
        )->assertJson([
            'data' => [
                'updateUserRoles' => [
                    'roleAssignments' => [
                        [
                            'role' => ['id' => $newRole->id],
                        ],
                    ],
                ],
            ],
        ]);
    }

    // Create a user with an old role.  Assert that the admin can remove the old role and add the new role, now with teams!
    public function testAdminCanAddAndRemoveTeamRoleToUser()
    {
        $oldRole = Role::where('name', 'process_operator')->sole();
        $newRole = Role::where('name', 'process_operator')->sole();
        $oldCommunity = Community::factory()->create();
        $newCommunity = Community::factory()->create();
        $user = User::factory()->create()->syncRoles([$oldRole], $oldCommunity->team);

        $this->actingAs($this->adminUser, 'api')->graphQL(
            /** @lang GraphQL */
            '
            mutation updateUserRoles($updateUserRolesInput:UpdateUserRolesInput!) {
                updateUserRoles(updateUserRolesInput:$updateUserRolesInput) {
                    roleAssignments {
                        role { id }
                        team { id }
                    }
                }
                }
            ',
            [
                'updateUserRolesInput' => [
                    'userId' => $user->id,
                    'roleAssignmentsInput' => [
                        'attach' => [
                            [
                                'roleId' => $newRole->id,
                                'teamId' => $newCommunity->team->id,
                            ],
                        ],
                        'detach' => [
                            [
                                'roleId' => $oldRole->id,
                                'teamId' => $oldCommunity->team->id,
                            ],
                        ],
                    ],
                ],
            ]
        )->assertJsonFragment([
            [
                'role' => ['id' => $newRole->id],
                'team' => ['id' => $newCommunity->team->id],
            ],
        ]);
    }

    // Create a user and attempt to add a non-team role with a team. Assert that validation fails.
    public function testAdminCannotAddNonTeamRoleWithATeam()
    {
        $role = Role::factory()->create(['is_team_based' => false]);
        $community = Community::factory()->create();
        $user = User::factory()->create();

        $this->actingAs($this->adminUser, 'api')->graphQL(
            /** @lang GraphQL */
            '
            mutation updateUserRoles($updateUserRolesInput:UpdateUserRolesInput!) {
                updateUserRoles(updateUserRolesInput:$updateUserRolesInput) {
                    roleAssignments {
                        role { id }
                        team { id }
                    }
                }
                }
            ',
            [
                'updateUserRolesInput' => [
                    'userId' => $user->id,
                    'roleAssignmentsInput' => [
                        'attach' => [
                            [
                                'roleId' => $role->id,
                                'teamId' => $community->team->id,
                            ],
                        ],
                    ],
                ],
            ]
        )->assertJson([
            'errors' => [
                ['message' => 'Validation failed for the field [updateUserRoles].'],
            ],
        ]);
    }

    // Create a user and attempt to add a team role without a team. Assert that validation fails.
    public function testAdminCannotAddTeamRoleWithoutATeam()
    {
        $role = Role::factory()->create(['is_team_based' => true]);
        $user = User::factory()->create();

        $this->actingAs($this->adminUser, 'api')->graphQL(
            /** @lang GraphQL */
            '
            mutation updateUserRoles($updateUserRolesInput:UpdateUserRolesInput!) {
                updateUserRoles(updateUserRolesInput:$updateUserRolesInput) {
                    roleAssignments {
                        role { id }
                        team { id }
                    }
                }
                }
            ',
            [
                'updateUserRolesInput' => [
                    'userId' => $user->id,
                    'roleAssignmentsInput' => [
                        'attach' => [
                            [
                                'roleId' => $role->id,
                            ],
                        ],
                    ],
                ],
            ]
        )->assertJson([
            'errors' => [
                ['message' => 'Validation failed for the field [updateUserRoles].'],
            ],
        ]);
    }

    // Create two applicant users.  Assert that one of them cannot query the other's data.
    public function testApplicantCannotQueryAnother()
    {
        $users = User::factory()->count(2)->asApplicant()->create();

        $this->actingAs($users[0], 'api')->graphQL(
            /** @lang GraphQL */
            '
            query user($id: UUID!) {
                user(id: $id) {
                    authInfo {
                        roleAssignments {
                            role { name }
                        }
                    }
              }
            }
            ',
            ['id' => $users[1]->id]
        )->assertJson([
            'errors' => [
                ['message' => 'This action is unauthorized.'],
            ],
        ]);
    }

    // Create an applicant user.  Assert that they can query the roles.
    public function testApplicantCanQueryRoles()
    {
        $role = Role::inRandomOrder()->first();
        $this->actingAs($this->baseUser, 'api')->graphQL(
            /** @lang GraphQL */
            '
               query roles {
                   roles {
                     id
                   }
                 }
           '
        )->assertJsonFragment([
            ['id' => $role->id],
        ]);
    }

    // Create an applicant user. Assert that they cannot perform and roles-and-teams mutation.
    public function testApplicantCannotMutateRolesAndTeams()
    {
        $oldRole = Role::factory()->create(['is_team_based' => true]);
        $newRole = Role::factory()->create(['is_team_based' => true]);
        $oldCommunity = Community::factory()->create();
        $newCommunity = Community::factory()->create();
        $otherUser = User::factory()->create()->syncRoles([$oldRole], $oldCommunity);

        $this->actingAs($this->baseUser, 'api')->graphQL(
            /** @lang GraphQL */
            '
            mutation updateUserRoles($updateUserRolesInput:UpdateUserRolesInput!) {
                updateUserRoles(updateUserRolesInput:$updateUserRolesInput) {
                    roleAssignments {
                        role { id }
                        team { id }
                    }
                }
                }
            ',
            [
                'updateUserRolesInput' => [
                    'userId' => $otherUser->id,
                    'roleAssignmentsInput' => [
                        'attach' => [
                            [
                                'roleId' => $newRole->id,
                                'teamId' => $newCommunity->team->id,
                            ],
                        ],
                        'detach' => [
                            [
                                'roleId' => $oldRole->id,
                                'teamId' => $oldCommunity->team->id,
                            ],
                        ],
                    ],
                ],
            ]
        )->assertGraphQLErrorMessage('This action is unauthorized.');
    }

    // Create an applicant user. Assert that they cannot edit their own roles.
    public function testApplicantCannotMutateOwnRoles()
    {
        $oldRole = Role::factory()->create(['is_team_based' => true]);
        $newRole = Role::factory()->create(['is_team_based' => true]);
        $oldCommunity = Community::factory()->create();
        $newCommunity = Community::factory()->create();

        $this->actingAs($this->baseUser, 'api')->graphQL(
            /** @lang GraphQL */
            '
            mutation updateUserRoles($updateUserRolesInput:UpdateUserRolesInput!) {
                updateUserRoles(updateUserRolesInput:$updateUserRolesInput) {
                    roleAssignments {
                        role { id }
                        team { id }
                    }
                }
                }
            ',
            [
                'updateUserRolesInput' => [
                    'userId' => $this->baseUser->id,
                    'roleAssignmentsInput' => [
                        'attach' => [
                            [
                                'roleId' => $newRole->id,
                                'teamId' => $newCommunity->team->id,
                            ],
                        ],
                        'detach' => [
                            [
                                'roleId' => $oldRole->id,
                                'teamId' => $newCommunity->team->id,
                            ],
                        ],
                    ],
                ],
            ]
        )->assertGraphQLErrorMessage('This action is unauthorized.');
    }
}
