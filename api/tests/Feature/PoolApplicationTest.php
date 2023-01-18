<?php

use App\Models\AwardExperience;
use App\Models\GenericJobTitle;
use App\Models\Pool;
use App\Models\PoolCandidate;
use App\Models\User;
use App\Models\Skill;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Testing\Fluent\AssertableJson;
use Nuwave\Lighthouse\Testing\ClearsSchemaCache;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Tests\TestCase;
use Database\Helpers\ApiEnums;
use Database\Seeders\SkillFamilySeeder;
use Database\Seeders\SkillSeeder;
use Carbon\Carbon;

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
        $newUser->id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
        $newUser->save();

        // create an unexpired Pool instance
        Pool::factory()->create([
            'id' => 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
            'published_at' => config('constants.past_date'),
            'closing_date' => config('constants.far_future_date'),
        ]);

        // Assert creating a pool application succeeds
        // returns DRAFT as a result of pool_candidate_status Accessor and unexpired pool
        $this->graphQL(
            /** @lang Graphql */
            '
            mutation createApplication {
                createApplication(userId: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11", poolId: "b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12") {
                    user {
                        id
                    }
                    pool {
                        id
                    }
                    status
                }
            }
        '
        )->assertJson([
            'data' => [
                'createApplication' => [
                    'user' => [
                        'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
                    ],
                    'pool' => [
                        'id' => 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
                    ],
                    'status' => ApiEnums::CANDIDATE_STATUS_DRAFT,
                ]
            ]
        ]);

        // rerun the query above, it should successfully return the same result
        $this->graphQL(
            /** @lang Graphql */
            '
            mutation createApplication {
                createApplication(userId: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11", poolId: "b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12") {
                user {
                    id
                }
                pool {
                    id
                }
                status
                }
            }
        '
        )->assertJson([
            'data' => [
                'createApplication' => [
                    'user' => [
                        'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
                    ],
                    'pool' => [
                        'id' => 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
                    ],
                ]
            ],
            'errors' => [[
                'message' => ApiEnums::POOL_CANDIDATE_EXISTS,
            ]]
        ]);

        // despite running the query twice, only one PoolCandidate entry should exist
        // assert count of applications is equal to 1
        $applicationCollection = PoolCandidate::all();
        $applicationCollectionCount = count($applicationCollection);
        $this->assertEquals(1, $applicationCollectionCount);
    }

    public function testUserCannotApplyToDraftApplication(): void
    {
        $newUser = new User;
        $newUser->email = 'admin@test.com';
        $newUser->sub = 'admin@test.com';
        $newUser->roles = ['ADMIN'];
        $newUser->id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
        $newUser->save();

        Pool::factory()->create([
            'id' => '3ecf840d-b0ed-4207-8fc4-f45c4a865eaf',
            'published_at' => null,
            'closing_date' => config('constants.far_future_date'),
        ]);

        $this->graphQL(
            /** @lang Graphql */
            '
            mutation createApplication {
                createApplication(userId: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11", poolId: "3ecf840d-b0ed-4207-8fc4-f45c4a865eaf") {
                    user {
                        id
                    }
                    pool {
                        id
                    }
                    status
                }
            }
            '
        )->assertJson([
            'data' => [
                'createApplication' => null
            ],
            'errors' => [[
                'message' => ApiEnums::POOL_CANDIDATE_POOL_NOT_PUBLISHED,
            ]]
        ]);
    }

    public function testUserCannotApplyToExpiredApplication(): void
    {
        $newUser = new User;
        $newUser->email = 'admin@test.com';
        $newUser->sub = 'admin@test.com';
        $newUser->roles = ['ADMIN'];
        $newUser->id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
        $newUser->save();

        Pool::factory()->create([
            'id' => 'f755f7da-c490-4fe1-a1f0-a6c233796442',
            'published_at' => null,
            'closing_date' => config('constants.far_past_date'),
        ]);

        $this->graphQL(
            /** @lang Graphql */
            '
            mutation createApplication {
                createApplication(userId: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11", poolId: "f755f7da-c490-4fe1-a1f0-a6c233796442") {
                    user {
                        id
                    }
                    pool {
                        id
                    }
                    status
                }
            }
            '
        )->assertJson([
            'data' => [
                'createApplication' => null
            ],
            'errors' => [[
                'message' => ApiEnums::POOL_CANDIDATE_POOL_NOT_PUBLISHED,
            ]]
        ]);
    }

    public function testArchivingApplication(): void
    {
        // Create pool candidates
        PoolCandidate::factory()->create([
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_EXPIRED,
            'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
            'submitted_at' => config('constants.past_date'),
        ]);
        // this one is archived
        PoolCandidate::factory()->create([
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_EXPIRED,
            'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
            'archived_at' => config('constants.past_date'),
            'submitted_at' => config('constants.past_date'),
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
        $this->graphQL(
            /** @lang Graphql */
            '
      mutation archivalTest($id: ID!) {
        archiveApplication(id: $id) {
          archivedAt
        }
      }
    ',
            [
                'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
            ]
        )->assertJson(
            fn (AssertableJson $json) =>
            $json->has(
                'data',
                fn ($json) =>
                $json->has(
                    'archiveApplication',
                    fn ($json) =>
                    $json->whereType('archivedAt', 'string')
                )
            )
        );

        // Assert already archived object cannot be re-archived
        $this->graphQL(
            /** @lang Graphql */
            '
      mutation archivalTest($id: ID!) {
        archiveApplication(id: $id) {
          archivedAt
        }
      }
    ',
            [
                'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
            ]
        )->assertJson([
            'errors' => [[
                'message' => 'AlreadyArchived',
            ]]
        ]);
    }

    public function testArchivingApplicationStatuses(): void
    {
        // array of statuses that should fail the test, as they should not allow archiving
        $statusesThatShouldFail = [
            ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE,
            ApiEnums::CANDIDATE_STATUS_PLACED_CASUAL,
            ApiEnums::CANDIDATE_STATUS_PLACED_INDETERMINATE,
            ApiEnums::CANDIDATE_STATUS_PLACED_TERM,
            ApiEnums::CANDIDATE_STATUS_APPLICATION_REVIEW,
            ApiEnums::CANDIDATE_STATUS_SCREENED_IN,
            ApiEnums::CANDIDATE_STATUS_UNDER_ASSESSMENT,
            ApiEnums::CANDIDATE_STATUS_DRAFT,
            ApiEnums::CANDIDATE_STATUS_DRAFT_EXPIRED,
            ApiEnums::CANDIDATE_STATUS_NEW_APPLICATION,
            ApiEnums::CANDIDATE_STATUS_QUALIFIED_UNAVAILABLE,
            ApiEnums::CANDIDATE_STATUS_QUALIFIED_WITHDREW,
        ];

        // Create admin user we run tests as
        $newUser = new User;
        $newUser->email = 'admin@test.com';
        $newUser->sub = 'admin@test.com';
        $newUser->roles = ['ADMIN'];
        $newUser->save();

        // Create pool candidates
        // submitted at statuses for ones other than draft/draft-expired, and future expiry dates for unexpired
        $candidateOne = PoolCandidate::factory()->create([
            'pool_candidate_status' => $statusesThatShouldFail[0],
            'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
            'submitted_at' => config('constants.past_date'),
            'expiry_date' => config('constants.far_future_date'),
        ]);
        $candidateTwo = PoolCandidate::factory()->create([
            'pool_candidate_status' => $statusesThatShouldFail[1],
            'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
            'submitted_at' => config('constants.past_date'),
            'expiry_date' => config('constants.far_future_date'),
        ]);
        $candidateThree = PoolCandidate::factory()->create([
            'pool_candidate_status' => $statusesThatShouldFail[2],
            'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
            'submitted_at' => config('constants.past_date'),
            'expiry_date' => config('constants.far_future_date'),
        ]);
        $candidateFour = PoolCandidate::factory()->create([
            'pool_candidate_status' => $statusesThatShouldFail[3],
            'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14',
            'submitted_at' => config('constants.past_date'),
            'expiry_date' => config('constants.far_future_date'),
        ]);
        $candidateFive = PoolCandidate::factory()->create([
            'pool_candidate_status' => $statusesThatShouldFail[4],
            'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15',
            'submitted_at' => config('constants.past_date'),
            'expiry_date' => config('constants.far_future_date'),
        ]);
        $candidateSix = PoolCandidate::factory()->create([
            'pool_candidate_status' => $statusesThatShouldFail[5],
            'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a16',
            'submitted_at' => config('constants.past_date'),
            'expiry_date' => config('constants.far_future_date'),
        ]);
        $candidateSeven = PoolCandidate::factory()->create([
            'pool_candidate_status' => $statusesThatShouldFail[6],
            'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a17',
            'submitted_at' => config('constants.past_date'),
            'expiry_date' => config('constants.far_future_date'),
        ]);
        // these two are draft and draft-expired so no submitted_at and the latter expired
        $candidateEight = PoolCandidate::factory()->create([
            'pool_candidate_status' => $statusesThatShouldFail[7],
            'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a18',
            'expiry_date' => config('constants.far_future_date'),
        ]);
        $candidateNine = PoolCandidate::factory()->create([
            'pool_candidate_status' => $statusesThatShouldFail[8],
            'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a19',
            'expiry_date' => config('constants.past_date'),
        ]);
        $candidateTen = PoolCandidate::factory()->create([
            'pool_candidate_status' => $statusesThatShouldFail[9],
            'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a20',
            'submitted_at' => config('constants.past_date'),
            'expiry_date' => config('constants.far_future_date'),
        ]);
        $candidateEleven = PoolCandidate::factory()->create([
            'pool_candidate_status' => $statusesThatShouldFail[10],
            'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a21',
            'submitted_at' => config('constants.past_date'),
            'expiry_date' => config('constants.far_future_date'),
        ]);
        $candidateTwelve = PoolCandidate::factory()->create([
            'pool_candidate_status' => $statusesThatShouldFail[11],
            'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
            'submitted_at' => config('constants.past_date'),
            'expiry_date' => config('constants.far_future_date'),
        ]);

        // Assert un-expired object cannot be archived, 12 different ones that should fail
        // just running through each of them one at a time
        $this->graphQL(
            /** @lang Graphql */
            '
        mutation archivalTest($id: ID!) {
          archiveApplication(id: $id) {
            archivedAt
          }
        }
      ',
            [
                'id' => $candidateOne->id,
            ]
        )->assertJson([
            'errors' => [[
                'message' => 'pool candidate status InvalidValueArchival',
            ]]
        ]);
        $this->graphQL(
            /** @lang Graphql */
            '
        mutation archivalTest($id: ID!) {
          archiveApplication(id: $id) {
            archivedAt
          }
        }
      ',
            [
                'id' => $candidateTwo->id,
            ]
        )->assertJson([
            'errors' => [[
                'message' => 'pool candidate status InvalidValueArchival',
            ]]
        ]);

        $this->graphQL(
            /** @lang Graphql */
            '
        mutation archivalTest($id: ID!) {
          archiveApplication(id: $id) {
            archivedAt
          }
        }
      ',
            [
                'id' => $candidateThree->id,
            ]
        )->assertJson([
            'errors' => [[
                'message' => 'pool candidate status InvalidValueArchival',
            ]]
        ]);

        $this->graphQL(
            /** @lang Graphql */
            '
        mutation archivalTest($id: ID!) {
          archiveApplication(id: $id) {
            archivedAt
          }
        }
      ',
            [
                'id' => $candidateFour->id,
            ]
        )->assertJson([
            'errors' => [[
                'message' => 'pool candidate status InvalidValueArchival',
            ]]
        ]);

        $this->graphQL(
            /** @lang Graphql */
            '
        mutation archivalTest($id: ID!) {
          archiveApplication(id: $id) {
            archivedAt
          }
        }
      ',
            [
                'id' => $candidateFive->id,
            ]
        )->assertJson([
            'errors' => [[
                'message' => 'pool candidate status InvalidValueArchival',
            ]]
        ]);

        $this->graphQL(
            /** @lang Graphql */
            '
        mutation archivalTest($id: ID!) {
          archiveApplication(id: $id) {
            archivedAt
          }
        }
      ',
            [
                'id' => $candidateSix->id,
            ]
        )->assertJson([
            'errors' => [[
                'message' => 'pool candidate status InvalidValueArchival',
            ]]
        ]);
        $this->graphQL(
            /** @lang Graphql */
            '
        mutation archivalTest($id: ID!) {
          archiveApplication(id: $id) {
            archivedAt
          }
        }
      ',
            [
                'id' => $candidateSeven->id,
            ]
        )->assertJson([
            'errors' => [[
                'message' => 'pool candidate status InvalidValueArchival',
            ]]
        ]);

        $this->graphQL(
            /** @lang Graphql */
            '
      mutation archivalTest($id: ID!) {
        archiveApplication(id: $id) {
          archivedAt
        }
      }
    ',
            [
                'id' => $candidateEight->id,
            ]
        )->assertJson([
            'errors' => [[
                'message' => 'pool candidate status InvalidValueArchival',
            ]]
        ]);

        $this->graphQL(
            /** @lang Graphql */
            '
      mutation archivalTest($id: ID!) {
        archiveApplication(id: $id) {
          archivedAt
        }
      }
    ',
            [
                'id' => $candidateNine->id,
            ]
        )->assertJson([
            'errors' => [[
                'message' => 'pool candidate status InvalidValueArchival',
            ]]
        ]);

        $this->graphQL(
            /** @lang Graphql */
            '
      mutation archivalTest($id: ID!) {
        archiveApplication(id: $id) {
          archivedAt
        }
      }
    ',
            [
                'id' => $candidateTen->id,
            ]
        )->assertJson([
            'errors' => [[
                'message' => 'pool candidate status InvalidValueArchival',
            ]]
        ]);

        $this->graphQL(
            /** @lang Graphql */
            '
      mutation archivalTest($id: ID!) {
        archiveApplication(id: $id) {
          archivedAt
        }
      }
    ',
            [
                'id' => $candidateEleven->id,
            ]
        )->assertJson([
            'errors' => [[
                'message' => 'pool candidate status InvalidValueArchival',
            ]]
        ]);

        $this->graphQL(
            /** @lang Graphql */
            '
      mutation archivalTest($id: ID!) {
        archiveApplication(id: $id) {
          archivedAt
        }
      }
    ',
            [
                'id' => $candidateTwelve->id,
            ]
        )->assertJson([
            'errors' => [[
                'message' => 'pool candidate status InvalidValueArchival',
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
            'armed_forces_status' => null,
        ]);
        $newUser->email = 'admin@test.com';
        $newUser->sub = 'admin@test.com';
        $newUser->roles = ['ADMIN'];
        $newUser->expectedGenericJobTitles()->sync([GenericJobTitle::first()->id]);
        $newUser->save();

        // pool with no essential skills
        $newPool = Pool::factory()->create([
            'closing_date' => Carbon::now()->addDays(1)
        ]);
        $newPool->essentialSkills()->sync([]);

        $newPoolCandidate = PoolCandidate::factory()->create([
            'user_id' => $newUser->id,
            'pool_id' => $newPool->id,
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_DRAFT,
        ]);

        // assert incomplete user cannot submit application
        $this->graphQL(
            /** @lang Graphql */
            '
      mutation submitTest($id: ID!, $sig: String!) {
        submitApplication(id: $id, signature: $sig) {
          submittedAt
          signature
        }
      }
    ',
            [
                'id' => $newPoolCandidate->id,
                'sig' => 'SIGNED',
            ]
        )->assertJson([
            'errors' => [[
                'message' => ApiEnums::POOL_CANDIDATE_PROFILE_INCOMPLETE,
            ]]
        ]);

        // make user now complete
        $newUser->armed_forces_status = ApiEnums::ARMED_FORCES_VETERAN;
        $newUser->save();

        // assert complete user can submit application
        // mimicking testArchivingApplication() where the returned value is always dynamic therefore must test returned structure and type
        $this->graphQL(
            /** @lang Graphql */
            '
      mutation submitTest($id: ID!, $sig: String!) {
        submitApplication(id: $id, signature: $sig) {
          submittedAt
        }
      }
    ',
            [
                'id' => $newPoolCandidate->id,
                'sig' => 'SIGNED',
            ]
        )->assertJson(
            fn (AssertableJson $json) =>
            $json->has(
                'data',
                fn ($json) =>
                $json->has(
                    'submitApplication',
                    fn ($json) =>
                    $json->whereType('submittedAt', 'string')
                )
            )
        );

        // assert user cannot re-submit application
        $this->graphQL(
            /** @lang Graphql */
            '
      mutation submitTest($id: ID!, $sig: String!) {
        submitApplication(id: $id, signature: $sig) {
          submittedAt
        }
      }
    ',
            [
                'id' => $newPoolCandidate->id,
                'sig' => 'SIGNED',
            ]
        )->assertJson([
            'errors' => [[
                'message' => 'AlreadySubmitted',
            ]]
        ]);
    }

    public function testApplicationSubmitSignature(): void
    {
        // re-make complete user, attach pool candidate
        $this->seed(ClassificationSeeder::class);
        $this->seed(GenericJobTitleSeeder::class);

        $newUser = User::factory()->create();
        $newUser->email = 'admin@test.com';
        $newUser->sub = 'admin@test.com';
        $newUser->roles = ['ADMIN'];
        $newUser->expectedGenericJobTitles()->sync([GenericJobTitle::first()->id]);
        $newUser->save();

        $newPool = Pool::factory()->create([
            'closing_date' => Carbon::now()->addDays(1)
        ]);
        $newPool->essentialSkills()->sync([]);

        $newPoolCandidate = PoolCandidate::factory()->create([
            'user_id' => $newUser->id,
            'pool_id' => $newPool->id,
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_DRAFT,
        ]);

        // assert empty signature submission errors
        $this->graphQL(
            /** @lang Graphql */
            '
      mutation submitTest($id: ID!, $sig: String!) {
        submitApplication(id: $id, signature: $sig) {
          submittedAt
        }
      }
    ',
            [
                'id' => $newPoolCandidate->id,
                'sig' => '',
            ]
        )->assertJson([
            'errors' => [[
                'message' => ApiEnums::POOL_CANDIDATE_SIGNATURE_REQUIRED,
            ]]
        ]);

        // assert null signature submission errors
        $this->graphQL(
            /** @lang Graphql */
            '
      mutation submitTest($id: ID!, $sig: String!) {
        submitApplication(id: $id, signature: $sig) {
          submittedAt
        }
      }
    ',
            [
                'id' => $newPoolCandidate->id,
                'sig' => null,
            ]
        )->assertJson([
            'errors' => [[
                'message' => 'Variable "$sig" of non-null type "String!" must not be null.',
            ]]
        ]);

        // assert query above re-submitted with a filled signature field this time succeeds
        $this->graphQL(
            /** @lang Graphql */
            '
      mutation submitTest($id: ID!, $sig: String!) {
        submitApplication(id: $id, signature: $sig) {
          submittedAt
        }
      }
    ',
            [
                'id' => $newPoolCandidate->id,
                'sig' => 'SIGNATURE',
            ]
        )->assertJson(
            fn (AssertableJson $json) =>
            $json->has(
                'data',
                fn ($json) =>
                $json->has(
                    'submitApplication',
                    fn ($json) =>
                    $json->whereType('submittedAt', 'string')
                )
            )
        );
    }

    public function testApplicationSubmitSkills(): void
    {
        // need some generic job titles for a complete profile
        $this->seed(ClassificationSeeder::class);
        $this->seed(GenericJobTitleSeeder::class);
        $this->seed(SkillFamilySeeder::class);
        $this->seed(SkillSeeder::class);

        // create a pool, attach one essential skill to it
        $newPool = Pool::factory()->create([
            'closing_date' => Carbon::now()->addDays(1)
        ]);
        $essentialSkills = Skill::inRandomOrder()->limit(5)->get();
        $newPool->essentialSkills()->sync($essentialSkills);

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
        $this->graphQL(
            /** @lang Graphql */
            '
      mutation submitTest($id: ID!, $sig: String!) {
        submitApplication(id: $id, signature: $sig) {
          submittedAt
          signature
        }
      }
    ',
            [
                'id' => $newPoolCandidate->id,
                'sig' => 'SIGNED',
            ]
        )->assertJson([
            'errors' => [[
                'message' => ApiEnums::POOL_CANDIDATE_MISSING_ESSENTIAL_SKILLS,
            ]]
        ]);

        // create another experience, then attach it to the user, and then connect the essential skill to it
        $secondExperience = AwardExperience::factory()->create([
            'user_id' => $newUser->id,
        ]);
        $secondExperience->skills()->sync($essentialSkills);

        // assert user can now submit application as the essential skill is present
        $this->graphQL(
            /** @lang Graphql */
            '
      mutation submitTest($id: ID!, $sig: String!) {
        submitApplication(id: $id, signature: $sig) {
          submittedAt
        }
      }
    ',
            [
                'id' => $newPoolCandidate->id,
                'sig' => 'SIGNED',
            ]
        )->assertJson(
            fn (AssertableJson $json) =>
            $json->has(
                'data',
                fn ($json) =>
                $json->has(
                    'submitApplication',
                    fn ($json) =>
                    $json->whereType('submittedAt', 'string')
                )
            )
        );
    }

    public function testApplicationSubmitStatus(): void
    {
        // re-make complete user, attach pool candidate
        $this->seed(ClassificationSeeder::class);
        $this->seed(GenericJobTitleSeeder::class);

        $newUser = User::factory()->create();
        $newUser->email = 'admin@test.com';
        $newUser->sub = 'admin@test.com';
        $newUser->roles = ['ADMIN'];
        $newUser->expectedGenericJobTitles()->sync([GenericJobTitle::first()->id]);
        $newUser->save();

        $newPool = Pool::factory()->create([
            'closing_date' =>  Carbon::now()->addDays(1)
        ]);
        $newPool->essentialSkills()->sync([]);

        $newPoolCandidate = PoolCandidate::factory()->create([
            'user_id' => $newUser->id,
            'pool_id' => $newPool->id,
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_DRAFT,
        ]);

        // assert status updated upon submission, and doesn't return DRAFT or EXPIRED
        $this->graphQL(
            /** @lang Graphql */
            '
      mutation submitTest($id: ID!, $sig: String!) {
        submitApplication(id: $id, signature: $sig) {
          status
        }
      }
    ',
            [
                'id' => $newPoolCandidate->id,
                'sig' => 'sign',
            ]
        )->assertJson([
            "data" => [
                "submitApplication" => [
                    "status" => ApiEnums::CANDIDATE_STATUS_NEW_APPLICATION,
                ]
            ]
        ]);
    }

    public function testApplicationSubmitClosingDate(): void
    {
        // re-make complete user, attach pool candidate
        $this->seed(ClassificationSeeder::class);
        $this->seed(GenericJobTitleSeeder::class);

        $newUser = User::factory()->create();
        $newUser->email = 'admin@test.com';
        $newUser->sub = 'admin@test.com';
        $newUser->roles = ['ADMIN'];
        $newUser->save();

        //Closed Pool
        $newPool = Pool::factory()->create([
            'closing_date' =>  Carbon::now()->subDays(1)
        ]);
        $newPool->essentialSkills()->sync([]);

        $newPoolCandidate = PoolCandidate::factory()->create([
            'user_id' => $newUser->id,
            'pool_id' => $newPool->id,
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_DRAFT,
        ]);

        $graphDoc = /** @lang Graphql */ '
            mutation submitTest($id: ID!, $sig: String!) {
                submitApplication(id: $id, signature: $sig) {
                    submittedAt
                }
            }
        ';

        // assert status
        $this->graphQL(
            $graphDoc,
            [
                'id' => $newPoolCandidate->id,
                'sig' => 'sign',
            ]
        )->assertJson([
            'errors' => [[
                'message' => ApiEnums::POOL_CANDIDATE_POOL_CLOSED,
            ]]
        ]);

        $newPool->closing_date = Carbon::now()->addDays(1);
        $newPool->save();

        $this->graphQL(
            $graphDoc,
            [
                'id' => $newPoolCandidate->id,
                'sig' => 'sign',
            ]
        )->assertJson(
            fn (AssertableJson $json) =>
            $json->has(
                'data',
                fn ($json) =>
                $json->has(
                    'submitApplication',
                    fn ($json) =>
                    $json->whereType('submittedAt', 'string')
                )
            )
        );

    }

    public function testApplicationDeletion(): void
    {
        // re-make complete user, attach pool candidate
        $this->seed(ClassificationSeeder::class);
        $this->seed(GenericJobTitleSeeder::class);

        $newUser = User::factory()->create();
        $newUser->email = 'admin@test.com';
        $newUser->sub = 'admin@test.com';
        $newUser->roles = ['ADMIN'];
        $newUser->expectedGenericJobTitles()->sync([GenericJobTitle::first()->id]);
        $newUser->save();

        $newPool = Pool::factory()->create([]);
        $newPool->essentialSkills()->sync([]);

        $newPoolCandidate = PoolCandidate::factory()->create([
            'user_id' => $newUser->id,
            'pool_id' => $newPool->id,
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_DRAFT,
            'expiry_date' => config('constants.far_future_date'),
        ]);

        // Assert candidate exists
        $this->graphQL(
            /** @lang Graphql */
            '
      query poolCandidate($id: UUID!) {
          poolCandidate(id: $id) {
              status
          }
      }
      ',
            [
                'id' => $newPoolCandidate->id,
            ]
        )->assertJson([
            "data" => [
                "poolCandidate" => [
                    "status" => ApiEnums::CANDIDATE_STATUS_DRAFT,
                ]
            ]
        ]);

        // run deletion mutation and assert it returns true, indicating success
        $this->graphQL(
            /** @lang Graphql */
            '
      mutation deleteTest($id: ID!) {
        deleteApplication(id: $id)
      }
    ',
            [
                'id' => $newPoolCandidate->id,
            ]
        )->assertJson([
            "data" => [
                "deleteApplication" => "true",
            ]
        ]);

        // Assert candidate no longer exists
        $this->graphQL(
            /** @lang Graphql */
            '
      query poolCandidate($id: UUID!) {
          poolCandidate(id: $id) {
              status
          }
      }
      ',
            [
                'id' => $newPoolCandidate->id,
            ]
        )->assertJson([
            "data" => [
                "poolCandidate" => null,
            ]
        ]);
    }

    public function testApplicationDeletionStatuses(): void
    {
        // RECYCLING FROM ABOVE TESTS
        // array of statuses that should fail the test, as they should not allow deletion
        $statusesThatShouldFail = [
            ApiEnums::CANDIDATE_STATUS_NEW_APPLICATION,
            ApiEnums::CANDIDATE_STATUS_APPLICATION_REVIEW,
            ApiEnums::CANDIDATE_STATUS_SCREENED_IN,
            ApiEnums::CANDIDATE_STATUS_SCREENED_OUT_APPLICATION,
            ApiEnums::CANDIDATE_STATUS_UNDER_ASSESSMENT,
            ApiEnums::CANDIDATE_STATUS_SCREENED_OUT_ASSESSMENT,
            ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE,
            ApiEnums::CANDIDATE_STATUS_QUALIFIED_UNAVAILABLE,
            ApiEnums::CANDIDATE_STATUS_QUALIFIED_WITHDREW,
            ApiEnums::CANDIDATE_STATUS_PLACED_CASUAL,
            ApiEnums::CANDIDATE_STATUS_PLACED_TERM,
            ApiEnums::CANDIDATE_STATUS_PLACED_INDETERMINATE,
            ApiEnums::CANDIDATE_STATUS_EXPIRED,
            ApiEnums::CANDIDATE_STATUS_REMOVED,
        ];

        // Create admin user we run tests as
        $newUser = new User;
        $newUser->email = 'admin@test.com';
        $newUser->sub = 'admin@test.com';
        $newUser->roles = ['ADMIN'];
        $newUser->save();

        // Create pool candidates
        $candidateOne = PoolCandidate::factory()->create([
            'pool_candidate_status' => $statusesThatShouldFail[0],
            'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
            'submitted_at' => config('constants.past_date'),
            'expiry_date' => config('constants.far_future_date'),
        ]);
        $candidateTwo = PoolCandidate::factory()->create([
            'pool_candidate_status' => $statusesThatShouldFail[1],
            'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
            'submitted_at' => config('constants.past_date'),
            'expiry_date' => config('constants.far_future_date'),
        ]);
        $candidateThree = PoolCandidate::factory()->create([
            'pool_candidate_status' => $statusesThatShouldFail[2],
            'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
            'submitted_at' => config('constants.past_date'),
            'expiry_date' => config('constants.far_future_date'),
        ]);
        $candidateFour = PoolCandidate::factory()->create([
            'pool_candidate_status' => $statusesThatShouldFail[3],
            'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14',
            'submitted_at' => config('constants.past_date'),
            'expiry_date' => config('constants.far_future_date'),
        ]);
        $candidateFive = PoolCandidate::factory()->create([
            'pool_candidate_status' => $statusesThatShouldFail[4],
            'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15',
            'submitted_at' => config('constants.past_date'),
            'expiry_date' => config('constants.far_future_date'),
        ]);
        $candidateSix = PoolCandidate::factory()->create([
            'pool_candidate_status' => $statusesThatShouldFail[5],
            'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a16',
            'submitted_at' => config('constants.past_date'),
            'expiry_date' => config('constants.far_future_date'),
        ]);
        $candidateSeven = PoolCandidate::factory()->create([
            'pool_candidate_status' => $statusesThatShouldFail[6],
            'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a17',
            'submitted_at' => config('constants.past_date'),
            'expiry_date' => config('constants.far_future_date'),
        ]);
        $candidateEight = PoolCandidate::factory()->create([
            'pool_candidate_status' => $statusesThatShouldFail[7],
            'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a18',
            'submitted_at' => config('constants.past_date'),
            'expiry_date' => config('constants.far_future_date'),
        ]);
        $candidateNine = PoolCandidate::factory()->create([
            'pool_candidate_status' => $statusesThatShouldFail[8],
            'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a19',
            'submitted_at' => config('constants.past_date'),
            'expiry_date' => config('constants.far_future_date'),
        ]);
        $candidateTen = PoolCandidate::factory()->create([
            'pool_candidate_status' => $statusesThatShouldFail[9],
            'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a20',
            'submitted_at' => config('constants.past_date'),
            'expiry_date' => config('constants.far_future_date'),
        ]);
        $candidateEleven = PoolCandidate::factory()->create([
            'pool_candidate_status' => $statusesThatShouldFail[10],
            'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a21',
            'submitted_at' => config('constants.past_date'),
            'expiry_date' => config('constants.far_future_date'),
        ]);
        $candidateTwelve = PoolCandidate::factory()->create([
            'pool_candidate_status' => $statusesThatShouldFail[11],
            'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
            'submitted_at' => config('constants.past_date'),
            'expiry_date' => config('constants.far_future_date'),
        ]);
        $candidateThirteen = PoolCandidate::factory()->create([
            'pool_candidate_status' => $statusesThatShouldFail[12],
            'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a23',
            'submitted_at' => config('constants.past_date'),
            'expiry_date' => config('constants.past_date'),
        ]);
        $candidateFourteen = PoolCandidate::factory()->create([
            'pool_candidate_status' => $statusesThatShouldFail[13],
            'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a24',
            'submitted_at' => config('constants.past_date'),
            'expiry_date' => config('constants.past_date'),
        ]);

        // Assert submitted object cannot be deleted, 14 different ones that should fail
        // just running through each of them one at a time
        $this->graphQL(
            /** @lang Graphql */
            '
      mutation deleteTest($id: ID!) {
        deleteApplication(id: $id)
      }
    ',
            [
                'id' => $candidateOne->id,
            ]
        )->assertJson([
            'errors' => [[
                'message' => 'pool candidate status InvalidValueDeletion',
            ]]
        ]);
        $this->graphQL(
            /** @lang Graphql */
            '
      mutation deleteTest($id: ID!) {
        deleteApplication(id: $id)
      }
    ',
            [
                'id' => $candidateTwo->id,
            ]
        )->assertJson([
            'errors' => [[
                'message' => 'pool candidate status InvalidValueDeletion',
            ]]
        ]);

        $this->graphQL(
            /** @lang Graphql */
            '
      mutation deleteTest($id: ID!) {
        deleteApplication(id: $id)
      }
    ',
            [
                'id' => $candidateThree->id,
            ]
        )->assertJson([
            'errors' => [[
                'message' => 'pool candidate status InvalidValueDeletion',
            ]]
        ]);

        $this->graphQL(
            /** @lang Graphql */
            '
      mutation deleteTest($id: ID!) {
        deleteApplication(id: $id)
      }
    ',
            [
                'id' => $candidateFour->id,
            ]
        )->assertJson([
            'errors' => [[
                'message' => 'pool candidate status InvalidValueDeletion',
            ]]
        ]);

        $this->graphQL(
            /** @lang Graphql */
            '
      mutation deleteTest($id: ID!) {
        deleteApplication(id: $id)
      }
    ',
            [
                'id' => $candidateFive->id,
            ]
        )->assertJson([
            'errors' => [[
                'message' => 'pool candidate status InvalidValueDeletion',
            ]]
        ]);

        $this->graphQL(
            /** @lang Graphql */
            '
      mutation deleteTest($id: ID!) {
        deleteApplication(id: $id)
      }
    ',
            [
                'id' => $candidateSix->id,
            ]
        )->assertJson([
            'errors' => [[
                'message' => 'pool candidate status InvalidValueDeletion',
            ]]
        ]);

        $this->graphQL(
            /** @lang Graphql */
            '
      mutation deleteTest($id: ID!) {
        deleteApplication(id: $id)
      }
    ',
            [
                'id' => $candidateSeven->id,
            ]
        )->assertJson([
            'errors' => [[
                'message' => 'pool candidate status InvalidValueDeletion',
            ]]
        ]);

        $this->graphQL(
            /** @lang Graphql */
            '
      mutation deleteTest($id: ID!) {
        deleteApplication(id: $id)
      }
    ',
            [
                'id' => $candidateEight->id,
            ]
        )->assertJson([
            'errors' => [[
                'message' => 'pool candidate status InvalidValueDeletion',
            ]]
        ]);

        $this->graphQL(
            /** @lang Graphql */
            '
      mutation deleteTest($id: ID!) {
        deleteApplication(id: $id)
      }
    ',
            [
                'id' => $candidateNine->id,
            ]
        )->assertJson([
            'errors' => [[
                'message' => 'pool candidate status InvalidValueDeletion',
            ]]
        ]);

        $this->graphQL(
            /** @lang Graphql */
            '
      mutation deleteTest($id: ID!) {
        deleteApplication(id: $id)
      }
    ',
            [
                'id' => $candidateTen->id,
            ]
        )->assertJson([
            'errors' => [[
                'message' => 'pool candidate status InvalidValueDeletion',
            ]]
        ]);

        $this->graphQL(
            /** @lang Graphql */
            '
      mutation deleteTest($id: ID!) {
        deleteApplication(id: $id)
      }
    ',
            [
                'id' => $candidateEleven->id,
            ]
        )->assertJson([
            'errors' => [[
                'message' => 'pool candidate status InvalidValueDeletion',
            ]]
        ]);

        $this->graphQL(
            /** @lang Graphql */
            '
      mutation deleteTest($id: ID!) {
        deleteApplication(id: $id)
      }
    ',
            [
                'id' => $candidateTwelve->id,
            ]
        )->assertJson([
            'errors' => [[
                'message' => 'pool candidate status InvalidValueDeletion',
            ]]
        ]);

        $this->graphQL(
            /** @lang Graphql */
            '
      mutation deleteTest($id: ID!) {
        deleteApplication(id: $id)
      }
    ',
            [
                'id' => $candidateThirteen->id,
            ]
        )->assertJson([
            'errors' => [[
                'message' => 'pool candidate status InvalidValueDeletion',
            ]]
        ]);


        $this->graphQL(
            /** @lang Graphql */
            '
      mutation deleteTest($id: ID!) {
        deleteApplication(id: $id)
      }
    ',
            [
                'id' => $candidateFourteen->id,
            ]
        )->assertJson([
            'errors' => [[
                'message' => 'pool candidate status InvalidValueDeletion',
            ]]
        ]);

    }
}
