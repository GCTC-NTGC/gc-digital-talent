<?php

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

  protected function setUp(): void
  {
    parent::setUp();
    $this->bootRefreshesSchemaCache();

    $newUser = new User;
    $newUser->email = 'admin@test.com';
    $newUser->sub = 'admin@test.com';
    $newUser->legacy_roles = ['ADMIN'];
    $newUser->save();

    Team::truncate(); // clear teams created in migrations before testing
  }

  public function testAllTeamsQuery(): void
  {
    $this->seed(DepartmentSeeder::class);

    $team1 = Team::factory()->create([
      'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      'name' => 'team1',
    ]);
    $team2 = Team::factory()->create([
      'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
      'name' => 'team2',
    ]);
    $team3 = Team::factory()->create([
      'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
      'name' => 'team3',
    ]);

    // Assert all teams query contains expected results
    $query = $this->graphQL(/** @lang Graphql */ '
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
    $query->assertJsonFragment(['id' => $team1->id]);
    $query->assertJsonFragment(['id' => $team2->id]);
    $query->assertJsonFragment(['id' => $team3->id]);

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
    $this->graphQL(
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
    $this->graphQL(
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
    $this->graphQL(
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

    $teamOne = Team::factory()->create();

    // Assert team update successful across all input fields
    $this->graphQL(
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
        'id' => $teamOne->id,
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
        'updateTeam' => [
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
            ],
          ],
        ]
      ]
    ]);
  }
}
