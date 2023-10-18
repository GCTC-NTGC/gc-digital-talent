<?php

use App\Enums\Role as EnumsRole;
use App\Models\Role;
use App\Models\Team;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Tests\TestCase;

class UpdateUserTeamRolesTest extends TestCase
{
    use MakesGraphQLRequests;
    use RefreshDatabase;
    use RefreshesSchemaCache;

    protected $adminUser;
    protected $applicant;
    protected $team;
    protected $poolOperatorId;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);
        $this->bootRefreshesSchemaCache();

        $this->applicant = User::factory()
            ->asApplicant()
            ->create([
                'email' => 'applicant-user@test.com',
                'sub' => 'applicant-user@test.com',
            ]);

        $this->adminUser = User::factory()
            ->asApplicant()
            ->asRequestResponder()
            ->asAdmin()
            ->create([
                'email' => 'admin-user@test.com',
                'sub' => 'admin-user@test.com',
            ]);

        $this->team = Team::factory()->create();

        $this->poolOperatorId = Role::where('name', EnumsRole::POOL_OPERATOR)->first()->id;
    }

    public function testAdminCanAttachUserToTeam()
    {
        $this->actingAs($this->adminUser, 'api')->graphQL(
            /** @lang GraphQL */
            '
            mutation updateUserTeamRoles($teamRoleAssignments: UpdateUserTeamRolesInput!) {
                updateUserTeamRoles(teamRoleAssignments: $teamRoleAssignments) {
                    id
                }
              }
        ',
            [

                'teamRoleAssignments' => [
                    'teamId' => $this->team->id,
                    'userId' => $this->applicant->id,
                    'roleAssignments' => [
                        'attach' => [
                            'roles' => [$this->poolOperatorId]
                        ]
                    ]
                ]
            ]
        );

        $this->assertTrue($this->applicant->hasRole(EnumsRole::POOL_OPERATOR, $this->team));
    }

    public function testAdminCanDetachUserFromTeam()
    {
        $this->applicant->addRole(EnumsRole::POOL_OPERATOR, $this->team);
        $this->actingAs($this->adminUser, 'api')->graphQL(
            /** @lang GraphQL */
            '
            mutation updateUserTeamRoles($teamRoleAssignments: UpdateUserTeamRolesInput!) {
                updateUserTeamRoles(teamRoleAssignments: $teamRoleAssignments) {
                    id
                }
              }
        ',
            [

                'teamRoleAssignments' => [
                    'teamId' => $this->team->id,
                    'userId' => $this->applicant->id,
                    'roleAssignments' => [
                        'detach' => [
                            'roles' => [$this->poolOperatorId]
                        ]
                    ]
                ]
            ]
        );
        $this->assertFalse($this->applicant->hasRole(EnumsRole::POOL_OPERATOR, $this->team));
    }

    public function testAdminCanSyncUserToAndFromTeam()
    {
        $this->actingAs($this->adminUser, 'api')->graphQL(
            /** @lang GraphQL */
            '
            mutation updateUserTeamRoles($teamRoleAssignments: UpdateUserTeamRolesInput!) {
                updateUserTeamRoles(teamRoleAssignments: $teamRoleAssignments) {
                    id
                }
              }
        ',
            [

                'teamRoleAssignments' => [
                    'teamId' => $this->team->id,
                    'userId' => $this->applicant->id,
                    'roleAssignments' => [
                        'sync' => [
                            'roles' => [$this->poolOperatorId]
                        ]
                    ]
                ]
            ]
        );
        $this->assertTrue($this->applicant->hasRole(EnumsRole::POOL_OPERATOR, $this->team));

        $this->actingAs($this->adminUser, 'api')->graphQL(
            /** @lang GraphQL */
            '
            mutation updateUserTeamRoles($teamRoleAssignments: UpdateUserTeamRolesInput!) {
                updateUserTeamRoles(teamRoleAssignments: $teamRoleAssignments) {
                    id
                }
              }
        ',
            [

                'teamRoleAssignments' => [
                    'teamId' => $this->team->id,
                    'userId' => $this->applicant->id,
                    'roleAssignments' => [
                        'sync' => [
                            'roles' => []
                        ]
                    ]
                ]
            ]
        );
        $this->assertFalse($this->applicant->hasRole(EnumsRole::POOL_OPERATOR, $this->team));
    }

    // Create several users with different roles.  Assert that an admin can see the users in each role.
    public function testAllTeamMembersCanBeReadFromResponse()
    {
        $otherUser = User::factory()->asPoolOperator($this->team->name)->create();
        $this->actingAs($this->adminUser, 'api')->graphQL(
            /** @lang GraphQL */
            '
            mutation updateUserTeamRoles($teamRoleAssignments: UpdateUserTeamRolesInput!) {
                updateUserTeamRoles(teamRoleAssignments: $teamRoleAssignments) {
                  id
                  roleAssignments {
                    role { name }
                    user { id }
                  }
                }
              }
        ',
            [

                'teamRoleAssignments' => [
                    'teamId' => $this->team->id,
                    'userId' => $this->applicant->id,
                    'roleAssignments' => [
                        'attach' => [
                            'roles' => [$this->poolOperatorId]
                        ]
                    ]
                ]
            ]
        )->assertJson([
            'data' => [
                'updateUserTeamRoles' => [
                    'id' => $this->team->id,
                    'roleAssignments' => [
                        [

                            'role' => [
                                'name' => EnumsRole::POOL_OPERATOR->value
                            ],
                            'user' => [
                                'id' => $otherUser->id
                            ],
                        ],
                        [
                            'role' => [
                                'name' => EnumsRole::POOL_OPERATOR->value
                            ],
                            'user' => [
                                'id' => $this->applicant->id
                            ],
                        ],
                    ],
                ],
            ],
        ]);
    }

    public function testOnlyAdminsAndCommunityManagersHavePermissionEvenToEditSelf()
    {
        $permissionsMap = [
            EnumsRole::BASE_USER->value => false,
            EnumsRole::APPLICANT->value => false,
            EnumsRole::POOL_OPERATOR->value => false,
            EnumsRole::REQUEST_RESPONDER->value => false,
            EnumsRole::COMMUNITY_MANAGER->value => true,
            EnumsRole::PLATFORM_ADMIN->value => true,
        ];
        foreach ($permissionsMap as $role => $hasPermission) {
            $user = User::factory()->create();
            $user->addRole($role);
            $response = $this->actingAs($user, 'api')->graphQL(
                /** @lang GraphQL */
                '
                mutation updateUserTeamRoles($teamRoleAssignments: UpdateUserTeamRolesInput!) {
                    updateUserTeamRoles(teamRoleAssignments: $teamRoleAssignments) {
                      id
                    }
                  }
            ',
                [
                    'teamRoleAssignments' => [
                        'teamId' => $this->team->id,
                        'userId' => $user->id,
                        'roleAssignments' => [
                            'attach' => [
                                'roles' => [$this->poolOperatorId]
                            ]
                        ]
                    ]
                ]
            );
            if ($hasPermission) {
                $response->assertGraphQLErrorFree();
            } else {
                $response->assertGraphQLErrorMessage('This action is unauthorized.');
            }
        }
    }
}
