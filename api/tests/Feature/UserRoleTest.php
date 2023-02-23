<?php

use App\Models\User;
use App\Models\Role;
use App\Models\Team;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Tests\TestCase;

class UserRoleTest extends TestCase
{
    use RefreshDatabase;
    use MakesGraphQLRequests;
    use RefreshesSchemaCache;

    protected function setUp(): void
    {
        parent::setUp();
        $this->bootRefreshesSchemaCache();

        // Create admin user we run tests as
        // Note: this extra user does change the results of a couple queries
        $newUser = new User;
        $newUser->email = 'admin@test.com';
        $newUser->sub = 'admin@test.com';
        $newUser->legacy_roles = ['ADMIN'];
        $newUser->save();
    }

    // Create a user added with a test role and team.  Assert that the admin can query the user's role.
    public function testAdminCanSeeUsersRoles()
    {
        $role = Role::factory()->create(['is_team_based' => false]);
        $user = User::create()->syncRoles([$role]);

        $this->graphQL(
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
        $role = Role::factory()->create(['is_team_based' => true]);
        $team = Team::factory()->create();
        $users = User::factory()->count(3)
            ->afterCreating(function ($user) use ($role, $team) {
                $user->syncRoles([$role], $team);
            })
            ->create();

        $this->graphQL(
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
        )->assertSimilarJson([
            'data' => [
                'roles' => [[
                    'id' => $role->id,
                    'roleAssignments' =>
                    $users->map(function ($u) {
                        return [
                            'user' => [
                                'id' => $u->id
                            ],
                        ];
                    })->toArray()
                ]]
            ]
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

        $this->graphQL(
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
        )->assertSimilarJson([
            'data' => [
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

        $this->graphQL(
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

        $this->graphQL(
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

         $this->graphQL(
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

            $this->graphQL(
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
        $users = User::factory()->count(2)->create(['legacy_roles' => ['APPLICANT']]);

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

    // Create an applicant user.  Assert that they cannot query the roles.
    public function testApplicantCannotQueryRoles()
    {
        $user = User::factory()->create(['legacy_roles' => ['APPLICANT']]);

        $this->actingAs($user, 'api')->graphQL(
            /** @lang GraphQL */
            '
               query roles {
                   roles {
                     id
                   }
                 }
           '
        )->assertJson([
            'errors' =>  [
                ['message' => "This action is unauthorized."]
            ]
        ]);
    }

    // Create an applicant user.  Assert that they cannot query the teams.
    public function testApplicantCannotQueryTeams()
    {
        $user = User::factory()->create(['legacy_roles' => ['APPLICANT']]);

        $this->actingAs($user, 'api')->graphQL(
            /** @lang GraphQL */
            '
                query teams {
                    teams {
                      id
                    }
                  }
            '
        )->assertJson([
            'errors' =>  [
                ['message' => "This action is unauthorized."]
            ]
        ]);
    }

    // Create an applicant user.  Assert that they cannot perform and roles-and-teams mutation.
    public function testApplicantCannotMutateRolesAndTeams()
    {
        $applicant = User::factory()->create(['legacy_roles' => ['APPLICANT']]);

        $oldRole = Role::factory()->create(['is_team_based' => true]);
        $newRole = Role::factory()->create(['is_team_based' => true]);
        $oldTeam = Team::factory()->create();
        $newTeam = Team::factory()->create();
        $otherUser = User::factory()->create()->syncRoles([$oldRole], $oldTeam);

        $this->actingAs($applicant, 'api')->graphQL(
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
        )->assertJson([
            'errors' =>  [
                ['message' => "This action is unauthorized."]
            ]
        ]);
    }
}
