<?php

use App\Models\User;
use App\Models\Pool;
use App\Models\PoolCandidate;
use App\Models\Classification;
use App\Models\Skill;
use App\Models\AwardExperience;
use App\Models\CommunityExperience;
use App\Models\PersonalExperience;
use App\Models\WorkExperience;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Nuwave\Lighthouse\Testing\ClearsSchemaCache;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Tests\TestCase;
use Database\Helpers\ApiEnums;

class ApplicantTest extends TestCase
{
    use RefreshDatabase;
    use MakesGraphQLRequests;
    use ClearsSchemaCache;

    protected function setUp(): void
    {
        parent::setUp();
        $this->bootClearsSchemaCache();

        // Create admin user we run tests as
        // Note: this extra user does change the results of a couple queries
        $newUser = new User;
        $newUser->email = 'admin@test.com';
        $newUser->sub = 'admin@test.com';
        $newUser->roles = ['ADMIN'];
        $newUser->save();
    }

    public function testCountApplicantsQuery(): void
    {
        // Get the ID of the base admin user
        $user = User::All()->first();
        $pool1 = Pool::factory()->create([
            'user_id' => $user['id']
        ]);
        $pool2 = Pool::factory()->create([
            'user_id' => $user['id']
        ]);

        PoolCandidate::factory()->count(3)->create([
            'pool_id' => $pool1['id'],
            'expiry_date' => config('constants.far_future_date'),
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE,
            'user_id' => User::factory([
                'job_looking_status' => ApiEnums::USER_STATUS_ACTIVELY_LOOKING,
            ])
        ]);

        PoolCandidate::factory()->count(4)->create([
            'pool_id' => $pool2['id'],
            'expiry_date' => config('constants.far_future_date'),
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE,
            'user_id' => User::factory([
                'job_looking_status' => ApiEnums::USER_STATUS_ACTIVELY_LOOKING,
            ])
        ]);

        // Assert empty filter returns all
        $this->graphQL(
            /** @lang Graphql */
            '
            query countApplicants($where: ApplicantFilterInput) {
                countApplicants (where: $where)
            }
        ',
            [
                'where' => []
            ]
        )->assertJson([
            'data' => [
                'countApplicants' => 7
            ]
        ]);

        // Assert pool1 filter returns only pool1
        $this->graphQL(
            /** @lang Graphql */
            '
            query countApplicants($where: ApplicantFilterInput) {
                countApplicants (where: $where)
            }
        ',
            [
                'where' => [
                    'pools' => [
                        ['id' => $pool1['id']]
                    ]
                ]
            ]
        )->assertJson([
            'data' => [
                'countApplicants' => 3
            ]
        ]);
    }

    public function testCountApplicantsQueryEquity(): void
    {
        // Get the ID of the base admin user
        $user = User::All()->first();
        $pool1 = Pool::factory()->create([
            'user_id' => $user['id']
        ]);

        PoolCandidate::factory()->count(3)->create([
            'pool_id' => $pool1['id'],
            'expiry_date' => config('constants.far_future_date'),
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE,
            'user_id' => User::factory([
                'job_looking_status' => ApiEnums::USER_STATUS_ACTIVELY_LOOKING,
                'is_woman' => false,
                'has_disability' => false,
                'is_indigenous' => false,
                'is_visible_minority' => false,
            ])
        ]);

        PoolCandidate::factory()->create([
            'pool_id' => $pool1['id'],
            'expiry_date' => config('constants.far_future_date'),
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE,
            'user_id' => User::factory([
                'job_looking_status' => ApiEnums::USER_STATUS_ACTIVELY_LOOKING,
                'is_woman' => true,
                'has_disability' => false,
                'is_indigenous' => false,
                'is_visible_minority' => false,
            ])
        ]);

        PoolCandidate::factory()->create([
            'pool_id' => $pool1['id'],
            'expiry_date' => config('constants.far_future_date'),
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE,
            'user_id' => User::factory([
                'job_looking_status' => ApiEnums::USER_STATUS_ACTIVELY_LOOKING,
                'is_woman' => true,
                'has_disability' => true,
                'is_indigenous' => false,
                'is_visible_minority' => false,
            ])
        ]);

        // Assert query with only pools filter will return proper count
        $this->graphQL(
            /** @lang Graphql */
            '
            query countApplicants($where: ApplicantFilterInput) {
                countApplicants (where: $where)
            }
        ',
            [
                'where' => [
                    'pools' => [
                        ['id' => $pool1['id']]
                    ]
                ]
            ]
        )->assertJson([
            'data' => [
                'countApplicants' => 5
            ]
        ]);

        // Assert query with false equity filter will return same as above
        $this->graphQL(
            /** @lang Graphql */
            '
            query countApplicants($where: ApplicantFilterInput) {
                countApplicants (where: $where)
            }
        ',
            [
                'where' => [
                    'pools' => [
                        ['id' => $pool1['id']],
                    ],
                    'equity' => [
                        'isWoman' => false,
                        'hasDisability' => false,
                        'isIndigenous' => false,
                        'isVisibleMinority' => false,
                    ],
                ]
            ]
        )->assertJson([
            'data' => [
                'countApplicants' => 5
            ]
        ]);

        // Assert query will OR filter the equity
        $this->graphQL(
            /** @lang Graphql */
            '
            query countApplicants($where: ApplicantFilterInput) {
                countApplicants (where: $where)
            }
        ',
            [
                'where' => [
                    'pools' => [
                        ['id' => $pool1['id']],
                    ],
                    'equity' => [
                        'isWoman' => true,
                        'hasDisability' => true,
                    ],
                ]
            ]
        )->assertJson([
            'data' => [
                'countApplicants' => 2
            ]
        ]);
    }

    public function testCountApplicantsQueryLanguage(): void
    {
        $user = User::All()->first();
        $pool1 = Pool::factory()->create([
            'user_id' => $user['id']
        ]);

        PoolCandidate::factory()->count(1)->create([
            'pool_id' => $pool1['id'],
            'expiry_date' => config('constants.far_future_date'),
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE,
            'user_id' => User::factory([
                'language_ability' => ApiEnums::LANGUAGE_ABILITY_ENGLISH,
                'job_looking_status' => ApiEnums::USER_STATUS_ACTIVELY_LOOKING
            ])
        ]);

        PoolCandidate::factory()->count(2)->create([
            'pool_id' => $pool1['id'],
            'expiry_date' => config('constants.far_future_date'),
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE,
            'user_id' => User::factory([
                'language_ability' => ApiEnums::LANGUAGE_ABILITY_FRENCH,
                'job_looking_status' => ApiEnums::USER_STATUS_ACTIVELY_LOOKING,
            ])
        ]);

        PoolCandidate::factory()->count(4)->create([
            'pool_id' => $pool1['id'],
            'expiry_date' => config('constants.far_future_date'),
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE,
            'user_id' => User::factory([
                'language_ability' => ApiEnums::LANGUAGE_ABILITY_BILINGUAL,
                'job_looking_status' => ApiEnums::USER_STATUS_ACTIVELY_LOOKING,
            ])
        ]);

        // Assert query with english filter will return proper count, including the bilingual candidates
        $this->graphQL(
            /** @lang Graphql */
            '
            query countApplicants($where: ApplicantFilterInput) {
                countApplicants (where: $where)
            }
        ',
            [
                'where' => [
                    'pools' => [
                        ['id' => $pool1['id']]
                    ],
                    'languageAbility' => ApiEnums::LANGUAGE_ABILITY_ENGLISH
                ]
            ]
        )->assertJson([
            'data' => [
                'countApplicants' => 5
            ]
        ]);

        // Assert query with french filter will return proper count, including the bilingual candidates
        $this->graphQL(
            /** @lang Graphql */
            '
            query countApplicants($where: ApplicantFilterInput) {
                countApplicants (where: $where)
            }
        ',
            [
                'where' => [
                    'pools' => [
                        ['id' => $pool1['id']]
                    ],
                    'languageAbility' => ApiEnums::LANGUAGE_ABILITY_FRENCH
                ]
            ]
        )->assertJson([
            'data' => [
                'countApplicants' => 6
            ]
        ]);

        // Assert query with bilingual filter will return proper count, only the bilingual candidates
        $this->graphQL(
            /** @lang Graphql */
            '
            query countApplicants($where: ApplicantFilterInput) {
                countApplicants (where: $where)
            }
        ',
            [
                'where' => [
                    'pools' => [
                        ['id' => $pool1['id']]
                    ],
                    'languageAbility' => ApiEnums::LANGUAGE_ABILITY_BILINGUAL
                ]
            ]
        )->assertJson([
            'data' => [
                'countApplicants' => 4
            ]
        ]);
    }

    public function testCountApplicantsQuerySalaryClassifications(): void
    {
        // Recycling salary/classification tests //
        $user = User::All()->first();
        $pool1 = Pool::factory()->create([
            'user_id' => $user['id'],
        ]);

        PoolCandidate::factory()->count(1)->create([
            'pool_id' => $pool1['id'],
            'expiry_date' => config('constants.far_future_date'),
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE,
            'user_id' => User::factory([
                'job_looking_status' => ApiEnums::USER_STATUS_ACTIVELY_LOOKING,
                'expected_salary' => [],
            ])
        ]);

        PoolCandidate::factory()->count(2)->sequence(fn () => [
            'pool_id' => $pool1->id,
            'expiry_date' => config('constants.far_future_date'),
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE,
            'user_id' => User::factory([
                'job_looking_status' => ApiEnums::USER_STATUS_ACTIVELY_LOOKING,
                'expected_salary' => ['_50_59K', '_70_79K'],
            ])
        ])->for($user)->afterCreating(function (PoolCandidate $candidate) use ($user) {
            $classificationLvl1 = Classification::factory()->create([
                'group' => 'ZZ',
                'level' => 1,
                'min_salary' => 50000,
                'max_salary' => 69000,
            ]);
            $candidate->expectedClassifications()->sync($classificationLvl1);
        })->create();

        PoolCandidate::factory()->count(4)->sequence(fn () => [
            'pool_id' => $pool1->id,
            'expiry_date' => config('constants.far_future_date'),
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE,
            'user_id' => User::factory([
                'job_looking_status' => ApiEnums::USER_STATUS_ACTIVELY_LOOKING,
                'expected_salary' => ['_60_69K', '_80_89K'],
            ])
        ])->for($user)->afterCreating(function (PoolCandidate $candidate) use ($user) {
            $candidate->expectedClassifications()->delete();
        })->create();

        PoolCandidate::factory()->count(11)->sequence(fn () => [
            'pool_id' => $pool1->id,
            'expiry_date' => config('constants.far_future_date'),
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE,
            'user_id' => User::factory([
                'job_looking_status' => ApiEnums::USER_STATUS_ACTIVELY_LOOKING,
                'expected_salary' => ['_90_99K', '_100K_PLUS']
            ])
        ])->for($user)->afterCreating(function (PoolCandidate $candidate) use ($user) {
            $candidate->expectedClassifications()->delete();
        })->create();

        // Assert query with just pool filter
        $this->graphQL(
            /** @lang Graphql */
            '
            query countApplicants($where: ApplicantFilterInput) {
                countApplicants (where: $where)
            }
        ',
            [
                'where' => [
                    'pools' => [
                        ['id' => $pool1['id']]
                    ],
                ]
            ]
        )->assertJson([
            'data' => [
                'countApplicants' => 18
            ]
        ]);

        // Assert query to test classification-salary
        $this->graphQL(
            /** @lang Graphql */
            '
            query countApplicants($where: ApplicantFilterInput) {
                countApplicants (where: $where)
            }
        ',
            [
                'where' => [
                    'pools' => [
                        ['id' => $pool1['id']]
                    ],
                    'expectedClassifications' => [['group' => 'ZZ', 'level' => 1]],
                ]
            ]
        )->assertJson([
            'data' => [
                'countApplicants' => 6
            ]
        ]);
    }

    public function testCountApplicantsQueryEducation(): void
    {
        $user = User::All()->first();
        $pool1 = Pool::factory()->create([
            'user_id' => $user['id']
        ]);

        PoolCandidate::factory()->count(3)->create([
            'pool_id' => $pool1['id'],
            'expiry_date' => config('constants.far_future_date'),
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE,
            'user_id' => User::factory([
                'has_diploma' => false,
                'job_looking_status' => ApiEnums::USER_STATUS_ACTIVELY_LOOKING
            ])
        ]);

        PoolCandidate::factory()->count(4)->create([
            'pool_id' => $pool1['id'],
            'expiry_date' => config('constants.far_future_date'),
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE,
            'user_id' => User::factory([
                'has_diploma' => true,
                'job_looking_status' => ApiEnums::USER_STATUS_ACTIVELY_LOOKING
            ])
        ]);

        // Assert query with false filter
        $this->graphQL(
            /** @lang Graphql */
            '
            query countApplicants($where: ApplicantFilterInput) {
                countApplicants (where: $where)
            }
        ',
            [
                'where' => [
                    'pools' => [
                        ['id' => $pool1['id']]
                    ],
                    'hasDiploma' => false,
                ]
            ]
        )->assertJson([
            'data' => [
                'countApplicants' => 7
            ]
        ]);

        // Assert query with true diploma filter
        $this->graphQL(
            /** @lang Graphql */
            '
            query countApplicants($where: ApplicantFilterInput) {
                countApplicants (where: $where)
            }
        ',
            [
                'where' => [
                    'pools' => [
                        ['id' => $pool1['id']]
                    ],
                    'hasDiploma' => true,
                ]
            ]
        )->assertJson([
            'data' => [
                'countApplicants' => 4
            ]
        ]);
    }

    public function testCountApplicantsQueryLocation(): void
    {
        $user = User::All()->first();
        $pool1 = Pool::factory()->create([
            'user_id' => $user['id']
        ]);

        PoolCandidate::factory()->count(3)->create([
            'pool_id' => $pool1['id'],
            'expiry_date' => config('constants.far_future_date'),
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE,
            'user_id' => User::factory([
                'location_preferences' => ["ONTARIO"],
                'job_looking_status' => ApiEnums::USER_STATUS_ACTIVELY_LOOKING
            ])
        ]);

        PoolCandidate::factory()->count(4)->create([
            'pool_id' => $pool1['id'],
            'expiry_date' => config('constants.far_future_date'),
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE,
            'user_id' => User::factory([
                'location_preferences' => ["TELEWORK"],
                'job_looking_status' => ApiEnums::USER_STATUS_ACTIVELY_LOOKING
            ])
        ]);

        // Assert empty location
        $this->graphQL(
            /** @lang Graphql */
            '
            query countApplicants($where: ApplicantFilterInput) {
                countApplicants (where: $where)
            }
        ',
            [
                'where' => [
                    'pools' => [
                        ['id' => $pool1['id']]
                    ],
                    'locationPreferences' => [],
                ]
            ]
        )->assertJson([
            'data' => [
                'countApplicants' => 7
            ]
        ]);

        // Assert query with TELEWORK
        $this->graphQL(
            /** @lang Graphql */
            '
            query countApplicants($where: ApplicantFilterInput) {
                countApplicants (where: $where)
            }
        ',
            [
                'where' => [
                    'pools' => [
                        ['id' => $pool1['id']]
                    ],
                    'locationPreferences' => ["TELEWORK"],
                ]
            ]
        )->assertJson([
            'data' => [
                'countApplicants' => 4
            ]
        ]);
    }

    public function testCountApplicantsQueryTemporary(): void
    {
        $user = User::All()->first();
        $pool1 = Pool::factory()->create([
            'user_id' => $user['id']
        ]);

        PoolCandidate::factory()->count(3)->create([
            'pool_id' => $pool1['id'],
            'expiry_date' => config('constants.far_future_date'),
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE,
            'user_id' => User::factory([
                'would_accept_temporary' => false,
                'job_looking_status' => ApiEnums::USER_STATUS_ACTIVELY_LOOKING
            ])
        ]);

        PoolCandidate::factory()->count(4)->create([
            'pool_id' => $pool1['id'],
            'expiry_date' => config('constants.far_future_date'),
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE,
            'user_id' => User::factory([
                'would_accept_temporary' => true,
                'job_looking_status' => ApiEnums::USER_STATUS_ACTIVELY_LOOKING
            ])
        ]);

        // Assert false for acceptTemporary
        $this->graphQL(
            /** @lang Graphql */
            '
            query countApplicants($where: ApplicantFilterInput) {
                countApplicants (where: $where)
            }
        ',
            [
                'where' => [
                    'pools' => [
                        ['id' => $pool1['id']]
                    ],
                    'wouldAcceptTemporary' => false,
                ]
            ]
        )->assertJson([
            'data' => [
                'countApplicants' => 7
            ]
        ]);

        // Assert true for acceptTemporary
        $this->graphQL(
            /** @lang Graphql */
            '
            query countApplicants($where: ApplicantFilterInput) {
                countApplicants (where: $where)
            }
        ',
            [
                'where' => [
                    'pools' => [
                        ['id' => $pool1['id']]
                    ],
                    'wouldAcceptTemporary' => true,
                ]
            ]
        )->assertJson([
            'data' => [
                'countApplicants' => 4
            ]
        ]);
    }

    public function testCountApplicantsQueryConditionsEmployment(): void
    {
        $user = User::All()->first();
        $pool1 = Pool::factory()->create([
            'user_id' => $user['id']
        ]);

        PoolCandidate::factory()->count(1)->create([
            'pool_id' => $pool1['id'],
            'expiry_date' => config('constants.far_future_date'),
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE,
            'user_id' => User::factory([
                'accepted_operational_requirements' => [],
                'job_looking_status' => ApiEnums::USER_STATUS_ACTIVELY_LOOKING,
            ])
        ]);

        PoolCandidate::factory()->count(2)->create([
            'pool_id' => $pool1['id'],
            'expiry_date' => config('constants.far_future_date'),
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE,
            'user_id' => User::factory([
                'accepted_operational_requirements' => ["SHIFT_WORK"],
                'job_looking_status' => ApiEnums::USER_STATUS_ACTIVELY_LOOKING,
            ])
        ]);

        PoolCandidate::factory()->count(4)->create([
            'pool_id' => $pool1['id'],
            'expiry_date' => config('constants.far_future_date'),
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE,
            'user_id' => User::factory([
                'accepted_operational_requirements' => ["SHIFT_WORK", "TRAVEL"],
                'job_looking_status' => ApiEnums::USER_STATUS_ACTIVELY_LOOKING,
            ])
        ]);

        // Assert empty operational requirements
        $this->graphQL(
            /** @lang Graphql */
            '
            query countApplicants($where: ApplicantFilterInput) {
                countApplicants (where: $where)
            }
        ',
            [
                'where' => [
                    'pools' => [
                        ['id' => $pool1['id']]
                    ],
                    'operationalRequirements' => [],
                ]
            ]
        )->assertJson([
            'data' => [
                'countApplicants' => 7
            ]
        ]);

        // Assert one operational requirements
        $this->graphQL(
            /** @lang Graphql */
            '
            query countApplicants($where: ApplicantFilterInput) {
                countApplicants (where: $where)
            }
        ',
            [
                'where' => [
                    'pools' => [
                        ['id' => $pool1['id']]
                    ],
                    'operationalRequirements' => ["SHIFT_WORK"],
                ]
            ]
        )->assertJson([
            'data' => [
                'countApplicants' => 6
            ]
        ]);

        // Assert two operational requirements
        $this->graphQL(
            /** @lang Graphql */
            '
            query countApplicants($where: ApplicantFilterInput) {
                countApplicants (where: $where)
            }
        ',
            [
                'where' => [
                    'pools' => [
                        ['id' => $pool1['id']]
                    ],
                    'operationalRequirements' => ["SHIFT_WORK", "TRAVEL"],
                ]
            ]
        )->assertJson([
            'data' => [
                'countApplicants' => 4
            ]
        ]);
    }

    public function testCountApplicantsQuerySkills(): void
    {
        // recycle skills testing //
        $user = User::All()->first();
        $pool1 = Pool::factory()->create([
            'user_id' => $user['id']
        ]);
        $skill1 = Skill::factory()->create();
        $skill2 = Skill::factory()->create();
        $skill3 = Skill::factory()->create();

        PoolCandidate::factory()->count(1)->create([
            'pool_id' => $pool1['id'],
            'expiry_date' => config('constants.far_future_date'),
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE,
            'user_id' => User::factory([
                'job_looking_status' => ApiEnums::USER_STATUS_ACTIVELY_LOOKING,
            ])
        ]);

        PoolCandidate::factory()->count(2)->sequence(fn () => [
            'pool_id' => $pool1->id,
            'expiry_date' => config('constants.far_future_date'),
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE,
            'user_id' => User::factory([
                'job_looking_status' => ApiEnums::USER_STATUS_ACTIVELY_LOOKING,
            ])->afterCreating(function ($user) use ($skill1) {
                AwardExperience::factory()
                    ->for($user)
                    ->afterCreating(function ($model) use ($skill1) {
                        $model->skills()->sync([$skill1['id']]);
                    })->create();
                WorkExperience::factory()
                    ->for($user)
                    ->afterCreating(function ($model) use ($skill1) {
                        $model->skills()->sync([$skill1['id']]);
                    })->create();
            })->create()
        ])->create();

        PoolCandidate::factory()->count(4)->sequence(fn () => [
            'pool_id' => $pool1->id,
            'expiry_date' => config('constants.far_future_date'),
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE,
            'user_id' => User::factory([
                'job_looking_status' => ApiEnums::USER_STATUS_ACTIVELY_LOOKING,
            ])->afterCreating(function ($user) use ($skill1, $skill2) {
                CommunityExperience::factory()
                    ->for($user)
                    ->afterCreating(function ($model) use ($skill1) {
                        $model->skills()->sync([$skill1['id']]);
                    })->create();
                PersonalExperience::factory()
                    ->for($user)
                    ->afterCreating(function ($model) use ($skill2) {
                        $model->skills()->sync([$skill2['id']]);
                    })->create();
            })->create()
        ])->create();

        // Assert nothing for skills
        $this->graphQL(
            /** @lang Graphql */
            '
            query countApplicants($where: ApplicantFilterInput) {
                countApplicants (where: $where)
            }
        ',
            [
                'where' => [
                    'pools' => [
                        ['id' => $pool1['id']]
                    ],
                ]
            ]
        )->assertJson([
            'data' => [
                'countApplicants' => 7
            ]
        ]);

        // Assert empty skills array
        $this->graphQL(
            /** @lang Graphql */
            '
            query countApplicants($where: ApplicantFilterInput) {
                countApplicants (where: $where)
            }
        ',
            [
                'where' => [
                    'pools' => [
                        ['id' => $pool1['id']]
                    ],
                    'skills' => [],
                ]
            ]
        )->assertJson([
            'data' => [
                'countApplicants' => 7
            ]
        ]);

        // Assert one skill
        $this->graphQL(
            /** @lang Graphql */
            '
            query countApplicants($where: ApplicantFilterInput) {
                countApplicants (where: $where)
            }
        ',
            [
                'where' => [
                    'pools' => [
                        ['id' => $pool1['id']]
                    ],
                    'skills' => [
                        ['id' => $skill1['id']],
                    ]
                ]
            ]
        )->assertJson([
            'data' => [
                'countApplicants' => 6
            ]
        ]);

        // Assert two skills
        $this->graphQL(
            /** @lang Graphql */
            '
            query countApplicants($where: ApplicantFilterInput) {
                countApplicants (where: $where)
            }
        ',
            [
                'where' => [
                    'pools' => [
                        ['id' => $pool1['id']]
                    ],
                    'skills' => [
                        ['id' => $skill1['id']],
                        ['id' => $skill2['id']],
                    ],
                ]
            ]
        )->assertJson([
            'data' => [
                'countApplicants' => 4
            ]
        ]);

        // Assert unused skill
        $this->graphQL(
            /** @lang Graphql */
            '
            query countApplicants($where: ApplicantFilterInput) {
                countApplicants (where: $where)
            }
        ',
            [
                'where' => [
                    'pools' => [
                        ['id' => $pool1['id']]
                    ],
                    'skills' => [
                        ['id' => $skill3['id']],
                    ],
                ]
            ]
        )->assertJson([
            'data' => [
                'countApplicants' => 0
            ]
        ]);
    }

    public function testPriorityDerivedStatusAccessor(): void
    {
        // test derived property that exists on type User and Applicant from model User.php

        // create candidates
        $candidateOne = User::factory()->create([
            'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
            'has_priority_entitlement' => true,
            'armed_forces_status' => ApiEnums::ARMED_FORCES_VETERAN,
            'citizenship' => ApiEnums::CITIZENSHIP_CITIZEN,
        ]);
        $candidateTwo = User::factory()->create([
            'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
            'has_priority_entitlement' => false,
            'armed_forces_status' => ApiEnums::ARMED_FORCES_VETERAN,
            'citizenship' => ApiEnums::CITIZENSHIP_CITIZEN,
        ]);
        $candidateThree = User::factory()->create([
            'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
            'has_priority_entitlement' => false,
            'armed_forces_status' => ApiEnums::ARMED_FORCES_NON_CAF,
            'citizenship' => ApiEnums::CITIZENSHIP_CITIZEN,
        ]);
        $candidateFour = User::factory()->create([
            'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14',
            'has_priority_entitlement' => false,
            'armed_forces_status' => ApiEnums::ARMED_FORCES_NON_CAF,
            'citizenship' => ApiEnums::CITIZENSHIP_OTHER,
        ]);

        // Assert candidate one returns PRIORITY
        $this->graphQL(/** @lang Graphql */ '
            query applicant($id: ID!) {
                applicant(id: $id) {
                    priorityDerived
                }
            }
            ', [
                'id' => $candidateOne->id,
        ])->assertJson([
            "data" => [
                "applicant" => [
                    "priorityDerived" => ApiEnums::PRIORITY_DERIVED_PRIORITY,
                ]
            ]
        ]);

        // Assert candidate two returns VETERAN
        $this->graphQL(/** @lang Graphql */ '
            query applicant($id: ID!) {
                applicant(id: $id) {
                    priorityDerived
                }
            }
            ', [
                'id' => $candidateTwo->id,
        ])->assertJson([
            "data" => [
                "applicant" => [
                    "priorityDerived" => ApiEnums::PRIORITY_DERIVED_VETERAN,
                ]
            ]
        ]);

        // Assert candidate three returns CITIZEN/PR
        $this->graphQL(/** @lang Graphql */ '
            query applicant($id: ID!) {
                applicant(id: $id) {
                    priorityDerived
                }
            }
            ', [
                'id' => $candidateThree->id,
        ])->assertJson([
            "data" => [
                "applicant" => [
                    "priorityDerived" => ApiEnums::PRIORITY_DERIVED_CITIZEN_OR_PR,
                ]
            ]
        ]);

        // Assert candidate four returns OTHER
        $this->graphQL(/** @lang Graphql */ '
            query applicant($id: ID!) {
                applicant(id: $id) {
                    priorityDerived
                }
            }
            ', [
                'id' => $candidateFour->id,
        ])->assertJson([
            "data" => [
                "applicant" => [
                    "priorityDerived" => ApiEnums::PRIORITY_DERIVED_OTHER,
                ]
            ]
        ]);
    }
}
