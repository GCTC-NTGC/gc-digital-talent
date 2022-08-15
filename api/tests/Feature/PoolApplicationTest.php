<?php

use App\Models\Pool;
use App\Models\PoolCandidate;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Testing\Fluent\AssertableJson;
use Nuwave\Lighthouse\Testing\ClearsSchemaCache;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Tests\TestCase;
use Database\Helpers\ApiEnums;

class PoolApplicationTest extends TestCase
{
  use RefreshDatabase;
  use MakesGraphQLRequests;
  use ClearsSchemaCache;

  protected function setUp(): void
  {
    parent::setUp();
    $this->bootClearsSchemaCache();
  }

  public function testApplicationCreation(): void
  {
    // the user applying
    // default, the test is run by Admin, auth_default_user in phpunit.xml
    $newUser = new User;
    $newUser->email = 'admin@test.com';
    $newUser->sub = 'admin@test.com';
    $newUser->roles = ['ADMIN'];
    $newUser->id= 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
    $newUser->save();

    Pool::factory()->create([
      'id' => 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
    ]);

    // Assert creating a pool application succeeds
    $this->graphQL(/** @lang Graphql */ '
      mutation createApplication {
        createApplication(userId: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11", poolId: "b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12") {
          user {
            id
          }
          pool {
            id
          }
        }
      }
    ')->assertJson([
      'data' => [
        'createApplication' => [
          'user' => [
            'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
          ],
          'pool' => [
            'id' => 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
          ]
        ]
      ]
    ]);

    // rerun the query above, it should successfully return the same result
    $this->graphQL(/** @lang Graphql */ '
      mutation createApplication {
        createApplication(userId: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11", poolId: "b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12") {
          user {
            id
          }
          pool {
            id
          }
        }
      }
    ')->assertJson([
      'data' => [
        'createApplication' => [
          'user' => [
            'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
          ],
          'pool' => [
            'id' => 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
          ]
        ]
      ]
    ]);

    // despite running the query twice, only one PoolCandidate entry should exist
    // assert count of applications is equal to 1
    $applicationCollection = PoolCandidate::all();
    $applicationCollectionCount = count($applicationCollection);
    $this->assertEquals(1, $applicationCollectionCount);
  }

  public function testArchivingApplication(): void
  {
    // Create pool candidates
    PoolCandidate::factory()->create([
      'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_EXPIRED,
      'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
    ]);
    // this one is archived
    PoolCandidate::factory()->create([
      'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_EXPIRED,
      'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
      'archived_at' =>config('constants.past_date')
    ]);

    // TODO: FIGURE OUT HOW TO UNIT TEST POLICIES EFFECTIVELY
    // Assert that policy makes the mutation successfully fail
    // $this->graphQL(/** @lang Graphql */ '
    //   mutation archivalTest($id: ID!) {
    //     archiveApplication(id: $id) {
    //       id
    //       archivedAt
    //     }
    //   }
    // ', [
    //   'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    // ])->assertJson([
    //   'errors' => [[
    //     'message' => 'Unauthenticated.',
    //   ]]
    // ]);

    // Create admin user we run tests as
    $newUser = new User;
    $newUser->email = 'admin@test.com';
    $newUser->sub = 'admin@test.com';
    $newUser->roles = ['ADMIN'];
    $newUser->save();

    // Assert expired object can be archived
    // Successful archiving returns type string in multiple HAS statements, failed returns NULL
    // given date is dynamically set with Carbon::now(), it will never return the same value, so must test that a non-null string is set
    $this->graphQL(/** @lang Graphql */ '
      mutation archivalTest($id: ID!) {
        archiveApplication(id: $id) {
          archivedAt
        }
      }
    ', [
      'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    ])->assertJson(fn (AssertableJson $json) =>
      $json->has('data', fn ($json) =>
        $json->has('archiveApplication', fn ($json) =>
          $json->whereType('archivedAt', 'string')
        )
      )
    );

    // Assert already archived object cannot be re-archived
    $this->graphQL(/** @lang Graphql */ '
      mutation archivalTest($id: ID!) {
        archiveApplication(id: $id) {
          archivedAt
        }
      }
    ', [
      'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
    ])->assertJson([
      'errors' => [[
        'message' => 'already archived',
      ]]
    ]);
  }

  public function testArchivingApplicationStatuses(): void
  {
    // array of statuses that should fail the test, as they should not allow archiving
    $statusesThatShouldFail = [
      ApiEnums::CANDIDATE_STATUS_AVAILABLE,
      ApiEnums::CANDIDATE_STATUS_PLACED_CASUAL,
      ApiEnums::CANDIDATE_STATUS_PLACED_INDETERMINATE,
      ApiEnums::CANDIDATE_STATUS_NO_LONGER_INTERESTED,
      ApiEnums::CANDIDATE_STATUS_PLACED_TERM,
      ApiEnums::CANDIDATE_STATUS_UNAVAILABLE
    ];

    // Create admin user we run tests as
    $newUser = new User;
    $newUser->email = 'admin@test.com';
    $newUser->sub = 'admin@test.com';
    $newUser->roles = ['ADMIN'];
    $newUser->save();

    // Create pool candidates
    PoolCandidate::factory()->create([
      'pool_candidate_status' => $statusesThatShouldFail[0],
      'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    ]);
    PoolCandidate::factory()->create([
        'pool_candidate_status' => $statusesThatShouldFail[1],
        'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
    ]);
    PoolCandidate::factory()->create([
      'pool_candidate_status' => $statusesThatShouldFail[2],
      'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
    ]);
    PoolCandidate::factory()->create([
        'pool_candidate_status' => $statusesThatShouldFail[3],
        'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14',
    ]);
    PoolCandidate::factory()->create([
      'pool_candidate_status' => $statusesThatShouldFail[4],
      'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15',
    ]);
    PoolCandidate::factory()->create([
        'pool_candidate_status' => $statusesThatShouldFail[5],
        'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a16',
    ]);

    // Assert un-expired object cannot be archived, 6 different ones that should fail
    // just running through each of them one at a time
    $this->graphQL(/** @lang Graphql */ '
        mutation archivalTest($id: ID!) {
          archiveApplication(id: $id) {
            archivedAt
          }
        }
      ', [
        'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        ])->assertJson([
        'errors' => [[
          'message' => 'pool candidate status does not contain a valid value.',
        ]]
    ]);
    $this->graphQL(/** @lang Graphql */ '
        mutation archivalTest($id: ID!) {
          archiveApplication(id: $id) {
            archivedAt
          }
        }
      ', [
        'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
        ])->assertJson([
        'errors' => [[
          'message' => 'pool candidate status does not contain a valid value.',
        ]]
    ]);

    $this->graphQL(/** @lang Graphql */ '
        mutation archivalTest($id: ID!) {
          archiveApplication(id: $id) {
            archivedAt
          }
        }
      ', [
        'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
        ])->assertJson([
        'errors' => [[
          'message' => 'pool candidate status does not contain a valid value.',
        ]]
    ]);

    $this->graphQL(/** @lang Graphql */ '
        mutation archivalTest($id: ID!) {
          archiveApplication(id: $id) {
            archivedAt
          }
        }
      ', [
        'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14',
        ])->assertJson([
        'errors' => [[
          'message' => 'pool candidate status does not contain a valid value.',
        ]]
    ]);

    $this->graphQL(/** @lang Graphql */ '
        mutation archivalTest($id: ID!) {
          archiveApplication(id: $id) {
            archivedAt
          }
        }
      ', [
        'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15',
        ])->assertJson([
        'errors' => [[
          'message' => 'pool candidate status does not contain a valid value.',
        ]]
    ]);

    $this->graphQL(/** @lang Graphql */ '
        mutation archivalTest($id: ID!) {
          archiveApplication(id: $id) {
            archivedAt
          }
        }
      ', [
        'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a16',
        ])->assertJson([
        'errors' => [[
          'message' => 'pool candidate status does not contain a valid value.',
        ]]
    ]);
  }
}
