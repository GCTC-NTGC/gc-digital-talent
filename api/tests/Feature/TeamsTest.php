<?php

use Illuminate\Foundation\Testing\WithFaker;
use App\Models\Department;
use App\Models\User;
use App\Models\Team;
use Database\Seeders\DepartmentSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Tests\TestCase;

use function PHPUnit\Framework\assertEquals;

class TeamsTest extends TestCase
{
  use RefreshDatabase;
  use MakesGraphQLRequests;
  use RefreshesSchemaCache;
  use WithFaker;

  protected $admin;
  protected $poolOperator1;
  protected $poolOperator2;
  protected $poolOperator3;
  protected $team1;
  protected $team2;
  protected $team3;
  protected $toBeDeletedUUID;

  protected function setUp(): void
  {
    parent::setUp();
    $this->seed(RolePermissionSeeder::class);
    $this->setUpFaker();
    $this->bootRefreshesSchemaCache();

    Team::truncate(); // clear teams created in migrations before testing

    // Create users
    $this->admin = User::factory()->create([
      'email' => 'admin-user@test.com',
      'sub' => 'admin-user@test.com',
    ])->syncRoles([
      "guest",
      "base_user",
      "applicant",
      "request_responder",
      "platform_admin",
    ]);

    $this->poolOperator1 = User::factory()->create([
      'email' => 'poolOperator1@test.com',
      'sub' => 'poolOperator1@test.com',
    ])->syncRoles([ "guest", "base_user" ]);

    $this->poolOperator2 = User::factory()->create([
      'email' => 'poolOperator2@test.com',
      'sub' => 'poolOperator2@test.com',
    ])->syncRoles([ "guest", "base_user" ]);

    $this->poolOperator3 = User::factory()->create([
      'email' => 'poolOperator3@test.com',
      'sub' => 'poolOperator3@test.com',
    ])->syncRoles([ "guest", "base_user" ]);


    // Create teams
    $this->seed(DepartmentSeeder::class);
    $this->toBeDeletedUUID = $this->faker->UUID();

    $this->team1 = Team::factory()->create(['name' => 'team1']);
    $this->team2 = Team::factory()->create(['name' => 'team2']);
    $this->team3 = Team::factory()->create([
      'id' => $this->toBeDeletedUUID, // Need specific ID for delete team testing
      'name' => 'team3',
    ]);

    // Attach pool operator users to teams.
    $this->poolOperator1->attachRole("pool_operator", $this->team1);
    $this->poolOperator2->attachRole("pool_operator", $this->team2);
  }

  public function testAllTeamsQuery(): void
  {
    // Assert all teams query contains expected results
    $query = $this->actingAs($this->admin, "api")
      ->graphQL(/** @lang GraphQL */ '
      query teams {
          teams {
              id
              name
              departments {
                id
              }
          }
      }
    ');
    $data = $query->original['data'];

    // assert the teams returned is an array of exactly three items
    $teamsArrayCount = count($data['teams']);
    assertEquals($teamsArrayCount, 3);

    // assert every team created is present in the response
    $query->assertJsonFragment(['id' => $this->team1->id]);
    $query->assertJsonFragment(['id' => $this->team2->id]);
    $query->assertJsonFragment(['id' => $this->team3->id]);

    // assert a team has two departments connected to it
    // this is a factory configuration
    $team0Departments = $data['teams'][0]['departments'];
    $team0DepartmentCount = count($team0Departments);
    assertEquals($team0DepartmentCount, 2);
  }

  public function testTeamCreationMutation(): void
  {
    $this->seed(DepartmentSeeder::class);
    $departmentId = Department::inRandomOrder()->first()->id;

    // Assert null name causes failure
    $this->actingAs($this->admin, "api")->graphQL(
      /** @lang GraphQL */
      '
      mutation createTeam($team: CreateTeamInput!) {
          createTeam(team: $team) {
            name
          }
      }
    ',
      [
          'team' => [
            'name'=> null,
          ]
      ]
    )->assertJsonFragment([
        "message" => "Variable \"\$team\" got invalid value {\"name\":null}; Expected non-nullable type String! not to be null at value.name."
      ]
    );

    // Assert team creation successful across all input fields
    $this->actingAs($this->admin, "api")->graphQL(
      /** @lang GraphQL */
      '
      mutation createTeam($team: CreateTeamInput!) {
          createTeam(team: $team) {
            name
            displayName {
              en
              fr
            }
            description {
              en
              fr
            }
            contactEmail
            departments {
              id
            }
          }
      }
    ',
      [
          'team' => [
            'name'=> 'team one',
            'displayName' => [
              'en' => 'en',
              'fr' => 'fr',
            ],
            'description' => [
              'en' => 'en',
              'fr' => 'fr',
            ],
            'contactEmail' => 'test@test.com',
            'departments' => [
              "sync" => [$departmentId],
            ],
          ]
      ]
    )->assertJson([
      'data' => [
        'createTeam' => [
            'name' => 'team one',
            'displayName' => [
              'en' => 'en',
              'fr' => 'fr',
            ],
            'description' => [
              'en' => 'en',
              'fr' => 'fr',
            ],
            'contactEmail' => 'test@test.com',
            'departments' => [
              [
                'id' => $departmentId,
              ]
            ],
        ]
    ]
      ]
    );

    // Assert creating a second team with the same name fails
    $this->actingAs($this->admin, "api")->graphQL(
      /** @lang GraphQL */
      '
      mutation createTeam($team: CreateTeamInput!) {
          createTeam(team: $team) {
            name
          }
      }
    ',
      [
          'team' => [
            'name'=> 'team one',
          ]
      ]
    )->assertJsonFragment([
        "createTeam" => null,
      ]
    );
  }

  public function testTeamUpdateMutation(): void
  {
    $this->seed(DepartmentSeeder::class);
    $departmentId = Department::inRandomOrder()->first()->id;

    // Assert team update successful across all input fields
    $this->actingAs($this->admin, "api")->graphQL(
      /** @lang GraphQL */
      '
      mutation updateTeam($id: UUID!, $team: UpdateTeamInput!) {
          updateTeam(id: $id, team: $team) {
            name
            displayName {
              en
              fr
            }
            description {
              en
              fr
            }
            contactEmail
            departments {
              id
            }
          }
      }
      ',
      [
        'id' => $this->team1->id,
        'team' => [
          'name'=> 'new_team_name',
          'displayName' => [
            'en' => 'New Team Name EN',
            'fr' => 'New Team Name FR',
          ],
          'description' => [
            'en' => 'New Team Description EN',
            'fr' => 'New Team Description FR',
          ],
          'contactEmail' => 'newContactEmail@test.com',
          'departments' => [
            'sync' => [$departmentId],
          ],
        ]
      ]
    )->assertJson([
      'data' => [
        'updateTeam' => [
          'name'=> 'new_team_name',
          'displayName' => [
            'en' => 'New Team Name EN',
            'fr' => 'New Team Name FR',
          ],
          'description' => [
            'en' => 'New Team Description EN',
            'fr' => 'New Team Description FR',
          ],
          'contactEmail' => 'newContactEmail@test.com',
          'departments' => [
            ['id' => $departmentId],
          ],
        ]
      ]
    ]);
  }

  public function testTeamDeleteMutation(): void
  {
    // Detach departments before deleting team
    $this->team3->departments()->detach();

    // Assert team update successful across all input fields
    $this->actingAs($this->admin, "api")->graphQL(
      /** @lang GraphQL */
      '
      mutation deleteTeam($id: UUID!) {
          deleteTeam(id: $id) {
            id
          }
      }
      ',
      [ 'id' => $this->toBeDeletedUUID, ]
    )->assertJson([
      'data' => [
        'deleteTeam' => [
          'id' => $this->toBeDeletedUUID,
        ],
      ]
    ]);
  }

  public function testViewTeamMembers(): void
  {
    $this->poolOperator1->attachRole("pool_operator", $this->team1);
    $this->poolOperator2->attachRole("pool_operator", $this->team1);
    $this->poolOperator3->attachRole("pool_operator", $this->team2);
    $viewAnyTeamMembers = /** @lang GraphQL */ '
        query team($id: UUID!) {
          team(id: $id) {
              id
              roleAssignments {
                id
                user {
                  id
                }
              }
          }
        }
    ';

    $variables = [ 'id' => $this->team1->id ];

    // Assert user with role admin can query any team members, regardless of being on the team.
    $query = $this->actingAs($this->admin, "api")
                  ->graphQL($viewAnyTeamMembers, $variables)
                  ->assertJsonFragment([
                    'id' => $this->poolOperator1->id,
                    'id' => $this->poolOperator2->id
                  ]);

    // assert pool operator three is not present in the response
    $query->assertJsonMissing(['id' => $this->poolOperator3->id]);

    // assert the teams returned is an array of exactly two items
    $data = $query->original['data'];
    $teamMembersCount = count($data['team']['roleAssignments']);
    assertEquals($teamMembersCount, 2);

    // Assert pool operator can view team members of their team
    $query = $this->actingAs($this->poolOperator1, "api")
                  ->graphQL($viewAnyTeamMembers, $variables)
                  ->assertJsonFragment([
                    'id' => $this->poolOperator1->id,
                    'id' => $this->poolOperator2->id,
                  ]);

    // assert pool operator three is not present in the response
    $query->assertJsonMissing(['id' => $this->poolOperator3->id]);

    // assert the teams returned is an array of exactly two items
    $data = $query->original['data'];
    $teamMembersCount = count($data['team']['roleAssignments']);
    assertEquals($teamMembersCount, 2);

    // Assert pool operator cannot view team members of a team they're not attached too.
    $query = $this->actingAs($this->poolOperator3, "api")
                  ->graphQL($viewAnyTeamMembers, $variables)
                  ->assertGraphQLErrorMessage('This action is unauthorized.');
  }
}
