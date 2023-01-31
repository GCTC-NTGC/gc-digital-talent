<?php

use App\Models\User;
use App\Models\Team;
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
  }

  public function testAllTeamsQuery(): void
  {
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
  }
}
