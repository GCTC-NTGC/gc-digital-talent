<?php

namespace Tests\Feature;

use App\Models\AwardExperience;
use App\Models\Classification;
use App\Models\Pool;
use App\Models\PoolCandidate;
use App\Models\Skill;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Nuwave\Lighthouse\Testing\ClearsSchemaCache;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Tests\TestCase;
use Database\Helpers\ApiEnums;

class CountPoolCandidatesByPoolTest extends TestCase
{
    use RefreshDatabase;
    use MakesGraphQLRequests;
    use ClearsSchemaCache;

    protected function setUp(): void
    {
        parent::setUp();

        $this->bootClearsSchemaCache();

        // Create admin user we run tests as
        $newUser = new User;
        $newUser->email = 'admin@test.com';
        $newUser->sub = 'admin@test.com';
        $newUser->roles = ['ADMIN'];
        $newUser->save();
    }

    public function poolCandidateData(Pool $pool, User $user, ?bool $available = true, ?bool $futureDate = true) {
        return [
            'pool_id' => $pool,
            'user_id' => $user,
            'pool_candidate_status' => $available ? ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE : ApiEnums::CANDIDATE_STATUS_SCREENED_OUT_APPLICATION,
            'expiry_date' => $futureDate ? config('constants.far_future_date') : config('constants.past_date') ,
        ];
    }

    // user (admin) not returned if no candidates
    // the admin has no candidates so should get no results
    public function testThatEmptyDoesNotReturnTheAdmin()
    {
        $this->graphQL(
            /** @lang GraphQL */
            '
            query ($where: ApplicantFilterInput) {
                countPoolCandidatesByPool(where: $where) {
                  pool { id }
                  candidateCount
                }
              }
            ',
            [
                'where' => []
            ]
        )->assertSimilarJson([
            'data' => [
                'countPoolCandidatesByPool' => []
            ]
        ]);
    }

    // single candidate can be returned with no filters
    // creates a single candidate and expects it to be returned
    public function testThatEmptyReturnsACandidate()
    {
        $pool = Pool::factory()->create();
        $user = User::factory()->create([
            'job_looking_status' => ApiEnums::USER_STATUS_ACTIVELY_LOOKING
        ]);
        PoolCandidate::factory()->create($this->poolCandidateData($pool, $user));

        $this->graphQL(
            /** @lang GraphQL */
            '
            query ($where: ApplicantFilterInput) {
                countPoolCandidatesByPool(where: $where) {
                  pool { id }
                  candidateCount
                }
              }
            ',
            [
                'where' => []
            ]
        )->assertSimilarJson([
            'data' => [
                'countPoolCandidatesByPool' => [
                    [
                        'pool' => ['id' => $pool->id],
                        'candidateCount' => 1
                    ]
                ]
            ]
        ]);
    }

    // the attached pool can have its properties requested
    // creates a single candidate and expects it to be returned with the pool properties
    public function testThatPoolPropertiesCanBeReturned()
    {
        $pool = Pool::factory()->create([
            'name' => [
                'en' => 'Test Pool EN',
                'fr' => 'Test Pool FR'
            ]
        ]);
        $user = User::factory()->create([
            'job_looking_status' => ApiEnums::USER_STATUS_ACTIVELY_LOOKING
        ]);
        PoolCandidate::factory()->create($this->poolCandidateData($pool, $user));

        $this->graphQL(
            /** @lang GraphQL */
            '
            query ($where: ApplicantFilterInput) {
                countPoolCandidatesByPool(where: $where) {
                  pool {
                    id,
                    name { en, fr }
                  }
                  candidateCount
                }
              }
            ',
            [
                'where' => []
            ]
        )->assertSimilarJson([
            'data' => [
                'countPoolCandidatesByPool' => [
                    [
                        'pool' => [
                            'id' => $pool->id,
                            'name' => [
                                'en' => $pool->name['en'],
                                'fr' => $pool->name['fr']
                            ]
                        ],
                        'candidateCount' => 1
                    ]
                ]
            ]
        ]);
    }

    // single user returns two candidate is returned with no filters
    // creates one users with two candidates and expects both candidates to be returned
    public function testThatEmptyReturnsTwoCandidatesForOneUser()
    {
        $pool1 = Pool::factory()->create();
        $pool2 = Pool::factory()->create();
        $user = User::factory()->create([
            'job_looking_status' => ApiEnums::USER_STATUS_ACTIVELY_LOOKING
        ]);
        PoolCandidate::factory()->create($this->poolCandidateData($pool1, $user));
        PoolCandidate::factory()->create($this->poolCandidateData($pool2, $user));

        $this->graphQL(
            /** @lang GraphQL */
            '
                query ($where: ApplicantFilterInput) {
                    countPoolCandidatesByPool(where: $where) {
                      pool { id }
                      candidateCount
                    }
                  }
                ',
            [
                'where' => []
            ]
        )->assertSimilarJson([
            'data' => [
                'countPoolCandidatesByPool' => [
                    [
                        'pool' => ['id' => $pool1->id],
                        'candidateCount' => 1
                    ],
                    [
                        'pool' => ['id' => $pool2->id],
                        'candidateCount' => 1
                    ]
                ]
            ]
        ]);
    }

    // test that available for opportunities scope is working
    // creates a user for each user status and ensure that only the two come back
    public function testAvailableForOpportunities()
    {
        $pool = Pool::factory()->create();
        foreach (ApiEnums::userStatuses() as $status) {
            $user = User::factory()->create([
                'job_looking_status' => $status
            ]);
            PoolCandidate::factory()->create($this->poolCandidateData($pool, $user));
        }

        $this->graphQL(
            /** @lang GraphQL */
            '
                query ($where: ApplicantFilterInput) {
                    countPoolCandidatesByPool(where: $where) {
                      pool { id }
                      candidateCount
                    }
                  }
                ',
            [
                'where' => []
            ]
        )->assertSimilarJson([
            'data' => [
                'countPoolCandidatesByPool' => [
                    [
                        'pool' => ['id' => $pool->id],
                        'candidateCount' => 2
                    ]
                ]
            ]
        ]);
    }

    // test has diploma
    // creates three users with/without/null diploma and expects only one to come back
    public function testHasDiploma()
    {
        $pool = Pool::factory()->create();
        $user1 = User::factory()->create([
            'job_looking_status' => ApiEnums::USER_STATUS_ACTIVELY_LOOKING,
            'has_diploma' => true
        ]);
        $user2 = User::factory()->create([
            'job_looking_status' => ApiEnums::USER_STATUS_ACTIVELY_LOOKING,
            'has_diploma' => false
        ]);
        $user3 = User::factory()->create([
            'job_looking_status' => ApiEnums::USER_STATUS_ACTIVELY_LOOKING,
            'has_diploma' => null
        ]);
        PoolCandidate::factory()->create($this->poolCandidateData($pool, $user1));
        PoolCandidate::factory()->create($this->poolCandidateData($pool, $user2));
        PoolCandidate::factory()->create($this->poolCandidateData($pool, $user3));

        $this->graphQL(
            /** @lang GraphQL */
            '
                query ($where: ApplicantFilterInput) {
                    countPoolCandidatesByPool(where: $where) {
                      pool { id }
                      candidateCount
                    }
                  }
                ',
            [
                'where' => [
                    'hasDiploma' => true
                ]
            ]
        )->assertSimilarJson([
            'data' => [
                'countPoolCandidatesByPool' => [
                    [
                        'pool' => ['id' => $pool->id],
                        'candidateCount' => 1
                    ]
                ]
            ]
        ]);
    }

    // test equity - Is woman
    // creates three users with/without/null isWoman and expects only one to come back
    public function testEquityIsWoman()
    {
        $pool = Pool::factory()->create();
        $user1 = User::factory()->create([
            'job_looking_status' => ApiEnums::USER_STATUS_ACTIVELY_LOOKING,
            'is_woman' => true
        ]);
        $user2 = User::factory()->create([
            'job_looking_status' => ApiEnums::USER_STATUS_ACTIVELY_LOOKING,
            'is_woman' => false
        ]);
        $user3 = User::factory()->create([
            'job_looking_status' => ApiEnums::USER_STATUS_ACTIVELY_LOOKING,
            'is_woman' => null
        ]);
        PoolCandidate::factory()->create($this->poolCandidateData($pool, $user1));
        PoolCandidate::factory()->create($this->poolCandidateData($pool, $user2));
        PoolCandidate::factory()->create($this->poolCandidateData($pool, $user3));

        $this->graphQL(
            /** @lang GraphQL */
            '
                query ($where: ApplicantFilterInput) {
                    countPoolCandidatesByPool(where: $where) {
                      pool { id }
                      candidateCount
                    }
                  }
                ',
            [
                'where' => [
                    'equity' => [
                        'isWoman' => true
                    ]
                ]
            ]
        )->assertSimilarJson([
            'data' => [
                'countPoolCandidatesByPool' => [
                    [
                        'pool' => ['id' => $pool->id],
                        'candidateCount' => 1
                    ]
                ]
            ]
        ]);
    }

    // no tests for the other equity fields yet - assume if one works then they all work

    // test language ability
    // creates a user for bilingual, english, and french then filter for english and expect two to come back
    public function testLanguageAbility()
    {
        $pool = Pool::factory()->create();
        $user1 = User::factory()->create([
            'job_looking_status' => ApiEnums::USER_STATUS_ACTIVELY_LOOKING,
            'looking_for_english' => false,
            'looking_for_french' => false,
            'looking_for_bilingual' => true,
        ]);
        $user2 = User::factory()->create([
            'job_looking_status' => ApiEnums::USER_STATUS_ACTIVELY_LOOKING,
            'looking_for_english' => true,
            'looking_for_french' => false,
            'looking_for_bilingual' => false,
        ]);
        $user3 = User::factory()->create([
            'job_looking_status' => ApiEnums::USER_STATUS_ACTIVELY_LOOKING,
            'looking_for_english' => false,
            'looking_for_french' => true,
            'looking_for_bilingual' => false,
        ]);
        PoolCandidate::factory()->create($this->poolCandidateData($pool, $user1));
        PoolCandidate::factory()->create($this->poolCandidateData($pool, $user2));
        PoolCandidate::factory()->create($this->poolCandidateData($pool, $user3));

        $this->graphQL(
            /** @lang GraphQL */
            '
                query ($where: ApplicantFilterInput) {
                    countPoolCandidatesByPool(where: $where) {
                      pool { id }
                      candidateCount
                    }
                  }
                ',
            [
                'where' => [
                    'languageAbility' => ApiEnums::LANGUAGE_ABILITY_ENGLISH
                ]
            ]
        )->assertSimilarJson([
            'data' => [
                'countPoolCandidatesByPool' => [
                    [
                        'pool' => ['id' => $pool->id],
                        'candidateCount' => 1
                    ]
                ]
            ]
        ]);
    }

    // test operational requirements
    // creates a three users with different op reqs, filter for a combination that two users have, expect to get 2 candidates
    public function testOperationalRequirements()
    {
        $pool = Pool::factory()->create();
        $user1 = User::factory()->create([
            'job_looking_status' => ApiEnums::USER_STATUS_ACTIVELY_LOOKING,
            'accepted_operational_requirements' => [
                ApiEnums::OPERATIONAL_REQUIREMENT_DRIVERS_LICENSE,
                ApiEnums::OPERATIONAL_REQUIREMENT_ON_CALL
            ]
        ]);
        $user2 = User::factory()->create([
            'job_looking_status' => ApiEnums::USER_STATUS_ACTIVELY_LOOKING,
            'accepted_operational_requirements' => [
                ApiEnums::OPERATIONAL_REQUIREMENT_DRIVERS_LICENSE,
                ApiEnums::OPERATIONAL_REQUIREMENT_ON_CALL,
                ApiEnums::OPERATIONAL_REQUIREMENT_OVERTIME_OCCASIONAL
            ]
        ]);
        $user3 = User::factory()->create([
            'job_looking_status' => ApiEnums::USER_STATUS_ACTIVELY_LOOKING,
            'accepted_operational_requirements' => [
                ApiEnums::OPERATIONAL_REQUIREMENT_OVERTIME_OCCASIONAL
            ]
        ]);
        PoolCandidate::factory()->create($this->poolCandidateData($pool, $user1));
        PoolCandidate::factory()->create($this->poolCandidateData($pool, $user2));
        PoolCandidate::factory()->create($this->poolCandidateData($pool, $user3));

        $this->graphQL(
            /** @lang GraphQL */
            '
                query ($where: ApplicantFilterInput) {
                    countPoolCandidatesByPool(where: $where) {
                      pool { id }
                      candidateCount
                    }
                  }
                ',
            [
                'where' => [
                    'operationalRequirements' => [
                        ApiEnums::OPERATIONAL_REQUIREMENT_DRIVERS_LICENSE,
                        ApiEnums::OPERATIONAL_REQUIREMENT_ON_CALL
                    ]
                ]
            ]
        )->assertSimilarJson([
            'data' => [
                'countPoolCandidatesByPool' => [
                    [
                        'pool' => ['id' => $pool->id],
                        'candidateCount' => 2
                    ]
                ]
            ]
        ]);
    }

    // test location preferences
    // creates a three users with different location preferences, filter for a combination that two users have, expect to get 2 candidates
    public function testLocationPreferences()
    {
        $pool = Pool::factory()->create();
        $user1 = User::factory()->create([
            'job_looking_status' => ApiEnums::USER_STATUS_ACTIVELY_LOOKING,
            'location_preferences' => [
                ApiEnums::WORK_REGION_ATLANTIC,
                ApiEnums::WORK_REGION_BRITISH_COLUMBIA
            ]
        ]);
        $user2 = User::factory()->create([
            'job_looking_status' => ApiEnums::USER_STATUS_ACTIVELY_LOOKING,
            'location_preferences' => [
                ApiEnums::WORK_REGION_ATLANTIC,
                ApiEnums::WORK_REGION_BRITISH_COLUMBIA,
                ApiEnums::WORK_REGION_NATIONAL_CAPITAL
            ]
        ]);
        $user3 = User::factory()->create([
            'job_looking_status' => ApiEnums::USER_STATUS_ACTIVELY_LOOKING,
            'location_preferences' => [
                ApiEnums::WORK_REGION_NATIONAL_CAPITAL
            ]
        ]);
        PoolCandidate::factory()->create($this->poolCandidateData($pool, $user1));
        PoolCandidate::factory()->create($this->poolCandidateData($pool, $user2));
        PoolCandidate::factory()->create($this->poolCandidateData($pool, $user3));

        $this->graphQL(
            /** @lang GraphQL */
            '
                query ($where: ApplicantFilterInput) {
                    countPoolCandidatesByPool(where: $where) {
                      pool { id }
                      candidateCount
                    }
                  }
                ',
            [
                'where' => [
                    'locationPreferences' => [
                        ApiEnums::WORK_REGION_ATLANTIC,
                        ApiEnums::WORK_REGION_BRITISH_COLUMBIA
                    ]
                ]
            ]
        )->assertSimilarJson([
            'data' => [
                'countPoolCandidatesByPool' => [
                    [
                        'pool' => ['id' => $pool->id],
                        'candidateCount' => 2
                    ]
                ]
            ]
        ]);
    }

    // test position duration
    // creates a three users with/without/null would accept temporary and expects only one to come back
    public function testWouldAcceptTemporary()
    {
        $pool = Pool::factory()->create();
        $user1 = User::factory()->create([
            'job_looking_status' => ApiEnums::USER_STATUS_ACTIVELY_LOOKING,
            'position_duration' => [ApiEnums::POSITION_DURATION_TEMPORARY, ApiEnums::POSITION_DURATION_PERMANENT],
        ]);
        $user2 = User::factory()->create([
            'job_looking_status' => ApiEnums::USER_STATUS_ACTIVELY_LOOKING,
            'position_duration' => [ApiEnums::POSITION_DURATION_PERMANENT],
        ]);
        $user3 = User::factory()->create([
            'job_looking_status' => ApiEnums::USER_STATUS_ACTIVELY_LOOKING,
            'position_duration' => null,
        ]);
        PoolCandidate::factory()->create($this->poolCandidateData($pool, $user1));
        PoolCandidate::factory()->create($this->poolCandidateData($pool, $user2));
        PoolCandidate::factory()->create($this->poolCandidateData($pool, $user3));

        $this->graphQL(
            /** @lang GraphQL */
            '
                query ($where: ApplicantFilterInput) {
                    countPoolCandidatesByPool(where: $where) {
                      pool { id }
                      candidateCount
                    }
                  }
                ',
            [
                'where' => [
                    'positionDuration' => [ApiEnums::POSITION_DURATION_TEMPORARY],
                ]
            ]
        )->assertSimilarJson([
            'data' => [
                'countPoolCandidatesByPool' => [
                    [
                        'pool' => ['id' => $pool->id],
                        'candidateCount' => 1
                    ]
                ]
            ]
        ]);
    }

    // test classifications
    // creates a three users various expected classifications and filter for the classifications on two of them
    public function testClassifications()
    {
        $pool = Pool::factory()->create();
        $classifications = Classification::factory(3)
            ->create(
                ['min_salary' => 0,  'max_salary' => 0] // avoid classification/salary cross-matching
            );
        $users = User::factory(3)
            ->afterCreating(function ($user) use ($pool) {
                PoolCandidate::factory()->create($this->poolCandidateData($pool, $user));
            })
            ->create([
                'job_looking_status' => ApiEnums::USER_STATUS_ACTIVELY_LOOKING
            ]);
        $users[0]->expectedClassifications()->sync([
            $classifications[0]->id,
            $classifications[1]->id
        ]);
        $users[1]->expectedClassifications()->sync([
            $classifications[1]->id,
            $classifications[2]->id
        ]);
        $users[2]->expectedClassifications()->sync([
            $classifications[2]->id
        ]);

        $this->graphQL(
            /** @lang GraphQL */
            '
                query ($where: ApplicantFilterInput) {
                    countPoolCandidatesByPool(where: $where) {
                      pool { id }
                      candidateCount
                    }
                  }
                ',
            [
                'where' => [
                    'expectedClassifications' => [
                        [
                            'group' => $classifications[0]->group,
                            'level' => $classifications[0]->level,
                        ],
                        [
                            'group' => $classifications[1]->group,
                            'level' => $classifications[1]->level,
                        ]
                    ]
                ]
            ]
        )->assertSimilarJson([
            'data' => [
                'countPoolCandidatesByPool' => [
                    [
                        'pool' => ['id' => $pool->id],
                        'candidateCount' => 2
                    ]
                ]
            ]
        ]);
    }

    // test skills
    // creates a three users various skills and filter for the skills on two of them
    public function testSkills()
    {
        $pool = Pool::factory()->create();
        $skills = Skill::factory(3)->create();
        $users = User::factory(3)
            ->afterCreating(function ($user) use ($pool) {
                $exp = AwardExperience::factory()->create(['user_id' => $user->id]);
                PoolCandidate::factory()->create($this->poolCandidateData($pool, $user));
            })
            ->create(['job_looking_status' => ApiEnums::USER_STATUS_ACTIVELY_LOOKING]);

        $users[0]->awardExperiences()->sole()->skills()->sync([
            $skills[0]->id,
            $skills[1]->id
        ]);
        $users[1]->awardExperiences()->sole()->skills()->sync([
            $skills[0]->id,
            $skills[1]->id,
            $skills[2]->id
        ]);
        $users[2]->awardExperiences()->sole()->skills()->sync([
            $skills[2]->id
        ]);

        $this->graphQL(
            /** @lang GraphQL */
            '
                query ($where: ApplicantFilterInput) {
                    countPoolCandidatesByPool(where: $where) {
                      pool { id }
                      candidateCount
                    }
                  }
                ',
            [
                'where' => [
                    'skills' => [
                        ['id' => $skills[0]->id],
                        ['id' => $skills[1]->id]
                    ]
                ]
            ]
        )->assertSimilarJson([
            'data' => [
                'countPoolCandidatesByPool' => [
                    [
                        'pool' => ['id' => $pool->id],
                        'candidateCount' => 2
                    ]
                ]
            ]
        ]);
    }

    // test pool filter
    // creates three pools but filters on only 1 and 2
    public function testPoolFilter()
    {
        $pool1 = Pool::factory()->create();
        $pool2 = Pool::factory()->create();
        $pool3 = Pool::factory()->create();
        $user = User::factory()->create([
            'job_looking_status' => ApiEnums::USER_STATUS_ACTIVELY_LOOKING
        ]);

        PoolCandidate::factory()->create($this->poolCandidateData($pool1, $user));
        PoolCandidate::factory()->create($this->poolCandidateData($pool2, $user));
        PoolCandidate::factory()->create($this->poolCandidateData($pool3, $user));

        $this->graphQL(
            /** @lang GraphQL */
            '
                query ($where: ApplicantFilterInput) {
                    countPoolCandidatesByPool(where: $where) {
                      pool { id }
                      candidateCount
                    }
                  }
                ',
            [
                'where' => [
                    "pools" => [
                        ["id" => $pool1->id],
                        ["id" => $pool2->id]
                    ]
                ]
            ]
        )->assertSimilarJson([
            'data' => [
                'countPoolCandidatesByPool' => [
                    [
                        'pool' => ['id' => $pool1->id],
                        'candidateCount' => 1
                    ],
                    [
                        'pool' => ['id' => $pool2->id],
                        'candidateCount' => 1
                    ]
                ]
            ]
        ]);
    }

    public function testAvailableScope()
    {
        $pool = Pool::factory()->create();
        foreach (ApiEnums::candidateStatuses() as $status) {
            $user = User::factory()->create([
                'job_looking_status' => ApiEnums::USER_STATUS_ACTIVELY_LOOKING
            ]);
            PoolCandidate::factory()->create([
                'pool_id' => $pool,
                'user_id' => $user,
                'pool_candidate_status' => $status,
                'expiry_date' => config('constants.far_future_date')
            ]);
        }

        $this->graphQL(
            /** @lang GraphQL */
            '
                query ($where: ApplicantFilterInput) {
                    countPoolCandidatesByPool(where: $where) {
                      pool { id }
                      candidateCount
                    }
                  }
                ',
            [
                'where' => []
            ]
        )->assertSimilarJson([
            'data' => [
                'countPoolCandidatesByPool' => [
                    [
                        'pool' => ['id' => $pool->id],
                        'candidateCount' => 2
                    ]
                ]
            ]
        ]);
    }

    public function testExpiryFilter()
    {
        $pool1 = Pool::factory()->create();
        $pool2 = Pool::factory()->create();
        $user = User::factory()->create([
            'job_looking_status' => ApiEnums::USER_STATUS_ACTIVELY_LOOKING
        ]);

        PoolCandidate::factory()->create($this->poolCandidateData($pool1, $user, true, true)); // future expiry date
        PoolCandidate::factory()->create($this->poolCandidateData($pool2, $user, true, false)); // past expiry date

        $this->graphQL(
            /** @lang GraphQL */
            '
                query ($where: ApplicantFilterInput) {
                    countPoolCandidatesByPool(where: $where) {
                      pool { id }
                      candidateCount
                    }
                  }
                ',
            [
                'where' => []
            ]
        )->assertSimilarJson([
            'data' => [
                'countPoolCandidatesByPool' => [
                    [
                        'pool' => ['id' => $pool1->id],
                        'candidateCount' => 1
                    ]
                ]
            ]
        ]);
    }
}
