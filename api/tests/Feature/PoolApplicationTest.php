<?php

use App\Models\AwardExperience;
use App\Models\Pool;
use App\Models\PoolCandidate;
use App\Models\User;
use App\Models\GenericJobTitle;
use App\Models\Skill;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Testing\Fluent\AssertableJson;
use Nuwave\Lighthouse\Testing\ClearsSchemaCache;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Tests\TestCase;
use Database\Helpers\ApiEnums;
use Database\Seeders\SkillSeeder;

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

  public function testApplicationSubmit(): void
  {
    // need some generic job titles for a complete profile
    $this->seed(ClassificationSeeder::class);
    $this->seed(GenericJobTitleSeeder::class);

    // create incomplete user
    $newUser = User::factory()->create([
      'is_veteran' => null,
    ]);
    $newUser->email = 'admin@test.com';
    $newUser->sub = 'admin@test.com';
    $newUser->roles = ['ADMIN'];
    $newUser->expectedGenericJobTitles()->sync([GenericJobTitle::first()->id]);
    $newUser->save();

    // pool with no essential skills
    $newPool = Pool::factory()->create([]);
    $newPool->essentialSkills()->sync([]);

    $newPoolCandidate = PoolCandidate::factory()->create([
      'user_id' => $newUser->id,
      'pool_id' => $newPool->id,
      'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_DRAFT,
    ]);

    // assert incomplete user cannot submit application
    $this->graphQL(/** @lang Graphql */ '
      mutation submitTest($id: ID!, $sig: String!) {
        submitApplication(applicationID: $id, signature: $sig) {
          submittedAt
          signature
        }
      }
    ', [
      'id' => $newPoolCandidate->id,
      'sig' => 'SIGNED',
      ])->assertJson([
      'errors' => [[
        'message' => 'The given data was invalid.',
      ]]
    ]);

    // make user now complete
    $newUser->is_veteran = true;
    $newUser->save();

    // assert complete user can submit application
    // mimicking testArchivingApplication() where the returned value is always dynamic therefore must test returned structure and type
    $this->graphQL(/** @lang Graphql */ '
      mutation submitTest($id: ID!, $sig: String!) {
        submitApplication(applicationID: $id, signature: $sig) {
          submittedAt
        }
      }
    ', [
      'id' => $newPoolCandidate->id,
      'sig' => 'SIGNED',
      ])->assertJson(fn (AssertableJson $json) =>
      $json->has('data', fn ($json) =>
        $json->has('submitApplication', fn ($json) =>
          $json->whereType('submittedAt', 'string')
        )
      )
    );

    // assert user cannot re-submit application
    $this->graphQL(/** @lang Graphql */ '
      mutation submitTest($id: ID!, $sig: String!) {
        submitApplication(applicationID: $id, signature: $sig) {
          submittedAt
        }
      }
    ', [
      'id' => $newPoolCandidate->id,
      'sig' => 'SIGNED',
      ])->assertJson([
        'errors' => [[
          'message' => 'already submitted',
        ]]
    ]);
  }

  public function testApplicationSubmitSkills(): void
  {
    // need some generic job titles for a complete profile
    $this->seed(ClassificationSeeder::class);
    $this->seed(GenericJobTitleSeeder::class);
    $this->seed(SkillSeeder::class);

    // create a pool, attach one essential skill to it
    $newPool = Pool::factory()->create();
    $newPool->essentialSkills()->sync([Skill::all()->first()->id]);
    var_dump($newPool->essentialSkills()->pluck('pools_essential_skills.skill_id')->toArray());

    // create complete user
    $newUser = User::factory()->create();
    $newUser->email = 'admin@test.com';
    $newUser->sub = 'admin@test.com';
    $newUser->roles = ['ADMIN'];
    $newUser->expectedGenericJobTitles()->sync([GenericJobTitle::first()->id]);
    $newUser->save();

    // create an experience with no skills, then attach it to the user
    $firstExperience = AwardExperience::factory()->create([
      'user_id' => $newUser->id,
    ]);

    $newPoolCandidate = PoolCandidate::factory()->create([
      'user_id' => $newUser->id,
      'pool_id' => $newPool->id,
      'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_DRAFT,
    ]);

    // assert user cannot submit application with missing essential skills
    $this->graphQL(/** @lang Graphql */ '
      mutation submitTest($id: ID!, $sig: String!) {
        submitApplication(applicationID: $id, signature: $sig) {
          submittedAt
          signature
        }
      }
    ', [
      'id' => $newPoolCandidate->id,
      'sig' => 'SIGNED',
      ])->assertJson([
      'errors' => [[
        'message' => 'The given data was invalid.',
      ]]
    ]);

    // create another experience, then attach it to the user, and then connect the essential skill to it
    $secondExperience = AwardExperience::factory()->create([
      'user_id' => $newUser->id,
    ]);
    $secondExperience->skills()->sync($newPool->essentialSkills()->pluck('pools_essential_skills.skill_id')->toArray());
    var_dump($secondExperience->skills->pluck('id')->toArray());

    // assert user can now submit application as the essential skill is present
    $this->graphQL(/** @lang Graphql */ '
      mutation submitTest($id: ID!, $sig: String!) {
        submitApplication(applicationID: $id, signature: $sig) {
          submittedAt
        }
      }
    ', [
      'id' => $newPoolCandidate->id,
      'sig' => 'SIGNED',
      ])->assertJson(fn (AssertableJson $json) =>
      $json->has('data', fn ($json) =>
        $json->has('submitApplication', fn ($json) =>
          $json->whereType('submittedAt', 'string')
        )
      )
    );
  }
}
// php artisan test --filter PoolApplicationTest
