<?php

namespace Tests\Feature;

use App\Enums\ApplicationStatus;
use App\Enums\ArmedForcesStatus;
use App\Enums\CandidateRemovalReason;
use App\Enums\CitizenshipStatus;
use App\Enums\DisqualificationReason;
use App\Enums\IndigenousCommunity;
use App\Enums\LanguageAbility;
use App\Enums\OperationalRequirement;
use App\Enums\PlacementType;
use App\Enums\PositionDuration;
use App\Enums\PublishingGroup;
use App\Enums\ScreeningStage;
use App\Facades\Notify;
use App\Models\AwardExperience;
use App\Models\Classification;
use App\Models\CommunityExperience;
use App\Models\PersonalExperience;
use App\Models\Pool;
use App\Models\PoolCandidate;
use App\Models\Skill;
use App\Models\User;
use App\Models\WorkExperience;
use App\Models\WorkStream;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Tests\TestCase;
use Tests\UsesProtectedGraphqlEndpoint;

class ApplicantTest extends TestCase
{
    use MakesGraphQLRequests;
    use RefreshDatabase;
    use RefreshesSchemaCache;
    use UsesProtectedGraphqlEndpoint;

    protected $adminUser;

    protected function setUp(): void
    {
        parent::setUp();
        Notify::spy(); // don't send any notifications
        $this->seed(RolePermissionSeeder::class);

        $this->adminUser = User::factory()
            ->asApplicant()
            ->asAdmin()
            ->create([
                'email' => 'admin-user@test.com',
                'sub' => 'admin-user@test.com',
            ]);
    }

    public function testCountApplicantsQuery(): void
    {
        // Get the ID of the base admin user
        $user = User::all()->first();
        $ITPool1 = Pool::factory()->candidatesAvailableInSearch()->create([
            'user_id' => $user['id'],
            'publishing_group' => PublishingGroup::IT_JOBS->name,
        ]);
        $ITPool2 = Pool::factory()->candidatesAvailableInSearch()->create([
            'user_id' => $user['id'],
            'publishing_group' => PublishingGroup::IT_JOBS->name,
        ]);
        $EXPool = Pool::factory()->candidatesAvailableInSearch()->create([
            'user_id' => $user['id'],
            'publishing_group' => PublishingGroup::EXECUTIVE_JOBS->name,
        ]);

        PoolCandidate::factory()->count(3)->create([
            'pool_id' => $ITPool1['id'],
            'expiry_date' => config('constants.far_future_date'),
            'application_status' => ApplicationStatus::QUALIFIED->name,
            'placement_type' => PlacementType::NOT_PLACED->name,
        ]);

        PoolCandidate::factory()->count(4)->create([
            'pool_id' => $ITPool2['id'],
            'expiry_date' => config('constants.far_future_date'),
            'application_status' => ApplicationStatus::QUALIFIED->name,
            'placement_type' => PlacementType::NOT_PLACED->name,
        ]);

        // Unqualified candidate - should not appear in searches
        PoolCandidate::factory()->count(3)->create([
            'pool_id' => $ITPool1['id'],
            'expiry_date' => config('constants.far_future_date'),
            'application_status' => ApplicationStatus::TO_ASSESS->name,
            'screening_stage' => ScreeningStage::SCREENED_IN->name,
        ]);

        // Expired candidate- should not appear in searches
        PoolCandidate::factory()->count(3)->create([
            'pool_id' => $ITPool1['id'],
            'expiry_date' => config('constants.past_date'),
            'application_status' => ApplicationStatus::QUALIFIED->name,
            'placement_type' => PlacementType::NOT_PLACED->name,
        ]);

        // Executive pool - should not appear in searches
        PoolCandidate::factory()->create([
            'pool_id' => $EXPool['id'],
            'expiry_date' => config('constants.far_future_date'),
            'application_status' => ApplicationStatus::QUALIFIED->name,
            'placement_type' => PlacementType::NOT_PLACED->name,
        ]);

        // Assert empty filter returns only available applicants in IT pools
        $this->graphQL(
            /** @lang GraphQL */
            '
            query countApplicantsForSearch($where: ApplicantFilterInput) {
                countApplicantsForSearch(where: $where)
            }
        ',
            [
                'where' => [],
            ]
        )->assertJson([
            'data' => [
                'countApplicantsForSearch' => 7,
            ],
        ]);

        // Assert ITPool1 filter returns only ITPool1
        $this->graphQL(
            /** @lang GraphQL */
            '
            query countApplicantsForSearch($where: ApplicantFilterInput) {
                countApplicantsForSearch(where: $where)
            }
        ',
            [
                'where' => [
                    'pools' => [
                        ['id' => $ITPool1['id']],
                    ],
                ],
            ]
        )->assertJson([
            'data' => [
                'countApplicantsForSearch' => 7,
            ],
        ]);
    }

    public function testCountApplicantsQueryEquity(): void
    {
        // Get the ID of the base admin user
        $user = User::All()->first();
        $pool1 = Pool::factory()->candidatesAvailableInSearch()->create([
            'user_id' => $user['id'],
        ]);

        PoolCandidate::factory()->count(3)->create([
            'pool_id' => $pool1['id'],
            'expiry_date' => config('constants.far_future_date'),
            'application_status' => ApplicationStatus::QUALIFIED->name,
            'placement_type' => PlacementType::NOT_PLACED->name,
            'user_id' => User::factory([
                'is_woman' => false,
                'has_disability' => false,
                'is_visible_minority' => false,
                'indigenous_communities' => null,
            ]),
        ]);

        PoolCandidate::factory()->create([
            'pool_id' => $pool1['id'],
            'expiry_date' => config('constants.far_future_date'),
            'application_status' => ApplicationStatus::QUALIFIED->name,
            'placement_type' => PlacementType::NOT_PLACED->name,
            'user_id' => User::factory([
                'is_woman' => true,
                'has_disability' => false,
                'indigenous_communities' => [IndigenousCommunity::STATUS_FIRST_NATIONS->name],
                'is_visible_minority' => false,
            ]),
        ]);

        PoolCandidate::factory()->create([
            'pool_id' => $pool1['id'],
            'expiry_date' => config('constants.far_future_date'),
            'application_status' => ApplicationStatus::QUALIFIED->name,
            'placement_type' => PlacementType::NOT_PLACED->name,
            'user_id' => User::factory([
                'is_woman' => false,
                'has_disability' => true,
                'indigenous_communities' => [IndigenousCommunity::NON_STATUS_FIRST_NATIONS->name],
                'is_visible_minority' => false,
            ]),
        ]);

        PoolCandidate::factory()->create([
            'pool_id' => $pool1['id'],
            'expiry_date' => config('constants.far_future_date'),
            'application_status' => ApplicationStatus::QUALIFIED->name,
            'placement_type' => PlacementType::NOT_PLACED->name,
            'user_id' => User::factory([
                'is_woman' => false,
                'has_disability' => false,
                'indigenous_communities' => [IndigenousCommunity::INUIT->name],
                'is_visible_minority' => false,
            ]),
        ]);

        PoolCandidate::factory()->create([
            'pool_id' => $pool1['id'],
            'expiry_date' => config('constants.far_future_date'),
            'application_status' => ApplicationStatus::QUALIFIED->name,
            'placement_type' => PlacementType::NOT_PLACED->name,
            'user_id' => User::factory([
                'is_woman' => false,
                'has_disability' => false,
                'indigenous_communities' => [IndigenousCommunity::METIS->name],
                'is_visible_minority' => false,
            ]),
        ]);

        PoolCandidate::factory()->create([
            'pool_id' => $pool1['id'],
            'expiry_date' => config('constants.far_future_date'),
            'application_status' => ApplicationStatus::QUALIFIED->name,
            'placement_type' => PlacementType::NOT_PLACED->name,
            'user_id' => User::factory([
                'is_woman' => false,
                'has_disability' => false,
                'indigenous_communities' => [IndigenousCommunity::OTHER->name],
                'is_visible_minority' => false,
            ]),
        ]);

        PoolCandidate::factory()->create([
            'pool_id' => $pool1['id'],
            'expiry_date' => config('constants.far_future_date'),
            'application_status' => ApplicationStatus::QUALIFIED->name,
            'placement_type' => PlacementType::NOT_PLACED->name,
            'user_id' => User::factory([
                'is_woman' => false,
                'has_disability' => false,
                'indigenous_communities' => [IndigenousCommunity::LEGACY_IS_INDIGENOUS->name],
                'is_visible_minority' => false,
            ]),
        ]);

        // Assert query with only pools filter will return proper count
        $this->graphQL(
            /** @lang GraphQL */
            '
            query countApplicantsForSearch($where: ApplicantFilterInput) {
                countApplicantsForSearch(where: $where)
            }
        ',
            [
                'where' => [
                    'pools' => [
                        ['id' => $pool1['id']],
                    ],
                ],
            ]
        )->assertJson([
            'data' => [
                'countApplicantsForSearch' => 9,
            ],
        ]);

        // Assert query with false equity filter will return same as above
        $this->graphQL(
            /** @lang GraphQL */
            '
            query countApplicantsForSearch($where: ApplicantFilterInput) {
                countApplicantsForSearch(where: $where)
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
                ],
            ]
        )->assertJson([
            'data' => [
                'countApplicantsForSearch' => 9,
            ],
        ]);

        // Assert query if isWoman OR hasDisability is true
        $this->graphQL(
            /** @lang GraphQL */
            '
            query countApplicantsForSearch($where: ApplicantFilterInput) {
                countApplicantsForSearch(where: $where)
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
                ],
            ]
        )->assertJson([
            'data' => [
                'countApplicantsForSearch' => 2,
            ],
        ]);

        // Assert query will correctly filter for any indigenous community
        $this->graphQL(
            /** @lang GraphQL */
            '
            query countApplicantsForSearch($where: ApplicantFilterInput) {
                countApplicantsForSearch(where: $where)
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
                ],
            ]
        )->assertJson([
            'data' => [
                'countApplicantsForSearch' => 6,
            ],
        ]);
    }

    public function testCountApplicantsQueryLanguage(): void
    {
        $user = User::All()->first();
        $pool1 = Pool::factory()->candidatesAvailableInSearch()->create([
            'user_id' => $user['id'],
        ]);

        PoolCandidate::factory()->count(1)->create([
            'pool_id' => $pool1['id'],
            'expiry_date' => config('constants.far_future_date'),
            'application_status' => ApplicationStatus::QUALIFIED->name,
            'placement_type' => PlacementType::NOT_PLACED->name,
            'user_id' => User::factory([
                'looking_for_english' => true,
                'looking_for_french' => false,
                'looking_for_bilingual' => false,
            ]),
        ]);

        PoolCandidate::factory()->count(2)->create([
            'pool_id' => $pool1['id'],
            'expiry_date' => config('constants.far_future_date'),
            'application_status' => ApplicationStatus::QUALIFIED->name,
            'placement_type' => PlacementType::NOT_PLACED->name,
            'user_id' => User::factory([
                'looking_for_english' => false,
                'looking_for_french' => true,
                'looking_for_bilingual' => false,
            ]),
        ]);

        PoolCandidate::factory()->count(4)->create([
            'pool_id' => $pool1['id'],
            'expiry_date' => config('constants.far_future_date'),
            'application_status' => ApplicationStatus::QUALIFIED->name,
            'placement_type' => PlacementType::NOT_PLACED->name,
            'user_id' => User::factory([
                'looking_for_english' => false,
                'looking_for_french' => false,
                'looking_for_bilingual' => true,
            ]),
        ]);

        // Assert query with english filter will return proper count
        $this->graphQL(
            /** @lang GraphQL */
            '
            query countApplicantsForSearch($where: ApplicantFilterInput) {
                countApplicantsForSearch(where: $where)
            }
        ',
            [
                'where' => [
                    'pools' => [
                        ['id' => $pool1['id']],
                    ],
                    'languageAbility' => LanguageAbility::ENGLISH->name,
                ],
            ]
        )->assertJson([
            'data' => [
                'countApplicantsForSearch' => 1,
            ],
        ]);

        // Assert query with french filter will return proper count
        $this->graphQL(
            /** @lang GraphQL */
            '
            query countApplicantsForSearch($where: ApplicantFilterInput) {
                countApplicantsForSearch(where: $where)
            }
        ',
            [
                'where' => [
                    'pools' => [
                        ['id' => $pool1['id']],
                    ],
                    'languageAbility' => LanguageAbility::FRENCH->name,
                ],
            ]
        )->assertJson([
            'data' => [
                'countApplicantsForSearch' => 2,
            ],
        ]);

        // Assert query with bilingual filter will return proper count, only the bilingual candidates
        $this->graphQL(
            /** @lang GraphQL */
            '
            query countApplicantsForSearch($where: ApplicantFilterInput) {
                countApplicantsForSearch(where: $where)
            }
        ',
            [
                'where' => [
                    'pools' => [
                        ['id' => $pool1['id']],
                    ],
                    'languageAbility' => LanguageAbility::BILINGUAL->name,
                ],
            ]
        )->assertJson([
            'data' => [
                'countApplicantsForSearch' => 4,
            ],
        ]);
    }

    public function testCountApplicantsQueryEducation(): void
    {
        $user = User::All()->first();
        $pool1 = Pool::factory()->candidatesAvailableInSearch()->create([
            'user_id' => $user['id'],
        ]);

        PoolCandidate::factory()->count(3)->create([
            'pool_id' => $pool1['id'],
            'expiry_date' => config('constants.far_future_date'),
            'application_status' => ApplicationStatus::QUALIFIED->name,
            'placement_type' => PlacementType::NOT_PLACED->name,
            'user_id' => User::factory([
                'has_diploma' => false,
            ]),
        ]);

        PoolCandidate::factory()->count(4)->create([
            'pool_id' => $pool1['id'],
            'expiry_date' => config('constants.far_future_date'),
            'application_status' => ApplicationStatus::QUALIFIED->name,
            'placement_type' => PlacementType::NOT_PLACED->name,
            'user_id' => User::factory([
                'has_diploma' => true,
            ]),
        ]);

        // Assert query with false filter
        $this->graphQL(
            /** @lang GraphQL */
            '
            query countApplicantsForSearch($where: ApplicantFilterInput) {
                countApplicantsForSearch(where: $where)
            }
        ',
            [
                'where' => [
                    'pools' => [
                        ['id' => $pool1['id']],
                    ],
                    'hasDiploma' => false,
                ],
            ]
        )->assertJson([
            'data' => [
                'countApplicantsForSearch' => 7,
            ],
        ]);

        // Assert query with true diploma filter
        $this->graphQL(
            /** @lang GraphQL */
            '
            query countApplicantsForSearch($where: ApplicantFilterInput) {
                countApplicantsForSearch(where: $where)
            }
        ',
            [
                'where' => [
                    'pools' => [
                        ['id' => $pool1['id']],
                    ],
                    'hasDiploma' => true,
                ],
            ]
        )->assertJson([
            'data' => [
                'countApplicantsForSearch' => 4,
            ],
        ]);
    }

    public function testCountApplicantsQueryTemporary(): void
    {
        $user = User::All()->first();
        $pool1 = Pool::factory()->candidatesAvailableInSearch()->create([
            'user_id' => $user['id'],
        ]);

        PoolCandidate::factory()->count(3)->create([
            'pool_id' => $pool1['id'],
            'expiry_date' => config('constants.far_future_date'),
            'application_status' => ApplicationStatus::QUALIFIED->name,
            'placement_type' => PlacementType::NOT_PLACED->name,
            'user_id' => User::factory([
                'position_duration' => [PositionDuration::PERMANENT->name],
            ]),
        ]);

        PoolCandidate::factory()->count(4)->create([
            'pool_id' => $pool1['id'],
            'expiry_date' => config('constants.far_future_date'),
            'application_status' => ApplicationStatus::QUALIFIED->name,
            'placement_type' => PlacementType::NOT_PLACED->name,
            'user_id' => User::factory([
                'position_duration' => array_column(PositionDuration::cases(), 'name'),
            ]),
        ]);

        PoolCandidate::factory()->count(1)->create([
            'pool_id' => $pool1['id'],
            'expiry_date' => config('constants.far_future_date'),
            'application_status' => ApplicationStatus::QUALIFIED->name,
            'placement_type' => PlacementType::NOT_PLACED->name,
            'user_id' => User::factory([
                'position_duration' => null,
            ]),
        ]);

        // Assert null for position duration
        $this->graphQL(
            /** @lang GraphQL */
            '
            query countApplicantsForSearch($where: ApplicantFilterInput) {
                countApplicantsForSearch(where: $where)
            }
        ',
            [
                'where' => [
                    'pools' => [
                        ['id' => $pool1['id']],
                    ],
                    'positionDuration' => null,
                ],
            ]
        )->assertJson([
            'data' => [
                'countApplicantsForSearch' => 8,
            ],
        ]);

        // Assert temporary duration
        $this->graphQL(
            /** @lang GraphQL */
            '
            query countApplicantsForSearch($where: ApplicantFilterInput) {
                countApplicantsForSearch(where: $where)
            }
        ',
            [
                'where' => [
                    'pools' => [
                        ['id' => $pool1['id']],
                    ],
                    'positionDuration' => [PositionDuration::TEMPORARY->name],
                ],
            ]
        )->assertJson([
            'data' => [
                'countApplicantsForSearch' => 4,
            ],
        ]);

        // Assert temporary and permanent duration
        $this->graphQL(
            /** @lang GraphQL */
            '
            query countApplicantsForSearch($where: ApplicantFilterInput) {
                countApplicantsForSearch(where: $where)
            }
        ',
            [
                'where' => [
                    'pools' => [
                        ['id' => $pool1['id']],
                    ],
                    'positionDuration' => array_column(PositionDuration::cases(), 'name'),
                ],
            ]
        )->assertJson([
            'data' => [
                'countApplicantsForSearch' => 7,
            ],
        ]);
    }

    public function testCountApplicantsQueryConditionsEmployment(): void
    {
        $user = User::All()->first();
        $pool1 = Pool::factory()->candidatesAvailableInSearch()->create([
            'user_id' => $user['id'],
        ]);

        PoolCandidate::factory()->count(1)->create([
            'pool_id' => $pool1['id'],
            'expiry_date' => config('constants.far_future_date'),
            'application_status' => ApplicationStatus::QUALIFIED->name,
            'placement_type' => PlacementType::NOT_PLACED->name,
            'user_id' => User::factory([
                'accepted_operational_requirements' => [],
            ]),
        ]);

        PoolCandidate::factory()->count(2)->create([
            'pool_id' => $pool1['id'],
            'expiry_date' => config('constants.far_future_date'),
            'application_status' => ApplicationStatus::QUALIFIED->name,
            'placement_type' => PlacementType::NOT_PLACED->name,
            'user_id' => User::factory([
                'accepted_operational_requirements' => ['SHIFT_WORK'],
            ]),
        ]);

        PoolCandidate::factory()->count(4)->create([
            'pool_id' => $pool1['id'],
            'expiry_date' => config('constants.far_future_date'),
            'application_status' => ApplicationStatus::QUALIFIED->name,
            'placement_type' => PlacementType::NOT_PLACED->name,
            'user_id' => User::factory([
                'accepted_operational_requirements' => ['SHIFT_WORK', 'TRAVEL'],
            ]),
        ]);

        // Assert empty operational requirements
        $this->graphQL(
            /** @lang GraphQL */
            '
            query countApplicantsForSearch($where: ApplicantFilterInput) {
                countApplicantsForSearch(where: $where)
            }
        ',
            [
                'where' => [
                    'pools' => [
                        ['id' => $pool1['id']],
                    ],
                    'operationalRequirements' => [],
                ],
            ]
        )->assertJson([
            'data' => [
                'countApplicantsForSearch' => 7,
            ],
        ]);

        // Assert one operational requirements
        $this->graphQL(
            /** @lang GraphQL */
            '
            query countApplicantsForSearch($where: ApplicantFilterInput) {
                countApplicantsForSearch(where: $where)
            }
        ',
            [
                'where' => [
                    'pools' => [
                        ['id' => $pool1['id']],
                    ],
                    'operationalRequirements' => [OperationalRequirement::SHIFT_WORK->name],
                ],
            ]
        )->assertJson([
            'data' => [
                'countApplicantsForSearch' => 6,
            ],
        ]);

        // Assert two operational requirements
        $this->graphQL(
            /** @lang GraphQL */
            '
            query countApplicantsForSearch($where: ApplicantFilterInput) {
                countApplicantsForSearch(where: $where)
            }
        ',
            [
                'where' => [
                    'pools' => [
                        ['id' => $pool1['id']],
                    ],
                    'operationalRequirements' => [OperationalRequirement::SHIFT_WORK->name, OperationalRequirement::TRAVEL->name],
                ],
            ]
        )->assertJson([
            'data' => [
                'countApplicantsForSearch' => 4,
            ],
        ]);
    }

    public function testCountApplicantsQuerySkillsIntersectional(): void
    {
        // recycle skills testing //
        $user = User::All()->first();
        $pool1 = Pool::factory()->candidatesAvailableInSearch()->create([
            'user_id' => $user['id'],
        ]);
        $skill1 = Skill::factory()->create();
        $skill2 = Skill::factory()->create();
        $skill3 = Skill::factory()->create();

        PoolCandidate::factory()->count(1)->create([
            'pool_id' => $pool1['id'],
            'expiry_date' => config('constants.far_future_date'),
            'application_status' => ApplicationStatus::QUALIFIED->name,
            'placement_type' => PlacementType::NOT_PLACED->name,
            'user_id' => User::factory([]),
        ]);

        PoolCandidate::factory()->count(2)->sequence(fn () => [
            'pool_id' => $pool1->id,
            'expiry_date' => config('constants.far_future_date'),
            'application_status' => ApplicationStatus::QUALIFIED->name,
            'placement_type' => PlacementType::NOT_PLACED->name,
            'user_id' => User::factory([])->afterCreating(function ($user) use ($skill1) {
                AwardExperience::factory()
                    ->for($user)
                    ->afterCreating(function ($model) use ($skill1) {
                        $model->syncSkills([$skill1->only('id')]);
                    })->create();
                WorkExperience::factory()
                    ->for($user)
                    ->afterCreating(function ($model) use ($skill1) {
                        $model->syncSkills([$skill1->only('id')]);
                    })->create();
            })->create(),
        ])->create();

        PoolCandidate::factory()->count(4)->sequence(fn () => [
            'pool_id' => $pool1->id,
            'expiry_date' => config('constants.far_future_date'),
            'application_status' => ApplicationStatus::QUALIFIED->name,
            'placement_type' => PlacementType::NOT_PLACED->name,
            'user_id' => User::factory([])->afterCreating(function ($user) use ($skill1, $skill2) {
                CommunityExperience::factory()
                    ->for($user)
                    ->afterCreating(function ($model) use ($skill1) {
                        $model->syncSkills([$skill1->only('id')]);
                    })->create();
                PersonalExperience::factory()
                    ->for($user)
                    ->afterCreating(function ($model) use ($skill2) {
                        $model->syncSkills([$skill2->only('id')]);
                    })->create();
            })->create(),
        ])->create();

        // Assert nothing for skills
        $this->graphQL(
            /** @lang GraphQL */
            '
            query countApplicantsForSearch($where: ApplicantFilterInput) {
                countApplicantsForSearch(where: $where)
            }
        ',
            [
                'where' => [
                    'pools' => [
                        ['id' => $pool1['id']],
                    ],
                ],
            ]
        )->assertJson([
            'data' => [
                'countApplicantsForSearch' => 7,
            ],
        ]);

        // Assert empty skills array
        $this->graphQL(
            /** @lang GraphQL */
            '
            query countApplicantsForSearch($where: ApplicantFilterInput) {
                countApplicantsForSearch(where: $where)
            }
        ',
            [
                'where' => [
                    'pools' => [
                        ['id' => $pool1['id']],
                    ],
                    'skillsIntersectional' => [],
                ],
            ]
        )->assertJson([
            'data' => [
                'countApplicantsForSearch' => 7,
            ],
        ]);

        // Assert one skill
        $this->graphQL(
            /** @lang GraphQL */
            '
            query countApplicantsForSearch($where: ApplicantFilterInput) {
                countApplicantsForSearch(where: $where)
            }
        ',
            [
                'where' => [
                    'pools' => [
                        ['id' => $pool1['id']],
                    ],
                    'skillsIntersectional' => [
                        ['id' => $skill1['id']],
                    ],
                ],
            ]
        )->assertJson([
            'data' => [
                'countApplicantsForSearch' => 7,
            ],
        ]);

        // Assert two skills
        $this->graphQL(
            /** @lang GraphQL */
            '
            query countApplicantsForSearch($where: ApplicantFilterInput) {
                countApplicantsForSearch(where: $where)
            }
        ',
            [
                'where' => [
                    'pools' => [
                        ['id' => $pool1['id']],
                    ],
                    'skillsIntersectional' => [
                        ['id' => $skill1['id']],
                        ['id' => $skill2['id']],
                    ],
                ],
            ]
        )->assertJson([
            'data' => [
                'countApplicantsForSearch' => 7,
            ],
        ]);

        // Assert unused skill
        $this->graphQL(
            /** @lang GraphQL */
            '
            query countApplicantsForSearch($where: ApplicantFilterInput) {
                countApplicantsForSearch(where: $where)
            }
        ',
            [
                'where' => [
                    'pools' => [
                        ['id' => $pool1['id']],
                    ],
                    'skillsIntersectional' => [
                        ['id' => $skill3['id']],
                    ],
                ],
            ]
        )->assertJson([
            'data' => [
                'countApplicantsForSearch' => 7,
            ],
        ]);
    }

    public function testCountApplicantsQuerySkillsAdditive(): void
    {
        $user = User::All()->first();
        $pool1 = Pool::factory()->candidatesAvailableInSearch()->create([
            'user_id' => $user['id'],
        ]);
        $skill1 = Skill::factory()->create();
        $skill2 = Skill::factory()->create();
        $skill3 = Skill::factory()->create();

        PoolCandidate::factory()->count(1)->create([
            'pool_id' => $pool1['id'],
            'expiry_date' => config('constants.far_future_date'),
            'application_status' => ApplicationStatus::QUALIFIED->name,
            'placement_type' => PlacementType::NOT_PLACED->name,
            'user_id' => User::factory([]),
        ]);

        PoolCandidate::factory()->count(2)->sequence(fn () => [
            'pool_id' => $pool1->id,
            'expiry_date' => config('constants.far_future_date'),
            'application_status' => ApplicationStatus::QUALIFIED->name,
            'placement_type' => PlacementType::NOT_PLACED->name,
            'user_id' => User::factory([])->afterCreating(function ($user) use ($skill1) {
                AwardExperience::factory()
                    ->for($user)
                    ->afterCreating(function ($model) use ($skill1) {
                        $model->syncSkills([$skill1->only('id')]);
                    })->create();
            })->create(),
        ])->create();

        PoolCandidate::factory()->count(4)->sequence(fn () => [
            'pool_id' => $pool1->id,
            'expiry_date' => config('constants.far_future_date'),
            'application_status' => ApplicationStatus::QUALIFIED->name,
            'placement_type' => PlacementType::NOT_PLACED->name,
            'user_id' => User::factory([])->afterCreating(function ($user) use ($skill1, $skill2) {
                CommunityExperience::factory()
                    ->for($user)
                    ->afterCreating(function ($model) use ($skill1) {
                        $model->syncSkills([$skill1->only('id')]);
                    })->create();
                PersonalExperience::factory()
                    ->for($user)
                    ->afterCreating(function ($model) use ($skill2) {
                        $model->syncSkills([$skill2->only('id')]);
                    })->create();
            })->create(),
        ])->create();

        // Assert empty skills array
        $this->graphQL(
            /** @lang GraphQL */
            '
            query countApplicantsForSearch($where: ApplicantFilterInput) {
                countApplicantsForSearch(where: $where)
            }
        ',
            [
                'where' => [
                    'pools' => [
                        ['id' => $pool1['id']],
                    ],
                    'skills' => [],
                ],
            ]
        )->assertJson([
            'data' => [
                'countApplicantsForSearch' => 7,
            ],
        ]);

        // Assert one skill
        $this->graphQL(
            /** @lang GraphQL */
            '
            query countApplicantsForSearch($where: ApplicantFilterInput) {
                countApplicantsForSearch(where: $where)
            }
        ',
            [
                'where' => [
                    'pools' => [
                        ['id' => $pool1['id']],
                    ],
                    'skills' => [
                        ['id' => $skill1['id']],
                    ],
                ],
            ]
        )->assertJson([
            'data' => [
                'countApplicantsForSearch' => 6,
            ],
        ]);

        // Assert two skills, returns 4 candidates despite them not possessing $skill3
        $this->graphQL(
            /** @lang GraphQL */
            '
            query countApplicantsForSearch($where: ApplicantFilterInput) {
                countApplicantsForSearch(where: $where)
            }
        ',
            [
                'where' => [
                    'pools' => [
                        ['id' => $pool1['id']],
                    ],
                    'skills' => [
                        ['id' => $skill2['id']],
                        ['id' => $skill3['id']],
                    ],
                ],
            ]
        )->assertJson([
            'data' => [
                'countApplicantsForSearch' => 4,
            ],
        ]);

        // Assert unused skill
        $this->graphQL(
            /** @lang GraphQL */
            '
            query countApplicantsForSearch($where: ApplicantFilterInput) {
                countApplicantsForSearch(where: $where)
            }
        ',
            [
                'where' => [
                    'pools' => [
                        ['id' => $pool1['id']],
                    ],
                    'skills' => [
                        ['id' => $skill3['id']],
                    ],
                ],
            ]
        )->assertJson([
            'data' => [
                'countApplicantsForSearch' => 0,
            ],
        ]);
    }

    public function testPriorityWeight(): void
    {
        // test generated property that exists on type User and Applicant from model User.php

        // create candidates
        $candidateOne = User::factory()->create([
            'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
            'has_priority_entitlement' => true,
            'armed_forces_status' => ArmedForcesStatus::VETERAN->name,
            'citizenship' => CitizenshipStatus::CITIZEN->name,
        ]);
        $candidateTwo = User::factory()->create([
            'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
            'has_priority_entitlement' => false,
            'armed_forces_status' => ArmedForcesStatus::VETERAN->name,
            'citizenship' => CitizenshipStatus::CITIZEN->name,
        ]);
        $candidateThree = User::factory()->create([
            'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
            'has_priority_entitlement' => false,
            'armed_forces_status' => ArmedForcesStatus::NON_CAF->name,
            'citizenship' => CitizenshipStatus::CITIZEN->name,
        ]);
        $candidateFour = User::factory()->create([
            'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14',
            'has_priority_entitlement' => false,
            'armed_forces_status' => ArmedForcesStatus::NON_CAF->name,
            'citizenship' => CitizenshipStatus::OTHER->name,
        ]);

        // Assert candidate one returns 10
        $this->actingAs($this->adminUser, 'api')
            ->graphQL(
                /** @lang GraphQL */
                '
            query user($id: UUID!) {
                user(id: $id) {
                    priorityWeight
                }
            }
            ',
                [
                    'id' => $candidateOne->id,
                ]
            )->assertJson([
                'data' => [
                    'user' => [
                        'priorityWeight' => 10,
                    ],
                ],
            ]);

        // Assert candidate two returns 20
        $this->actingAs($this->adminUser, 'api')
            ->graphQL(
                /** @lang GraphQL */
                '
            query user($id: UUID!) {
                user(id: $id) {
                    priorityWeight
                }
            }
            ',
                [
                    'id' => $candidateTwo->id,
                ]
            )->assertJson([
                'data' => [
                    'user' => [
                        'priorityWeight' => 20,
                    ],
                ],
            ]);

        // Assert candidate three returns 30
        $this->actingAs($this->adminUser, 'api')
            ->graphQL(
                /** @lang GraphQL */
                '
            query user($id: UUID!) {
                user(id: $id) {
                    priorityWeight
                }
            }
            ',
                [
                    'id' => $candidateThree->id,
                ]
            )->assertJson([
                'data' => [
                    'user' => [
                        'priorityWeight' => 30,
                    ],
                ],
            ]);

        // Assert candidate four returns 40
        $this->actingAs($this->adminUser, 'api')
            ->graphQL(
                /** @lang GraphQL */
                '
            query user($id: UUID!) {
                user(id: $id) {
                    priorityWeight
                }
            }
            ',
                [
                    'id' => $candidateFour->id,
                ]
            )->assertJson([
                'data' => [
                    'user' => [
                        'priorityWeight' => 40,
                    ],
                ],
            ]);
    }

    public function testStatusWeight(): void
    {
        // test generated property that exists on type PoolCandidate from model PoolCandidate.php
        $pool = Pool::factory()->candidatesAvailableInSearch()->create();

        $candidate = PoolCandidate::factory()->create([
            'pool_id' => $pool->id,
            'user_id' => $this->adminUser->id,
            'expiry_date' => config('constants.far_future_date'),
            'application_status' => ApplicationStatus::DRAFT->name,
        ]);

        $query =
            /** @lang GraphQL */
            '
            query poolCandidate($id: UUID!) {
                poolCandidate(id: $id) {
                    statusWeight
                    status { value }
                }
            }
        ';

        $variables = ['id' => $candidate->id];

        // Assert candidate one DRAFT is 10
        $this->actingAs($this->adminUser, 'api')
            ->graphQL($query, $variables)->assertJson([
                'data' => [
                    'poolCandidate' => [
                        'statusWeight' => 10,
                        'status' => [
                            'value' => ApplicationStatus::DRAFT->name,
                        ],
                    ],
                ],
            ]);

        $candidate->update([
            'expiry_date' => config('constants.far_future_date'),
            'submitted_at' => config('constants.past_date'),
            'application_status' => ApplicationStatus::TO_ASSESS->name,
            'screening_stage' => ScreeningStage::NEW_APPLICATION->name,
        ]);

        // Assert candidate one TO_ASSESS is 20
        $this->actingAs($this->adminUser, 'api')
            ->graphQL($query, $variables)->assertJson([
                'data' => [
                    'poolCandidate' => [
                        'statusWeight' => 20,
                        'status' => [
                            'value' => ApplicationStatus::TO_ASSESS->name,
                        ],
                    ],
                ],
            ]);

        $candidate->update([
            'application_status' => ApplicationStatus::DISQUALIFIED->name,
            'disqualification_reason' => DisqualificationReason::SCREENED_OUT_ASSESSMENT->name,
        ]);

        // Assert candidate one DISQUALIFIED is 30
        $this->actingAs($this->adminUser, 'api')
            ->graphQL($query, $variables)->assertJson([
                'data' => [
                    'poolCandidate' => [
                        'statusWeight' => 30,
                        'status' => [
                            'value' => ApplicationStatus::DISQUALIFIED->name,
                        ],
                    ],
                ],
            ]);

        $candidate->update([
            'application_status' => ApplicationStatus::QUALIFIED->name,
        ]);

        // Assert candidate one QUALIFIED is 40
        $this->actingAs($this->adminUser, 'api')
            ->graphQL($query, $variables)->assertJson([
                'data' => [
                    'poolCandidate' => [
                        'statusWeight' => 40,
                        'status' => [
                            'value' => ApplicationStatus::QUALIFIED->name,
                        ],
                    ],
                ],
            ]);

        $candidate->update([
            'application_status' => ApplicationStatus::REMOVED->name,
            'removal_reason' => CandidateRemovalReason::REQUESTED_TO_BE_WITHDRAWN->name,
        ]);

        // Assert candidate one REMOVED is 50
        $this->actingAs($this->adminUser, 'api')
            ->graphQL($query, $variables)->assertJson([
                'data' => [
                    'poolCandidate' => [
                        'statusWeight' => 50,
                        'status' => [
                            'value' => ApplicationStatus::REMOVED->name,
                        ],
                    ],
                ],
            ]);
    }

    public function testSortingStatusThenPriority(): void
    {
        $user = User::All()->first();
        $pool1 = Pool::factory()->candidatesAvailableInSearch()->create([
            'user_id' => $user['id'],
        ]);

        // DRAFT, NOT PRESENT
        $candidateOne = PoolCandidate::factory()->create([
            'pool_id' => $pool1['id'],
            'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
            'expiry_date' => config('constants.far_future_date'),
            'application_status' => ApplicationStatus::DRAFT->name,
            'user_id' => User::factory([
                'has_priority_entitlement' => true,
                'armed_forces_status' => ArmedForcesStatus::VETERAN->name,
                'citizenship' => CitizenshipStatus::CITIZEN->name,
            ]),
        ]);
        // NEW APPLICATION, NO PRIORITY SO SECOND
        $candidateTwo = PoolCandidate::factory()->create([
            'pool_id' => $pool1['id'],
            'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
            'expiry_date' => config('constants.far_future_date'),
            'submitted_at' => config('constants.past_date'),
            'application_status' => ApplicationStatus::TO_ASSESS->name,
            'screening_stage' => ScreeningStage::NEW_APPLICATION->name,
            'user_id' => User::factory([
                'has_priority_entitlement' => false,
                'armed_forces_status' => ArmedForcesStatus::NON_CAF->name,
                'citizenship' => CitizenshipStatus::OTHER->name,
            ]),
        ]);
        // APPLICATION REVIEW, NO PRIORITY SO THIRD
        $candidateThree = PoolCandidate::factory()->create([
            'pool_id' => $pool1['id'],
            'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
            'expiry_date' => config('constants.far_future_date'),
            'submitted_at' => config('constants.past_date'),
            'application_status' => ApplicationStatus::TO_ASSESS->name,
            'screening_stage' => ScreeningStage::APPLICATION_REVIEW->name,
            'user_id' => User::factory([
                'has_priority_entitlement' => false,
                'armed_forces_status' => ArmedForcesStatus::NON_CAF->name,
                'citizenship' => CitizenshipStatus::OTHER->name,
            ]),
        ]);

        // NEW APPLICATION, VETERAN SO FIRST
        $candidateFour = PoolCandidate::factory()->create([
            'pool_id' => $pool1['id'],
            'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14',
            'expiry_date' => config('constants.far_future_date'),
            'submitted_at' => config('constants.past_date'),
            'application_status' => ApplicationStatus::TO_ASSESS->name,
            'screening_stage' => ScreeningStage::NEW_APPLICATION->name,
            'user_id' => User::factory([
                'has_priority_entitlement' => false,
                'armed_forces_status' => ArmedForcesStatus::VETERAN->name,
                'citizenship' => CitizenshipStatus::CITIZEN->name,
            ]),
        ]);
        // QUALIFIED AVAILABLE, HAS ENTITLEMENT FOURTH
        $candidateFive = PoolCandidate::factory()->create([
            'pool_id' => $pool1['id'],
            'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15',
            'expiry_date' => config('constants.far_future_date'),
            'submitted_at' => config('constants.past_date'),
            'application_status' => ApplicationStatus::QUALIFIED->name,
            'user_id' => User::factory([
                'has_priority_entitlement' => true,
                'armed_forces_status' => ArmedForcesStatus::VETERAN->name,
                'citizenship' => CitizenshipStatus::CITIZEN->name,
            ]),
        ]);

        // Assert the order is correct
        $this->actingAs($this->adminUser, 'api')
            ->graphQL(
                /** @lang GraphQL */
                '
            query poolCandidatesPaginatedAdminView {
                poolCandidatesPaginatedAdminView (
                    orderBy: [
                    { column: "status_weight", order: ASC }
                    { user: { aggregate: MAX, column: PRIORITY_WEIGHT }, order: ASC }
                    { column: "id", order: ASC }
                  ])
                {
                    data
                    {
                        id
                    }
                }
            }
            ',
            )->assertJson([
                'data' => [
                    'poolCandidatesPaginatedAdminView' => [
                        'data' => [
                            ['id' => $candidateFour->id],
                            ['id' => $candidateTwo->id],
                            ['id' => $candidateThree->id],
                            ['id' => $candidateFive->id],
                        ],
                    ],
                ],
            ]);

        // Assert that DRAFT is not retrieved
        $this->actingAs($this->adminUser, 'api')
            ->graphQL(
                /** @lang GraphQL */
                '
            query poolCandidatesPaginatedAdminView {
                poolCandidatesPaginatedAdminView (
                    orderBy: [
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
            ',
            )->assertDontSeeText(ApplicationStatus::DRAFT->name);
    }

    public function testNullFilterEqualsUndefinedPoolCandidate()
    {
        // setup
        $pool = Pool::factory()->candidatesAvailableInSearch()->create([
            'user_id' => $this->adminUser->id,
        ]);
        User::factory()
            ->count(60)
            ->afterCreating(function (User $user) use ($pool) {
                PoolCandidate::factory()->count(1)->sequence(fn () => [
                    'pool_id' => $pool->id,
                    'user_id' => $user->id,
                    'expiry_date' => config('constants.far_future_date'),
                    'submitted_at' => config('constants.past_date'),
                    'application_status' => ApplicationStatus::QUALIFIED->name, // ensuring this passes the notDraft scope
                ])->create();
            })
            ->create();

        // empty input
        $this->actingAs($this->adminUser, 'api')
            ->graphQL(
                /** @lang GraphQL */
                '
            query poolCandidatesPaginatedAdminView($where: PoolCandidateSearchInput) {
                poolCandidatesPaginatedAdminView(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ',
                [
                    'where' => [],
                ]
            )->assertJson([
                'data' => [
                    'poolCandidatesPaginatedAdminView' => [
                        'paginatorInfo' => [
                            'total' => 60,
                        ],
                    ],
                ],
            ]);

        // null input
        $this->actingAs($this->adminUser, 'api')
            ->graphQL(
                /** @lang GraphQL */
                '
            query poolCandidatesPaginatedAdminView($where: PoolCandidateSearchInput) {
                poolCandidatesPaginatedAdminView(where: $where) {
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
                        'statuses' => null,

                    ],
                ]
            )->assertJson([
                'data' => [
                    'poolCandidatesPaginatedAdminView' => [
                        'paginatorInfo' => [
                            'total' => 60,
                        ],
                    ],
                ],
            ]);
    }

    public function testOnlyItJobsAppear()
    {
        $itPool = Pool::factory()->candidatesAvailableInSearch()->create([
            'user_id' => $this->adminUser->id,
        ]);
        PoolCandidate::factory()->availableInSearch()->create([
            'pool_id' => $itPool->id,
        ]);
        $execPool = Pool::factory()->published()->create([
            'user_id' => $this->adminUser->id,
            'publishing_group' => PublishingGroup::EXECUTIVE_JOBS->name,
        ]);
        PoolCandidate::factory()->availableInSearch()->create([
            'pool_id' => $execPool->id,
        ]);

        $this->graphQL(
            /** @lang GraphQL */
            '
            query countApplicantsForSearch($where: ApplicantFilterInput) {
                countApplicantsForSearch(where: $where)
            }
        ',
            [
                'where' => [],
            ]
        )->assertJson([
            'data' => [
                'countApplicantsForSearch' => 1,
            ],
        ]);
    }

    public function testEmploymentEquity(): void
    {
        $itPool = Pool::factory()->candidatesAvailableInSearch()->create([
            'user_id' => $this->adminUser->id,
        ]);

        $disabledUser = User::factory()->create([
            'has_disability' => true,
            'is_woman' => false,
            'is_visible_minority' => false,
            'indigenous_communities' => [],
        ]);
        PoolCandidate::factory()->availableInSearch()->create([
            'pool_id' => $itPool->id,
            'user_id' => $disabledUser->id,
        ]);

        $womanUser = User::factory()->create([
            'has_disability' => false,
            'is_woman' => true,
            'is_visible_minority' => false,
            'indigenous_communities' => [],
        ]);
        PoolCandidate::factory()->availableInSearch()->create([
            'pool_id' => $itPool->id,
            'user_id' => $womanUser->id,
        ]);

        $visibleMinorityUser = User::factory()->create([
            'has_disability' => false,
            'is_woman' => false,
            'is_visible_minority' => true,
            'indigenous_communities' => [],
        ]);
        PoolCandidate::factory()->availableInSearch()->create([
            'pool_id' => $itPool->id,
            'user_id' => $visibleMinorityUser->id,
        ]);

        $indigenousUser = User::factory()->create([
            'has_disability' => false,
            'is_woman' => false,
            'is_visible_minority' => false,
            'indigenous_communities' => [IndigenousCommunity::OTHER->name],
        ]);
        PoolCandidate::factory()->availableInSearch()->create([
            'pool_id' => $itPool->id,
            'user_id' => $indigenousUser->id,
        ]);

        $allGroupsUser = User::factory()->create([
            'has_disability' => true,
            'is_woman' => true,
            'is_visible_minority' => true,
            'indigenous_communities' => [IndigenousCommunity::OTHER->name],
        ]);
        PoolCandidate::factory()->availableInSearch()->create([
            'pool_id' => $itPool->id,
            'user_id' => $allGroupsUser->id,
        ]);

        $query = /** @lang GraphQL */ '
            query poolCandidatesPaginatedAdminView($where: PoolCandidateSearchInput) {
                poolCandidatesPaginatedAdminView(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ';

        $expectedJson = [
            'data' => [
                'poolCandidatesPaginatedAdminView' => [
                    'paginatorInfo' => [
                        'total' => 2,
                    ],
                ],
            ],
        ];

        // Returns 2 disabled users
        $this->actingAs($this->adminUser, 'api')
            ->graphQL($query,
                [
                    'where' => [
                        'applicantFilter' => [
                            'equity' => ['hasDisability' => true],
                        ],
                    ],
                ]
            )->assertJson($expectedJson);

        // Returns 2 women
        $this->actingAs($this->adminUser, 'api')
            ->graphQL($query,
                [
                    'where' => [
                        'applicantFilter' => [
                            'equity' => ['isWoman' => true],
                        ],
                    ],
                ]
            )->assertJson($expectedJson);

        // Returns 2 visible minorities
        $this->actingAs($this->adminUser, 'api')
            ->graphQL($query,
                [
                    'where' => [
                        'applicantFilter' => [
                            'equity' => ['isVisibleMinority' => true],
                        ],
                    ],
                ]
            )->assertJson($expectedJson);

        // Returns 2 Indigenous users
        $this->actingAs($this->adminUser, 'api')
            ->graphQL($query,
                [
                    'where' => [
                        'applicantFilter' => [
                            'equity' => ['isIndigenous' => true],
                        ],
                    ],
                ]
            )->assertJson($expectedJson);

        // Returns all users
        $this->actingAs($this->adminUser, 'api')
            ->graphQL($query,
                [
                    'where' => [
                        'applicantFilter' => [
                            'equity' => [
                                'hasDisability' => true,
                                'isWoman' => true,
                                'isVisibleMinority' => true,
                                'isIndigenous' => true,
                            ],
                        ],
                    ],
                ]
            )->assertJson([
                'data' => [
                    'poolCandidatesPaginatedAdminView' => [
                        'paginatorInfo' => [
                            'total' => 5,
                        ],
                    ],
                ],
            ]);

    }

    public function testClassificationAndStreamsFilter()
    {
        $targetClassification = Classification::factory()->create();
        $excludedClassification = Classification::factory()->create();

        $targetStream = WorkStream::factory()->create();
        $excludedStream = WorkStream::factory()->create();

        $targetClassificationPool = Pool::factory()->candidatesAvailableInSearch()->create([
            'classification_id' => $targetClassification,
            'work_stream_id' => $excludedStream->id,
        ]);
        $targetStreamPool = Pool::factory()->candidatesAvailableInSearch()->create([
            'classification_id' => $excludedClassification,
            'work_stream_id' => $targetStream->id,
        ]);
        $targetStreamAndClassificationPool = Pool::factory()->candidatesAvailableInSearch()->create([
            'classification_id' => $targetClassification,
            'work_stream_id' => $targetStream->id,
        ]);
        $excludedPool = Pool::factory()->candidatesAvailableInSearch()->create([
            'classification_id' => $excludedClassification,
            'work_stream_id' => $excludedStream->id,
        ]);

        $targetUser = User::factory()->create();
        $targetClassificationUser = User::factory()->create();
        $targetStreamUser = User::factory()->create();
        $excludedUser = User::factory()->create();

        // Should show up for classification filter only
        PoolCandidate::factory()->availableInSearch()->create([
            'user_id' => $targetUser,
            'pool_id' => $targetClassificationPool,
        ]);

        // Should should up for stream filter only
        PoolCandidate::factory()->availableInSearch()->create([
            'user_id' => $targetUser,
            'pool_id' => $targetStreamPool,
        ]);

        // Should show up for both stream + classification filters
        PoolCandidate::factory()->availableInSearch()->create([
            'user_id' => $targetUser,
            'pool_id' => $targetStreamAndClassificationPool,
        ]);

        // Should show up for classification filter only
        PoolCandidate::factory()->availableInSearch()->create([
            'user_id' => $targetClassificationUser,
            'pool_id' => $targetClassificationPool,
        ]);

        // Should should up for stream filter only
        PoolCandidate::factory()->availableInSearch()->create([
            'user_id' => $targetStreamUser,
            'pool_id' => $targetStreamPool,
        ]);

        // Should never show up
        PoolCandidate::factory()->availableInSearch()->create([
            'user_id' => $targetUser,
            'pool_id' => $excludedPool,
        ]);

        // Should never show up
        PoolCandidate::factory()->availableInSearch()->create([
            'user_id' => $excludedUser,
            'pool_id' => $excludedPool,
        ]);

        $query = /* GraphQL */ '
            query countApplicantsForSearch($where: ApplicantFilterInput) {
                countApplicantsForSearch(where: $where)
            }
        ';

        $this->actingAs($this->adminUser, 'api')
            ->graphQL($query,
                [
                    'where' => [
                        'qualifiedInClassifications' => [
                            [
                                'group' => $targetClassification->group,
                                'level' => $targetClassification->level,
                            ],
                        ],
                    ],
                ]
            )->assertJson([
                'data' => [
                    'countApplicantsForSearch' => 2,
                ],
            ]);

        $this->actingAs($this->adminUser, 'api')
            ->graphQL($query,
                [
                    'where' => [
                        'qualifiedInWorkStreams' => [['id' => $targetStream->id]],
                    ],
                ]
            )->assertJson([
                'data' => [
                    'countApplicantsForSearch' => 2,
                ],
            ]);

        $this->actingAs($this->adminUser, 'api')
            ->graphQL($query,
                [
                    'where' => [
                        'qualifiedInClassifications' => [
                            [
                                'group' => $targetClassification->group,
                                'level' => $targetClassification->level,
                            ],
                        ],
                        'qualifiedInWorkStreams' => [[
                            'id' => $targetStream->id,
                        ]],
                    ],
                ]
            )->assertJson([
                'data' => [
                    'countApplicantsForSearch' => 1,
                ],
            ]);

    }
}
