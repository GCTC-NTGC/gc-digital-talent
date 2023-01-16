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
                'is_visible_minority' => false,
                'indigenous_communities' => null,
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
                'indigenous_communities' => [ApiEnums::INDIGENOUS_OTHER], // will not be filtered for
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
                'indigenous_communities' => [ApiEnums::INDIGENOUS_LEGACY_IS_INDIGENOUS], // will be filtered for
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

        // Assert query will correctly filter for LEGACY_IS_INDIGENOUS
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
                        'isIndigenous' => true,
                    ],
                ]
            ]
        )->assertJson([
            'data' => [
                'countApplicants' => 1
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
                'looking_for_english' => true,
                'looking_for_french' => false,
                'looking_for_bilingual' => false,
                'job_looking_status' => ApiEnums::USER_STATUS_ACTIVELY_LOOKING
            ])
        ]);

        PoolCandidate::factory()->count(2)->create([
            'pool_id' => $pool1['id'],
            'expiry_date' => config('constants.far_future_date'),
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE,
            'user_id' => User::factory([
                'looking_for_english' => false,
                'looking_for_french' => true,
                'looking_for_bilingual' => false,
                'job_looking_status' => ApiEnums::USER_STATUS_ACTIVELY_LOOKING,
            ])
        ]);

        PoolCandidate::factory()->count(4)->create([
            'pool_id' => $pool1['id'],
            'expiry_date' => config('constants.far_future_date'),
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE,
            'user_id' => User::factory([
                'looking_for_english' => false,
                'looking_for_french' => false,
                'looking_for_bilingual' => true,
                'job_looking_status' => ApiEnums::USER_STATUS_ACTIVELY_LOOKING,
            ])
        ]);

        // Assert query with english filter will return proper count
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
                'countApplicants' => 1
            ]
        ]);

        // Assert query with french filter will return proper count
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
                'countApplicants' => 2
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
            $candidate->user->expectedClassifications()->sync($classificationLvl1);
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
            $candidate->user->expectedClassifications()->delete();
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
            $candidate->user->expectedClassifications()->delete();
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
                'position_duration' => [ApiEnums::POSITION_DURATION_PERMANENT],
                'job_looking_status' => ApiEnums::USER_STATUS_ACTIVELY_LOOKING
            ])
        ]);

        PoolCandidate::factory()->count(4)->create([
            'pool_id' => $pool1['id'],
            'expiry_date' => config('constants.far_future_date'),
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE,
            'user_id' => User::factory([
                'position_duration' => [ApiEnums::POSITION_DURATION_TEMPORARY, ApiEnums::POSITION_DURATION_PERMANENT],
                'job_looking_status' => ApiEnums::USER_STATUS_ACTIVELY_LOOKING
            ])
        ]);

        PoolCandidate::factory()->count(1)->create([
            'pool_id' => $pool1['id'],
            'expiry_date' => config('constants.far_future_date'),
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE,
            'user_id' => User::factory([
                'position_duration' => null,
                'job_looking_status' => ApiEnums::USER_STATUS_ACTIVELY_LOOKING
            ])
        ]);

        // Assert null for position duration
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
                    'positionDuration' => null,
                ]
            ]
        )->assertJson([
            'data' => [
                'countApplicants' => 8
            ]
        ]);

        // Assert temporary duration
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
                    'positionDuration' => [ApiEnums::POSITION_DURATION_TEMPORARY],
                ]
            ]
        )->assertJson([
            'data' => [
                'countApplicants' => 4
            ]
        ]);

        // Assert temporary and permanent duration
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
                    'positionDuration' => [ApiEnums::POSITION_DURATION_TEMPORARY, ApiEnums::POSITION_DURATION_PERMANENT],
                ]
            ]
        )->assertJson([
            'data' => [
                'countApplicants' => 7
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

    public function testPriorityWeight(): void
    {
        // test generated property that exists on type User and Applicant from model User.php

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

        // Assert candidate one returns 10
        $this->graphQL(/** @lang Graphql */ '
            query applicant($id: UUID!) {
                applicant(id: $id) {
                    priorityWeight
                }
            }
            ', [
                'id' => $candidateOne->id,
        ])->assertJson([
            "data" => [
                "applicant" => [
                    "priorityWeight" => 10,
                ]
            ]
        ]);

        // Assert candidate two returns 20
        $this->graphQL(/** @lang Graphql */ '
            query applicant($id: UUID!) {
                applicant(id: $id) {
                    priorityWeight
                }
            }
            ', [
                'id' => $candidateTwo->id,
        ])->assertJson([
            "data" => [
                "applicant" => [
                    "priorityWeight" => 20,
                ]
            ]
        ]);

        // Assert candidate three returns 30
        $this->graphQL(/** @lang Graphql */ '
            query applicant($id: UUID!) {
                applicant(id: $id) {
                    priorityWeight
                }
            }
            ', [
                'id' => $candidateThree->id,
        ])->assertJson([
            "data" => [
                "applicant" => [
                    "priorityWeight" => 30,
                ]
            ]
        ]);

        // Assert candidate four returns 40
        $this->graphQL(/** @lang Graphql */ '
            query applicant($id: UUID!) {
                applicant(id: $id) {
                    priorityWeight
                }
            }
            ', [
                'id' => $candidateFour->id,
        ])->assertJson([
            "data" => [
                "applicant" => [
                    "priorityWeight" => 40,
                ]
            ]
        ]);
    }

    public function testStatusWeight(): void {
        // test generated property that exists on type PoolCandidate from model PoolCandidate.php

        // create candidates for each status
        $user = User::All()->first();
        $pool1 = Pool::factory()->create([
            'user_id' => $user['id']
        ]);
        $candidateOne = PoolCandidate::factory()->create([
            'pool_id' => $pool1['id'],
            'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
            'expiry_date' => config('constants.far_future_date'),
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_DRAFT,
        ]);
        $candidateTwo = PoolCandidate::factory()->create([
            'pool_id' => $pool1['id'],
            'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
            'expiry_date' => config('constants.past_date'),
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_DRAFT_EXPIRED,
        ]);
        $candidateThree = PoolCandidate::factory()->create([
            'pool_id' => $pool1['id'],
            'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
            'expiry_date' => config('constants.far_future_date'),
            'submitted_at' => config('constants.past_date'),
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_NEW_APPLICATION,
        ]);
        $candidateFour = PoolCandidate::factory()->create([
            'pool_id' => $pool1['id'],
            'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14',
            'expiry_date' => config('constants.far_future_date'),
            'submitted_at' => config('constants.past_date'),
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_APPLICATION_REVIEW,
        ]);
        $candidateFive = PoolCandidate::factory()->create([
            'pool_id' => $pool1['id'],
            'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15',
            'expiry_date' => config('constants.far_future_date'),
            'submitted_at' => config('constants.past_date'),
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_SCREENED_IN,
        ]);
        $candidateSix = PoolCandidate::factory()->create([
            'pool_id' => $pool1['id'],
            'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a16',
            'expiry_date' => config('constants.far_future_date'),
            'submitted_at' => config('constants.past_date'),
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_SCREENED_OUT_APPLICATION,
        ]);
        $candidateSeven = PoolCandidate::factory()->create([
            'pool_id' => $pool1['id'],
            'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a17',
            'expiry_date' => config('constants.far_future_date'),
            'submitted_at' => config('constants.past_date'),
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_UNDER_ASSESSMENT,
        ]);
        $candidateEight = PoolCandidate::factory()->create([
            'pool_id' => $pool1['id'],
            'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a18',
            'expiry_date' => config('constants.far_future_date'),
            'submitted_at' => config('constants.past_date'),
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_SCREENED_OUT_ASSESSMENT,
        ]);
        $candidateNine = PoolCandidate::factory()->create([
            'pool_id' => $pool1['id'],
            'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a19',
            'expiry_date' => config('constants.far_future_date'),
            'submitted_at' => config('constants.past_date'),
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE,
        ]);
        $candidateTen = PoolCandidate::factory()->create([
            'pool_id' => $pool1['id'],
            'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a20',
            'expiry_date' => config('constants.far_future_date'),
            'submitted_at' => config('constants.past_date'),
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_QUALIFIED_UNAVAILABLE,
        ]);
        $candidateEleven = PoolCandidate::factory()->create([
            'pool_id' => $pool1['id'],
            'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a21',
            'expiry_date' => config('constants.far_future_date'),
            'submitted_at' => config('constants.past_date'),
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_QUALIFIED_WITHDREW,
        ]);
        $candidateTwelve = PoolCandidate::factory()->create([
            'pool_id' => $pool1['id'],
            'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
            'expiry_date' => config('constants.far_future_date'),
            'submitted_at' => config('constants.past_date'),
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_PLACED_CASUAL,
        ]);
        $candidateThirteen = PoolCandidate::factory()->create([
            'pool_id' => $pool1['id'],
            'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a23',
            'expiry_date' => config('constants.far_future_date'),
            'submitted_at' => config('constants.past_date'),
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_PLACED_TERM,
        ]);
        $candidateFourteen = PoolCandidate::factory()->create([
            'pool_id' => $pool1['id'],
            'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a24',
            'expiry_date' => config('constants.far_future_date'),
            'submitted_at' => config('constants.past_date'),
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_PLACED_INDETERMINATE,
        ]);
        $candidateFifteen = PoolCandidate::factory()->create([
            'pool_id' => $pool1['id'],
            'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a25',
            'expiry_date' => config('constants.far_future_date'),
            'submitted_at' => config('constants.past_date'),
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_EXPIRED,
        ]);

        $candidateSixteen = PoolCandidate::factory()->create([
            'pool_id' => $pool1['id'],
            'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a26',
            'expiry_date' => config('constants.far_future_date'),
            'submitted_at' => config('constants.past_date'),
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_REMOVED,
        ]);

        // Assert candidate one DRAFT is 10
        $this->graphQL(/** @lang Graphql */ '
            query poolCandidate($id: UUID!) {
                poolCandidate(id: $id) {
                    statusWeight
                    status
                }
            }
            ', [
                'id' => $candidateOne->id,
        ])->assertJson([
            "data" => [
                "poolCandidate" => [
                    "statusWeight" => 10,
                    "status" => ApiEnums::CANDIDATE_STATUS_DRAFT,
                ]
            ]
        ]);
        // Assert candidate two DRAFT_EXPIRED is 20
        $this->graphQL(/** @lang Graphql */ '
            query poolCandidate($id: UUID!) {
                poolCandidate(id: $id) {
                    statusWeight
                    status
                }
            }
            ', [
                'id' => $candidateTwo->id,
        ])->assertJson([
            "data" => [
                "poolCandidate" => [
                    "statusWeight" => 20,
                    "status" => ApiEnums::CANDIDATE_STATUS_DRAFT_EXPIRED,
                ]
            ]
        ]);
        // Assert candidate three NEW APPLICATION is 30
        $this->graphQL(/** @lang Graphql */ '
            query poolCandidate($id: UUID!) {
                poolCandidate(id: $id) {
                    statusWeight
                    status
                }
            }
            ', [
                'id' => $candidateThree->id,
        ])->assertJson([
            "data" => [
                "poolCandidate" => [
                    "statusWeight" => 30,
                    "status" => ApiEnums::CANDIDATE_STATUS_NEW_APPLICATION,
                ]
            ]
        ]);
        // Assert candidate four APPLICATION REVIEW is 40
        $this->graphQL(/** @lang Graphql */ '
            query poolCandidate($id: UUID!) {
                poolCandidate(id: $id) {
                    statusWeight
                    status
                }
            }
            ', [
                'id' => $candidateFour->id,
        ])->assertJson([
            "data" => [
                "poolCandidate" => [
                    "statusWeight" => 40,
                    "status" => ApiEnums::CANDIDATE_STATUS_APPLICATION_REVIEW,
                ]
            ]
        ]);
        // Assert candidate five SCREENED IN is 50
        $this->graphQL(/** @lang Graphql */ '
            query poolCandidate($id: UUID!) {
                poolCandidate(id: $id) {
                    statusWeight
                    status
                }
            }
            ', [
                'id' => $candidateFive->id,
        ])->assertJson([
            "data" => [
                "poolCandidate" => [
                    "statusWeight" => 50,
                    "status" => ApiEnums::CANDIDATE_STATUS_SCREENED_IN,
                ]
            ]
        ]);
        // Assert candidate six SCREENED OUT APPLICATION is 60
        $this->graphQL(/** @lang Graphql */ '
            query poolCandidate($id: UUID!) {
                poolCandidate(id: $id) {
                    statusWeight
                    status
                }
            }
            ', [
                'id' => $candidateSix->id,
        ])->assertJson([
            "data" => [
                "poolCandidate" => [
                    "statusWeight" => 60,
                    "status" => ApiEnums::CANDIDATE_STATUS_SCREENED_OUT_APPLICATION,
                ]
            ]
        ]);
        // Assert candidate seven UNDER ASSESSMENT is 70
        $this->graphQL(/** @lang Graphql */ '
            query poolCandidate($id: UUID!) {
                poolCandidate(id: $id) {
                    statusWeight
                    status
                }
            }
            ', [
                'id' => $candidateSeven->id,
        ])->assertJson([
            "data" => [
                "poolCandidate" => [
                    "statusWeight" => 70,
                    "status" => ApiEnums::CANDIDATE_STATUS_UNDER_ASSESSMENT,
                ]
            ]
        ]);
        // Assert candidate eight SCREENED OUT ASSESSMENT is 80
        $this->graphQL(/** @lang Graphql */ '
            query poolCandidate($id: UUID!) {
                poolCandidate(id: $id) {
                    statusWeight
                    status
                }
            }
            ', [
                'id' => $candidateEight->id,
        ])->assertJson([
            "data" => [
                "poolCandidate" => [
                    "statusWeight" => 80,
                    "status" => ApiEnums::CANDIDATE_STATUS_SCREENED_OUT_ASSESSMENT,
                ]
            ]
        ]);
        // Assert candidate nine QUALIFIED AVAILABLE is 90
        $this->graphQL(/** @lang Graphql */ '
            query poolCandidate($id: UUID!) {
                poolCandidate(id: $id) {
                    statusWeight
                    status
                }
            }
            ', [
                'id' => $candidateNine->id,
        ])->assertJson([
            "data" => [
                "poolCandidate" => [
                    "statusWeight" => 90,
                    "status" => ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE,
                ]
            ]
        ]);
        // Assert candidate ten QUALIFIED UNAVAILABLE is 100
        $this->graphQL(/** @lang Graphql */ '
            query poolCandidate($id: UUID!) {
                poolCandidate(id: $id) {
                    statusWeight
                    status
                }
            }
            ', [
                'id' => $candidateTen->id,
        ])->assertJson([
            "data" => [
                "poolCandidate" => [
                    "statusWeight" => 100,
                    "status" => ApiEnums::CANDIDATE_STATUS_QUALIFIED_UNAVAILABLE,
                ]
            ]
        ]);
        // Assert candidate eleven QUALIFIED WITHDREW is 110
        $this->graphQL(/** @lang Graphql */ '
            query poolCandidate($id: UUID!) {
                poolCandidate(id: $id) {
                    statusWeight
                    status
                }
            }
            ', [
                'id' => $candidateEleven->id,
        ])->assertJson([
            "data" => [
                "poolCandidate" => [
                    "statusWeight" => 110,
                    "status" => ApiEnums::CANDIDATE_STATUS_QUALIFIED_WITHDREW
                ]
            ]
        ]);
        // Assert candidate twelve PLACED CASUAL is 120
        $this->graphQL(/** @lang Graphql */ '
            query poolCandidate($id: UUID!) {
                poolCandidate(id: $id) {
                    statusWeight
                    status
                }
            }
            ', [
                'id' => $candidateTwelve->id,
        ])->assertJson([
            "data" => [
                "poolCandidate" => [
                    "statusWeight" => 120,
                    "status" => ApiEnums::CANDIDATE_STATUS_PLACED_CASUAL,
                ]
            ]
        ]);
        // Assert candidate thirteen PLACED TERM is 130
        $this->graphQL(/** @lang Graphql */ '
            query poolCandidate($id: UUID!) {
                poolCandidate(id: $id) {
                    statusWeight
                    status
                }
            }
            ', [
                'id' => $candidateThirteen->id,
        ])->assertJson([
            "data" => [
                "poolCandidate" => [
                    "statusWeight" => 130,
                    "status" => ApiEnums::CANDIDATE_STATUS_PLACED_TERM,
                ]
            ]
        ]);
        // Assert candidate fourteen PLACED INDETERMINATE is 140
        $this->graphQL(/** @lang Graphql */ '
            query poolCandidate($id: UUID!) {
                poolCandidate(id: $id) {
                    statusWeight
                    status
                }
            }
            ', [
                'id' => $candidateFourteen->id,
        ])->assertJson([
            "data" => [
                "poolCandidate" => [
                    "statusWeight" => 140,
                    "status" => ApiEnums::CANDIDATE_STATUS_PLACED_INDETERMINATE,
                ]
            ]
        ]);
        // Assert candidate fifteen EXPIRED is 150
        $this->graphQL(/** @lang Graphql */ '
            query poolCandidate($id: UUID!) {
                poolCandidate(id: $id) {
                    statusWeight
                    status
                }
            }
            ', [
                'id' => $candidateFifteen->id,
        ])->assertJson([
            "data" => [
                "poolCandidate" => [
                    "statusWeight" => 150,
                    "status" => ApiEnums::CANDIDATE_STATUS_EXPIRED,
                ]
            ]
        ]);
        // Assert candidate sixteen REMOVED is 160
        $this->graphQL(/** @lang Graphql */ '
            query poolCandidate($id: UUID!) {
                poolCandidate(id: $id) {
                    statusWeight
                    status
                }
            }
            ', [
                'id' => $candidateSixteen->id,
        ])->assertJson([
            "data" => [
                "poolCandidate" => [
                    "statusWeight" => 160,
                    "status" => ApiEnums::CANDIDATE_STATUS_REMOVED,
                ]
            ]
        ]);
    }

    public function testSortingStatusThenPriority(): void
    {
        $user = User::All()->first();
        $pool1 = Pool::factory()->create([
            'user_id' => $user['id']
        ]);

        // DRAFT, NOT PRESENT
        $candidateOne = PoolCandidate::factory()->create([
            'pool_id' => $pool1['id'],
            'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
            'expiry_date' => config('constants.far_future_date'),
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_DRAFT,
            'user_id' => User::factory([
                'job_looking_status' => ApiEnums::USER_STATUS_ACTIVELY_LOOKING,
                'has_priority_entitlement' => true,
                'armed_forces_status' => ApiEnums::ARMED_FORCES_VETERAN,
                'citizenship' => ApiEnums::CITIZENSHIP_CITIZEN,
            ])
        ]);
        // NEW APPLICATION, NO PRIORITY SO SECOND
        $candidateTwo = PoolCandidate::factory()->create([
            'pool_id' => $pool1['id'],
            'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
            'expiry_date' => config('constants.far_future_date'),
            'submitted_at' => config('constants.past_date'),
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_NEW_APPLICATION,
            'user_id' => User::factory([
                'job_looking_status' => ApiEnums::USER_STATUS_ACTIVELY_LOOKING,
                'has_priority_entitlement' => false,
                'armed_forces_status' => ApiEnums::ARMED_FORCES_NON_CAF,
                'citizenship' => ApiEnums::CITIZENSHIP_OTHER,
            ])
        ]);
        // APPLICATION REVIEW, NO PRIORITY SO THIRD
        $candidateThree = PoolCandidate::factory()->create([
            'pool_id' => $pool1['id'],
            'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
            'expiry_date' => config('constants.far_future_date'),
            'submitted_at' => config('constants.past_date'),
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_APPLICATION_REVIEW,
            'user_id' => User::factory([
                'job_looking_status' => ApiEnums::USER_STATUS_ACTIVELY_LOOKING,
                'has_priority_entitlement' => false,
                'armed_forces_status' => ApiEnums::ARMED_FORCES_NON_CAF,
                'citizenship' => ApiEnums::CITIZENSHIP_OTHER,
            ])
        ]);

        // NEW APPLICATION, VETERAN SO FIRST
        $candidateFour = PoolCandidate::factory()->create([
            'pool_id' => $pool1['id'],
            'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14',
            'expiry_date' => config('constants.far_future_date'),
            'submitted_at' => config('constants.past_date'),
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_NEW_APPLICATION,
            'user_id' => User::factory([
                'job_looking_status' => ApiEnums::USER_STATUS_ACTIVELY_LOOKING,
                'has_priority_entitlement' => false,
                'armed_forces_status' => ApiEnums::ARMED_FORCES_VETERAN,
                'citizenship' => ApiEnums::CITIZENSHIP_CITIZEN,
            ])
        ]);
        // QUALIFIED AVAILABLE, HAS ENTITLEMENT FOURTH
        $candidateFive = PoolCandidate::factory()->create([
            'pool_id' => $pool1['id'],
            'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15',
            'expiry_date' => config('constants.far_future_date'),
            'submitted_at' => config('constants.past_date'),
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE,
            'user_id' => User::factory([
                'job_looking_status' => ApiEnums::USER_STATUS_ACTIVELY_LOOKING,
                'has_priority_entitlement' => true,
                'armed_forces_status' => ApiEnums::ARMED_FORCES_VETERAN,
                'citizenship' => ApiEnums::CITIZENSHIP_CITIZEN,
            ])
        ]);

        // Assert the order is correct
        $this->graphQL(/** @lang Graphql */ '
            query poolCandidatesPaginated {
                poolCandidatesPaginated (orderBy: [
                    { column: "status_weight", order: ASC }
                    { user: { aggregate: MAX, column: PRIORITY_WEIGHT }, order: ASC }
                  ])
                {
                    data
                    {
                        id
                    }
                }
            }
            ')->assertJson([
            "data" => [
                "poolCandidatesPaginated" => [
                    "data" => [
                        ["id" => $candidateFour->id,],
                        ["id" => $candidateTwo->id,],
                        ["id" => $candidateThree->id,],
                        ["id" => $candidateFive->id,],
                    ]
                ]
            ]
        ]);

        // Assert that DRAFT is not retrieved
        $this->graphQL(/** @lang Graphql */ '
            query poolCandidatesPaginated {
                poolCandidatesPaginated (orderBy: [
                    { column: "status_weight", order: ASC }
                    { user: { aggregate: MAX, column: PRIORITY_WEIGHT }, order: ASC }
                  ])
                {
                    data
                    {
                        status
                    }
                }
            }
            ')->assertDontSeeText(ApiEnums::CANDIDATE_STATUS_DRAFT);
    }

    public function testNullFilterEqualsUndefinedPoolCandidate() {

        // setup
        $owner = User::where('sub', 'ilike', 'admin@test.com')->sole();
        $pool = Pool::factory()->create([
            'user_id' => $owner['id'],
        ]);
        User::factory([
            'roles' => [ApiEnums::ROLE_APPLICANT],
            'job_looking_status' => 'ACTIVELY_LOOKING',
        ])
            ->count(60)
            ->afterCreating(function (User $user) use ($pool) {
                PoolCandidate::factory()->count(1)->sequence(fn () => [
                    'pool_id' => $pool->id,
                    'user_id' => $user->id,
                    'expiry_date' => config('constants.far_future_date'),
                    'submitted_at' => config('constants.past_date'),
                    'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE, // ensuring this passes the notDraft scope
                ])->create();
            })
        ->create();

        // empty input
        $this->graphQL(
            /** @lang Graphql */
            '
            query poolCandidatesPaginated($where: PoolCandidateSearchInput) {
                poolCandidatesPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ',
            [
                'where' => []
            ]
        )->assertJson([
            'data' => [
                'poolCandidatesPaginated' => [
                    'paginatorInfo' => [
                        'total' => 60
                    ]
                ]
            ]
        ]);

        // null input
        $this->graphQL(
            /** @lang Graphql */
            '
            query poolCandidatesPaginated($where: PoolCandidateSearchInput) {
                poolCandidatesPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ',
            [
                'where' => [
                    'applicantFilter' => [
                        'equity' => null,
                        'expectedClassifications' => null,
                        'hasDiploma' => null,
                        'languageAbility' => null,
                        'locationPreferences' => null,
                        'operationalRequirements' => null,
                        'positionDuration' => null,
                        'pools' => null,
                        'skills' => null,
                    ],
                    'generalSearch' => null,
                    'name' => null,
                    'email' => null,
                    'priorityWeight' => null,
                    'poolCandidateStatus' => null,

                ]
            ]
        )->assertJson([
            'data' => [
                'poolCandidatesPaginated' => [
                    'paginatorInfo' => [
                        'total' => 60
                    ]
                ]
            ]
        ]);
    }
}
