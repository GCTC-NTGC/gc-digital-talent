<?php

namespace Tests\Feature;

use App\Enums\LanguageAbility;
use App\Enums\OperationalRequirement;
use App\Enums\PoolCandidateStatus;
use App\Enums\PositionDuration;
use App\Enums\PublishingGroup;
use App\Enums\WorkRegion;
use App\Models\AwardExperience;
use App\Models\Pool;
use App\Models\PoolCandidate;
use App\Models\Skill;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Tests\TestCase;

class CountPoolCandidatesByPoolTest extends TestCase
{
    use MakesGraphQLRequests;
    use RefreshDatabase;
    use RefreshesSchemaCache;

    protected function setUp(): void
    {
        parent::setUp();

        $this->bootRefreshesSchemaCache();

        $this->seed(RolePermissionSeeder::class);
    }

    public function poolCandidateData(Pool $pool, User $user, ?bool $available = true, ?bool $futureDate = true)
    {
        return [
            'pool_id' => $pool,
            'user_id' => $user,
            'pool_candidate_status' => $available ? PoolCandidateStatus::QUALIFIED_AVAILABLE->name : PoolCandidateStatus::SCREENED_OUT_APPLICATION->name,
            'expiry_date' => $futureDate ? config('constants.far_future_date') : config('constants.past_date'),
        ];
    }

    public function poolData(?bool $published = true)
    {
        return [
            'published_at' => $published ? config('constants.past_date') : null,
        ];
    }

    // The user has no candidates so should get no results
    public function testEmptyDoesNotReturnUserWithNoCandidates()
    {
        // Create user to test for
        User::factory()->create();

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
                'where' => [],
            ]
        )->assertSimilarJson([
            'data' => [
                'countPoolCandidatesByPool' => [],
            ],
        ]);
    }

    // single candidate can be returned with no filters
    // creates a single candidate and expects it to be returned
    public function testThatEmptyReturnsACandidate()
    {
        $pool = Pool::factory()->candidatesAvailableInSearch()->create($this->poolData());
        $user = User::factory()->create([]);
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
                'where' => [],
            ]
        )->assertSimilarJson([
            'data' => [
                'countPoolCandidatesByPool' => [
                    [
                        'pool' => ['id' => $pool->id],
                        'candidateCount' => 1,
                    ],
                ],
            ],
        ]);
    }

    // the attached pool can have its properties requested
    // creates a single candidate and expects it to be returned with the pool properties
    public function testThatPoolPropertiesCanBeReturned()
    {
        $pool = Pool::factory()->published()->candidatesAvailableInSearch()->create([
            'name' => [
                'en' => 'Test Pool EN',
                'fr' => 'Test Pool FR',
            ],
        ]);
        $user = User::factory()->create([]);
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
                'where' => [],
            ]
        )->assertSimilarJson([
            'data' => [
                'countPoolCandidatesByPool' => [
                    [
                        'pool' => [
                            'id' => $pool->id,
                            'name' => [
                                'en' => $pool->name['en'],
                                'fr' => $pool->name['fr'],
                            ],
                        ],
                        'candidateCount' => 1,
                    ],
                ],
            ],
        ]);
    }

    // single user returns two candidate is returned with no filters
    // creates one users with two candidates and expects both candidates to be returned
    public function testThatEmptyReturnsTwoCandidatesForOneUser()
    {
        $pool1 = Pool::factory()->candidatesAvailableInSearch()->create($this->poolData());
        $pool2 = Pool::factory()->candidatesAvailableInSearch()->create($this->poolData());
        $user = User::factory()->create([]);
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
                'where' => [],
            ]
        )->assertSimilarJson([
            'data' => [
                'countPoolCandidatesByPool' => [
                    [
                        'pool' => ['id' => $pool1->id],
                        'candidateCount' => 1,
                    ],
                    [
                        'pool' => ['id' => $pool2->id],
                        'candidateCount' => 1,
                    ],
                ],
            ],
        ]);
    }

    // test has diploma
    // creates three users with/without/null diploma and expects only one to come back
    public function testHasDiploma()
    {
        $pool = Pool::factory()->candidatesAvailableInSearch()->create($this->poolData());
        $user1 = User::factory()->create([
            'has_diploma' => true,
        ]);
        $user2 = User::factory()->create([
            'has_diploma' => false,
        ]);
        $user3 = User::factory()->create([
            'has_diploma' => null,
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
                    'hasDiploma' => true,
                ],
            ]
        )->assertSimilarJson([
            'data' => [
                'countPoolCandidatesByPool' => [
                    [
                        'pool' => ['id' => $pool->id],
                        'candidateCount' => 1,
                    ],
                ],
            ],
        ]);
    }

    // test equity - Is woman
    // creates three users with/without/null isWoman and expects only one to come back
    public function testEquityIsWoman()
    {
        $pool = Pool::factory()->candidatesAvailableInSearch()->create($this->poolData());
        $user1 = User::factory()->create([
            'is_woman' => true,
        ]);
        $user2 = User::factory()->create([
            'is_woman' => false,
        ]);
        $user3 = User::factory()->create([
            'is_woman' => null,
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
                        'isWoman' => true,
                    ],
                ],
            ]
        )->assertSimilarJson([
            'data' => [
                'countPoolCandidatesByPool' => [
                    [
                        'pool' => ['id' => $pool->id],
                        'candidateCount' => 1,
                    ],
                ],
            ],
        ]);
    }

    // no tests for the other equity fields yet - assume if one works then they all work

    // test language ability
    // creates a user for bilingual, english, and french then filter for english and expect two to come back
    public function testLanguageAbility()
    {
        $pool = Pool::factory()->candidatesAvailableInSearch()->create($this->poolData());
        $user1 = User::factory()->create([
            'looking_for_english' => false,
            'looking_for_french' => false,
            'looking_for_bilingual' => true,
        ]);
        $user2 = User::factory()->create([
            'looking_for_english' => true,
            'looking_for_french' => false,
            'looking_for_bilingual' => false,
        ]);
        $user3 = User::factory()->create([
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
                    'languageAbility' => LanguageAbility::ENGLISH->name,
                ],
            ]
        )->assertSimilarJson([
            'data' => [
                'countPoolCandidatesByPool' => [
                    [
                        'pool' => ['id' => $pool->id],
                        'candidateCount' => 1,
                    ],
                ],
            ],
        ]);
    }

    // test operational requirements
    // creates a three users with different op reqs, filter for a combination that two users have, expect to get 2 candidates
    public function testOperationalRequirements()
    {
        $pool = Pool::factory()->candidatesAvailableInSearch()->create($this->poolData());
        $user1 = User::factory()->create([
            'accepted_operational_requirements' => [
                OperationalRequirement::DRIVERS_LICENSE->name,
                OperationalRequirement::ON_CALL->name,
            ],
        ]);
        $user2 = User::factory()->create([
            'accepted_operational_requirements' => [
                OperationalRequirement::DRIVERS_LICENSE->name,
                OperationalRequirement::ON_CALL->name,
                OperationalRequirement::OVERTIME_OCCASIONAL->name,
            ],
        ]);
        $user3 = User::factory()->create([
            'accepted_operational_requirements' => [
                OperationalRequirement::OVERTIME_OCCASIONAL->name,
            ],
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
                        OperationalRequirement::DRIVERS_LICENSE->name,
                        OperationalRequirement::ON_CALL->name,
                    ],
                ],
            ]
        )->assertSimilarJson([
            'data' => [
                'countPoolCandidatesByPool' => [
                    [
                        'pool' => ['id' => $pool->id],
                        'candidateCount' => 2,
                    ],
                ],
            ],
        ]);
    }

    // test location preferences
    // creates a three users with different location preferences, filter for a combination that two users have, expect to get 2 candidates
    public function testLocationPreferences()
    {
        $pool = Pool::factory()->candidatesAvailableInSearch()->create($this->poolData());
        $user1 = User::factory()->create([
            'location_preferences' => [
                WorkRegion::ATLANTIC->name,
                WorkRegion::BRITISH_COLUMBIA->name,
            ],
        ]);
        $user2 = User::factory()->create([
            'location_preferences' => [
                WorkRegion::ATLANTIC->name,
                WorkRegion::BRITISH_COLUMBIA->name,
                WorkRegion::NATIONAL_CAPITAL->name,
            ],
        ]);
        $user3 = User::factory()->create([
            'location_preferences' => [
                WorkRegion::NATIONAL_CAPITAL->name,
            ],
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
                        WorkRegion::ATLANTIC->name,
                        WorkRegion::BRITISH_COLUMBIA->name,
                    ],
                ],
            ]
        )->assertSimilarJson([
            'data' => [
                'countPoolCandidatesByPool' => [
                    [
                        'pool' => ['id' => $pool->id],
                        'candidateCount' => 2,
                    ],
                ],
            ],
        ]);
    }

    // test position duration
    // creates a three users with/without/null would accept temporary and expects only one to come back
    public function testWouldAcceptTemporary()
    {
        $pool = Pool::factory()->candidatesAvailableInSearch()->create($this->poolData());
        $user1 = User::factory()->create([
            'position_duration' => array_column(PositionDuration::cases(), 'name'),
        ]);
        $user2 = User::factory()->create([
            'position_duration' => [PositionDuration::PERMANENT->name],
        ]);
        $user3 = User::factory()->create([
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
                    'positionDuration' => [PositionDuration::TEMPORARY->name],
                ],
            ]
        )->assertSimilarJson([
            'data' => [
                'countPoolCandidatesByPool' => [
                    [
                        'pool' => ['id' => $pool->id],
                        'candidateCount' => 1,
                    ],
                ],
            ],
        ]);
    }

    // test skills
    // creates a three users various skills and filter for the skills on two of them
    // filtering is OR using User::scopeSkillsAdditive
    public function testSkills()
    {
        $pool = Pool::factory()->candidatesAvailableInSearch()->create($this->poolData());
        $skills = Skill::factory(3)->create();
        $users = User::factory(3)
            ->afterCreating(function ($user) use ($pool) {
                $exp = AwardExperience::factory()->create(['user_id' => $user->id]);
                PoolCandidate::factory()->create($this->poolCandidateData($pool, $user));
            })
            ->create();

        $users[0]->awardExperiences()->sole()->syncSkills([
            $skills[0],
        ]);
        $users[1]->awardExperiences()->sole()->syncSkills([
            $skills[0],
            $skills[1],
            $skills[2],
        ]);
        $users[2]->awardExperiences()->sole()->syncSkills([
            $skills[2],
        ]);

        // ensure 2 candidates returned despite two skills being passed in
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
                        ['id' => $skills[1]->id],
                        ['id' => $skills[2]->id],
                    ],
                ],
            ]
        )->assertSimilarJson([
            'data' => [
                'countPoolCandidatesByPool' => [
                    [
                        'pool' => ['id' => $pool->id],
                        'candidateCount' => 2,
                    ],
                ],
            ],
        ]);
    }

    // test pool filter
    // creates three pools but filters on only 1 and 2
    public function testPoolFilter()
    {
        $pool1 = Pool::factory()->candidatesAvailableInSearch()->create($this->poolData());
        $pool2 = Pool::factory()->candidatesAvailableInSearch()->create($this->poolData());
        $pool3 = Pool::factory()->candidatesAvailableInSearch()->create($this->poolData());
        $user = User::factory()->create([]);

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
                    'pools' => [
                        ['id' => $pool1->id],
                        ['id' => $pool2->id],
                    ],
                ],
            ]
        )->assertSimilarJson([
            'data' => [
                'countPoolCandidatesByPool' => [
                    [
                        'pool' => ['id' => $pool1->id],
                        'candidateCount' => 1,
                    ],
                    [
                        'pool' => ['id' => $pool2->id],
                        'candidateCount' => 1,
                    ],
                ],
            ],
        ]);
    }

    public function testAvailableScope()
    {
        $pool = Pool::factory()->candidatesAvailableInSearch()->create($this->poolData());
        foreach (PoolCandidateStatus::cases() as $status) {
            $user = User::factory()->create([]);
            PoolCandidate::factory()->create([
                'pool_id' => $pool,
                'user_id' => $user,
                'pool_candidate_status' => $status->name,
                'expiry_date' => config('constants.far_future_date'),
            ]);
        }

        $user2 = User::factory()->create([]);
        $user3 = User::factory()->create([]);
        PoolCandidate::factory()->create([
            'pool_id' => $pool,
            'user_id' => $user2,
            'pool_candidate_status' => PoolCandidateStatus::QUALIFIED_AVAILABLE->name,
            'expiry_date' => config('constants.far_future_date'),
            'suspended_at' => config('constants.far_future_date'),
        ]);
        PoolCandidate::factory()->create([
            'pool_id' => $pool,
            'user_id' => $user3,
            'pool_candidate_status' => PoolCandidateStatus::QUALIFIED_AVAILABLE->name,
            'expiry_date' => config('constants.far_future_date'),
            'suspended_at' => config('constants.past_date'),
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
                'where' => [],
            ]
        )->assertSimilarJson([
            'data' => [
                'countPoolCandidatesByPool' => [
                    [
                        'pool' => ['id' => $pool->id],
                        'candidateCount' => 3,
                    ],
                ],
            ],
        ]);
    }

    public function testExpiryFilter()
    {
        $pool1 = Pool::factory()->candidatesAvailableInSearch()->create($this->poolData());
        $pool2 = Pool::factory()->candidatesAvailableInSearch()->create($this->poolData());
        $user = User::factory()->create([]);

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
                'where' => [],
            ]
        )->assertSimilarJson([
            'data' => [
                'countPoolCandidatesByPool' => [
                    [
                        'pool' => ['id' => $pool1->id],
                        'candidateCount' => 1,
                    ],
                ],
            ],
        ]);
    }

    public function testOnlyItJobsAppear()
    {
        $user = User::factory()->create([]);

        $itPool = Pool::factory()->create([
            ...$this->poolData(),
            'publishing_group' => PublishingGroup::IT_JOBS->name,
        ]);
        PoolCandidate::factory()->create($this->poolCandidateData($itPool, $user, true));

        $itOngoingPool = Pool::factory()->create([
            ...$this->poolData(),
            'publishing_group' => PublishingGroup::IT_JOBS_ONGOING->name,
        ]);
        PoolCandidate::factory()->create($this->poolCandidateData($itOngoingPool, $user, true));

        // Note: Should not appear in results
        $execPool = Pool::factory()->create([
            ...$this->poolData(),
            'publishing_group' => PublishingGroup::EXECUTIVE_JOBS->name,
        ]);
        PoolCandidate::factory()->create($this->poolCandidateData($execPool, $user, true));

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
                    'pools' => [
                        ['id' => $itPool->id],
                        ['id' => $itOngoingPool->id],
                        ['id' => $execPool->id], // Should not show up
                    ],
                ],
            ]
        )->assertSimilarJson([
            'data' => [
                'countPoolCandidatesByPool' => [
                    [
                        'pool' => ['id' => $itOngoingPool->id],
                        'candidateCount' => 1,
                    ],
                    [
                        'pool' => ['id' => $itPool->id],
                        'candidateCount' => 1,
                    ],
                ],
            ],
        ]);
    }
}
