<?php

use App\Models\User;
use App\Models\Role;
use App\Models\Team;
use Database\Helpers\ApiEnums;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Tests\TestCase;

class UserRoleTest extends TestCase
{
    use RefreshDatabase;
    use MakesGraphQLRequests;
    use RefreshesSchemaCache;

    protected $adminUser;
    protected $baseUser;
    protected $baseRoles = [
        "guest",
        "base_user",
        "applicant",
    ];


    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);
        $this->bootRefreshesSchemaCache();

        $this->baseUser = User::factory()->create([
            'email' => 'base-user@test.com',
            'sub' => 'base-user@test.com',
            'legacy_roles' => [ApiEnums::LEGACY_ROLE_APPLICANT]
        ])->syncRoles($this->baseRoles);

        $this->adminUser = User::factory()->create([
            'email' => 'admin-user@test.com',
            'sub' => 'admin-user@test.com',
            'legacy_roles' => [ApiEnums::LEGACY_ROLE_ADMIN]
        ])->syncRoles([
            ...$this->baseRoles,
            "request_responder",
            "platform_admin"
        ]);
    }

    // Create a user added with a test role and team.  Assert that the admin can query the user's role.
    public function testAdminCanSeeUsersRoles()
    {
        $role = Role::factory()->create(['is_team_based' => false]);
        $user = User::create()->syncRoles([$role]);

        $this->actingAs($this->adminUser, "api")->graphQL(
            /** @lang GraphQL */
            '
            query user($id: UUID!) {
                user(id: $id) {
                  roleAssignments {
                    role { name }
                  }
                }
              }
        ',
            ['id' => $user->id]
        )->assertJson([
            'data' => [
                'user' => [
                    'roleAssignments' => [
                        [
                            'role' => [
                                'name' => $role->name,
                            ]
                        ]
                    ]
                ]
            ]
        ]);
    }

    // Create a team with 3 users.  Assert that an admin can query for the team's users.
    public function testAdminCanSeeTeamUsers()
    {
        // Delete pre-existing teams to simplify test
        Team::truncate();
        $role = Role::factory()->create(['is_team_based' => true]);
        $team = Team::factory()->create();
        $users = User::factory()->count(3)
            ->afterCreating(function ($user) use ($role, $team) {
                $user->syncRoles([$role], $team);
            })
            ->create();

        $this->actingAs($this->adminUser, "api")->graphQL(
            /** @lang GraphQL */
            '
            query roles {
                teams {
                  id
                  roleAssignments {
                    user { id }
                  }
                }
              }
        '
        )->assertSimilarJson([
            'data' => [
                'teams' => [[
                    'id' => $team->id,
                    'roleAssignments' =>
                    $users->map(function ($u) {
                        return [
                            'user' => [
                                'id' => $u->id
                            ],
                        ];
                    })->toArray(),
                ],
                // [
                //     'id' => Role::where('name', 'platform_admin')->sole()->id,
                //     'roleAssignments' => [
                //         'user' => ['id' => $this->platformAdmin->id]
                //     ]
                // ]]
            ]]
        ]);
    }

    // Create several users with different roles.  Assert that an admin can see the users in each role.
    public function testAdminCanSeeRoleUsers()
    {
        // Delete most pre-existing roles to simplify test
        Team::where('name', '!=', 'platform_admin')->delete(); // We need to keep the admin role to run the query
        $teamRole = Role::factory()->create(['is_team_based' => true]);
        $team = Team::factory()->create();
        $user = User::factory()
            ->afterCreating(function ($user) use ($teamRole, $team) {
                $user->syncRoles([$teamRole], $team);
            })
            ->create();


        $this->actingAs($this->adminUser, "api")->graphQL(
            /** @lang GraphQL */
            '
            query roles {
                teams {
                  id
                  roleAssignments {
                    user { id }
                  }
                }
              }
        '
        )->assertSimilarJson([
            'data' => [
                'teams' => [[
                    'id' => $team->id,
                    'roleAssignments' =>
                    $users->map(function ($u) {
                        return [
                            'user' => [
                                'id' => $u->id
                            ],
                        ];
                    })->toArray(),
                ],
                // [
                //     'id' => Role::where('name', 'platform_admin')->sole()->id,
                //     'roleAssignments' => [
                //         'user' => ['id' => $this->adminUser->id]
                //     ]
                // ]]
            ]]
        ]);
    }

    // Create a user added with several teams.  Assert that the admin can query the user's teams.
    public function testAdminCanSeeUsersTeams()
    {
        $role = Role::factory()->create(['is_team_based' => true]);
        $teams = Team::factory()->count(3)->create();
        $user = User::factory()->create();

        $teams->each(function ($team) use ($user, $role) {
            $user->syncRoles([$role], $team);
        });

        $this->actingAs($this->adminUser, "api")->graphQL(
            /** @lang GraphQL */
            '
            query user($id: UUID!) {
                user(id: $id) {
                  sub
                  roleAssignments {
                    team { id }
                  }
                }
              }
        ',
            ['id' => $user->id]
        )->assertJsonFragment([
            [
                'user' => [
                    'sub' => $user->sub,
                    'roleAssignments' =>
                    $teams->map(function ($team) {
                        return [
                            'team' => [
                                'id' => $team->id,
                            ]
                        ];
                    })->toArray()
                ]
            ]
        ]);
    }

    // Create a user with an old role.  Assert that the admin can remove the old role and add the new role.
    public function testAdminCanAddAndRemoveNonTeamRoleToUser()
    {
        $oldRole = Role::factory()->create(['is_team_based' => false]);
        $newRole = Role::factory()->create(['is_team_based' => false]);
        $user = User::factory()->create()->syncRoles([$oldRole]);

        $this->actingAs($this->adminUser, "api")->graphQL(
            /** @lang GraphQL */
            '
            mutation updateUserAsAdmin($id:ID!, $user:UpdateUserAsAdminInput!) {
                updateUserAsAdmin(id:$id, user:$user) {
                  roleAssignments {
                    role { id }
                  }
                }
              }
        ',
            [
                'id' => $user->id,
                'user' => [
                    'roles' => [
                        'attach' =>  [
                            'roles' => [$newRole->id],
                        ],
                        'detach' => [
                            'roles' => [$oldRole->id]
                        ]
                    ]
                ]
            ]
        )->assertJson([
            'data' => [
                'updateUserAsAdmin' => [
                    'roleAssignments' => [
                        [
                            'role' =>  ['id' => $newRole->id]
                        ]
                    ]
                ]
            ]
        ]);
    }

    // Create a user with an old role.  Assert that the admin can remove the old role and add the new role, now with teams!
    public function testAdminCanAddAndRemoveTeamRoleToUser()
    {
        $oldRole = Role::factory()->create(['is_team_based' => true]);
        $newRole = Role::factory()->create(['is_team_based' => true]);
        $oldTeam = Team::factory()->create();
        $newTeam = Team::factory()->create();
        $user = User::factory()->create()->syncRoles([$oldRole], $oldTeam);

        $this->actingAs($this->adminUser, "api")->graphQL(
            /** @lang GraphQL */
            '
                mutation updateUserAsAdmin($id:ID!, $user:UpdateUserAsAdminInput!) {
                    updateUserAsAdmin(id:$id, user:$user) {
                      roleAssignments {
                        role { id }
                        team { id }
                      }
                    }
                  }
            ',
            [
                'id' => $user->id,
                'user' => [
                    'roles' => [
                        'attach' =>  [
                            'roles' => [$newRole->id],
                            'team' => $newTeam->id
                        ],
                        'detach' => [
                            'roles' => [$oldRole->id],
                            'team' => $oldTeam->id
                        ]
                    ]
                ]
            ]
        )->assertJson([
            'data' => [
                'updateUserAsAdmin' => [
                    'roleAssignments' => [
                        [
                            'role' =>  ['id' => $newRole->id],
                            'team' => ['id' => $newTeam->id]
                        ]
                    ]
                ]
            ]
        ]);
    }

    // Create a user and attempt to add a non-team role with a team.  Assert that validation fails.
    public function testAdminCannotAddNonTeamRoleWithATeam()
    {
        $role = Role::factory()->create(['is_team_based' => false]);
        $team = Team::factory()->create();
        $user = User::factory()->create();

        $this->actingAs($this->adminUser, "api")->graphQL(
            /** @lang GraphQL */
            '
                 mutation updateUserAsAdmin($id:ID!, $user:UpdateUserAsAdminInput!) {
                     updateUserAsAdmin(id:$id, user:$user) {
                       roleAssignments {
                         role { id }
                         team { id }
                       }
                     }
                   }
             ',
            [
                'id' => $user->id,
                'user' => [
                    'roles' => [
                        'attach' =>  [
                            'roles' => [$role->id],
                            'team' => $team->id
                        ]
                    ]
                ]
            ]
        )->assertJson([
            'errors' =>  [
                ['message' => "Validation failed for the field [updateUserAsAdmin]."]
            ]
        ]);
    }

    // Create a user and attempt to add a team role without a team.  Assert that validation fails.
    public function testAdminCannotAddTeamRoleWithoutATeam()
    {
        $role = Role::factory()->create(['is_team_based' => true]);
        $user = User::factory()->create();

        $this->actingAs($this->adminUser, "api")->graphQL(
            /** @lang GraphQL */
            '
                    mutation updateUserAsAdmin($id:ID!, $user:UpdateUserAsAdminInput!) {
                        updateUserAsAdmin(id:$id, user:$user) {
                          roleAssignments {
                            role { id }
                            team { id }
                          }
                        }
                      }
                ',
            [
                'id' => $user->id,
                'user' => [
                    'roles' => [
                        'attach' =>  [
                            'roles' => [$role->id]
                        ]
                    ]
                ]
            ]
        )->assertJson([
            'errors' =>  [
                ['message' => "Validation failed for the field [updateUserAsAdmin]."]
            ]
        ]);
    }

    // Create two applicant users.  Assert that one of them cannot query the other's data.
    public function testApplicantCannotQueryAnother()
    {
        $users = User::factory()->count(2)->afterCreating(function ($user) {
            $user->syncRoles($this->baseRoles);
        })->create();

        $this->actingAs($users[0], 'api')->graphQL(
            /** @lang GraphQL */
            '
            query user($id: UUID!) {
                user(id: $id) {
                  roleAssignments {
                    role { name }
                  }
                }
              }
            ',
            ['id' => $users[1]->id]
        )->assertJson([
            'errors' =>  [
                ['message' => "This action is unauthorized."]
            ]
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
            [ "id" => $role->id ]
        ]);
    }

    // Create an applicant user.  Assert that they cannot query the teams.
    public function testApplicantCannotQueryTeams()
    {
        $this->actingAs($this->baseUser, 'api')->graphQL(
            /** @lang GraphQL */
            '
                query teams {
                    teams {
                      id
                    }
                  }
            '
        )->assertGraphQLErrorMessage('This action is unauthorized.');
    }

    // Create an applicant user.  Assert that they cannot perform and roles-and-teams mutation.
    public function testApplicantCannotMutateRolesAndTeams()
    {
        $oldRole = Role::factory()->create(['is_team_based' => true]);
        $newRole = Role::factory()->create(['is_team_based' => true]);
        $oldTeam = Team::factory()->create();
        $newTeam = Team::factory()->create();
        $otherUser = User::factory()->create()->syncRoles([$oldRole], $oldTeam);

        $this->actingAs($this->baseUser, 'api')->graphQL(
            /** @lang GraphQL */
            '
                 mutation updateUserAsAdmin($id:ID!, $user:UpdateUserAsAdminInput!) {
                     updateUserAsAdmin(id:$id, user:$user) {
                       roleAssignments {
                         role { id }
                         team { id }
                       }
                     }
                   }
             ',
            [
                'id' => $otherUser->id,
                'user' => [
                    'roles' => [
                        'attach' =>  [
                            'roles' => [$newRole->id],
                            'team' => $newTeam->id
                        ],
                        'detach' => [
                            'roles' => [$oldRole->id],
                            'team' => $oldTeam->id
                        ]
                    ]
                ]
            ]
        )->assertGraphQLErrorMessage('This action is unauthorized.');
    }
}
