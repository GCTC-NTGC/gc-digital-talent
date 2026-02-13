<?php

namespace Tests\Feature;

use App\Enums\ApplicationStatus;
use App\Enums\ArmedForcesStatus;
use App\Enums\CandidateExpiryFilter;
use App\Enums\CandidateRemovalReason;
use App\Enums\CandidateSuspendedFilter;
use App\Enums\CitizenshipStatus;
use App\Enums\PlacementType;
use App\Enums\ScreeningStage;
use App\Facades\Notify;
use App\Models\AssessmentStep;
use App\Models\Classification;
use App\Models\Community;
use App\Models\Pool;
use App\Models\PoolCandidate;
use App\Models\User;
use Carbon\Carbon;
use Database\Seeders\DepartmentSeeder;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Arr;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Tests\TestCase;
use Tests\UsesProtectedGraphqlEndpoint;

class PoolCandidateSearchTest extends TestCase
{
    use MakesGraphQLRequests;
    use RefreshDatabase;
    use RefreshesSchemaCache;
    use UsesProtectedGraphqlEndpoint;

    protected $processOperator;

    protected $communityRecruiter;

    protected $community;

    protected $pool;

    protected function setUp(): void
    {
        parent::setUp();
        Notify::spy(); // don't send any notifications
        $this->seed([RolePermissionSeeder::class,  DepartmentSeeder::class]);

        $this->community = Community::factory()->create();
        $this->pool = Pool::factory()
            ->withAssessmentSteps()
            ->create([
                'community_id' => $this->community->id,
            ]);
        $this->processOperator = User::factory()
            ->asApplicant()
            ->asProcessOperator($this->pool->id)
            ->create([
                'email' => 'process-operator@test.com',
                'sub' => 'process-operator@test.com',
            ]);
        $this->communityRecruiter = User::factory()
            ->asApplicant()
            ->asCommunityRecruiter($this->community->id)
            ->create([
                'email' => 'community-recruiter@test.com',
                'sub' => 'community-recruiter@test.com',
            ]);
    }

    public function testPoolCandidatesSearchFilter(): void
    {
        // DRAFT, NOT PRESENT
        PoolCandidate::factory()->for($this->pool)->create([
            'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
            'user_id' => User::factory([
                'has_priority_entitlement' => true,
                'armed_forces_status' => ArmedForcesStatus::VETERAN->name,
                'citizenship' => CitizenshipStatus::CITIZEN->name,
                'has_diploma' => false,
                'is_woman' => false,
            ]),
        ]);
        // NEW APPLICATION, NO PRIORITY SO SECOND
        $candidateTwo = PoolCandidate::factory()->submitted()->for($this->pool)->create([
            'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
            'user_id' => User::factory([
                'has_priority_entitlement' => false,
                'armed_forces_status' => ArmedForcesStatus::NON_CAF->name,
                'citizenship' => CitizenshipStatus::OTHER->name,
                'has_diploma' => false,
                'is_woman' => false,
            ]),
        ]);
        // APPLICATION REVIEW, NO PRIORITY SO THIRD
        $candidateThree = PoolCandidate::factory()
            ->screening(ScreeningStage::APPLICATION_REVIEW)
            ->for($this->pool)
            ->create([
                'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
                'user_id' => User::factory([
                    'has_priority_entitlement' => false,
                    'armed_forces_status' => ArmedForcesStatus::NON_CAF->name,
                    'citizenship' => CitizenshipStatus::OTHER->name,
                    'has_diploma' => false,
                    'is_woman' => false,
                ]),
            ]);

        // NEW APPLICATION, VETERAN SO FIRST
        // has diploma and is woman
        $candidateFour = PoolCandidate::factory()->submitted()->for($this->pool)->create([
            'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14',
            'user_id' => User::factory([
                'has_priority_entitlement' => false,
                'armed_forces_status' => ArmedForcesStatus::VETERAN->name,
                'citizenship' => CitizenshipStatus::CITIZEN->name,
                'has_diploma' => true,
                'is_woman' => true,
            ]),
        ]);
        // QUALIFIED AVAILABLE, HAS ENTITLEMENT FOURTH
        // has diploma and is woman
        $candidateFive = PoolCandidate::factory()->qualified()->for($this->pool)->create([
            'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15',
            'user_id' => User::factory([
                'has_priority_entitlement' => true,
                'armed_forces_status' => ArmedForcesStatus::VETERAN->name,
                'citizenship' => CitizenshipStatus::CITIZEN->name,
                'has_diploma' => true,
                'is_woman' => true,
            ]),
        ]);

        $query =
            /** @lang GraphQL */
            '
            query poolCandidatesPaginatedAdminView($where: PoolCandidateSearchInput) {
                poolCandidatesPaginatedAdminView (
                    orderBy: [
                  { column: "status_weight", order: ASC }
                  { user: { aggregate: MAX, column: PRIORITY_WEIGHT }, order: ASC }
                  { column: "id", order: ASC }
                ], where: $where) {
                    data {
                        id
                    }
                }
            }
        ';

        // Assert the order is correct
        // candidate one not present due to being DRAFT
        $this->actingAs($this->processOperator, 'api')
            ->graphQL($query, [
                'where' => [],
            ])
            ->assertJson([
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

        // Assert that
        // PoolCandidates are filtered out by data on User, must have Diploma and be Woman
        // Candidate Four always precedes Candidate Five due to ORDERING
        $this->actingAs($this->processOperator, 'api')
            ->graphQL(
                $query,
                [
                    'where' => [
                        'applicantFilter' => [
                            'hasDiploma' => true,
                            'equity' => [
                                'isWoman' => true,
                                'hasDisability' => false,
                                'isIndigenous' => false,
                                'isVisibleMinority' => false,
                            ],
                        ],

                    ],
                ]
            )->assertJson([
                'data' => [
                    'poolCandidatesPaginatedAdminView' => [
                        'data' => [
                            ['id' => $candidateFour->id],
                            ['id' => $candidateFive->id],
                        ],
                    ],
                ],
            ]);
    }

    public function testPoolCandidatesSearchExpiryFilter(): void
    {
        PoolCandidate::factory()->count(2)->placed(PlacementType::PLACED_CASUAL)->for($this->pool)->create();
        PoolCandidate::factory()->placed(PlacementType::PLACED_CASUAL)->for($this->pool)->create([
            'expiry_date' => config('constants.past_date'),
        ]);
        PoolCandidate::factory()->placed(PlacementType::PLACED_CASUAL)->for($this->pool)->create([
            'expiry_date' => null,
        ]);

        $query =
            /** @lang GraphQL */
            '
            query poolCandidatesPaginatedAdminView ($where: PoolCandidateSearchInput) {
                poolCandidatesPaginatedAdminView (
                  where: $where
                  orderBy: [
                  { column: "status_weight", order: ASC }
                  { user: { aggregate: MAX, column: PRIORITY_WEIGHT }, order: ASC }
                ]) {
                    paginatorInfo {
                        count
                    }
                }
            }
        ';

        // Assert that ACTIVE returns 3
        $this->actingAs($this->processOperator, 'api')->graphQL(
            $query,
            [
                'where' => [
                    'expiryStatus' => CandidateExpiryFilter::ACTIVE->name,
                ],
            ]
        )->assertJson([
            'data' => [
                'poolCandidatesPaginatedAdminView' => [
                    'paginatorInfo' => [
                        'count' => 3,
                    ],
                ],
            ],
        ]);

        // Assert that EXPIRED returns 1
        $this->actingAs($this->processOperator, 'api')->graphQL(
            $query,
            [
                'where' => [
                    'expiryStatus' => CandidateExpiryFilter::EXPIRED->name,
                ],
            ]
        )->assertJson([
            'data' => [
                'poolCandidatesPaginatedAdminView' => [
                    'paginatorInfo' => [
                        'count' => 1,
                    ],
                ],
            ],
        ]);

        // Assert that ALL returns 4 (all candidates)
        $this->actingAs($this->processOperator, 'api')->graphQL(
            $query,
            [
                'where' => [
                    'expiryStatus' => CandidateExpiryFilter::ALL->name,
                ],
            ]
        )->assertJson([
            'data' => [
                'poolCandidatesPaginatedAdminView' => [
                    'paginatorInfo' => [
                        'count' => 4,
                    ],
                ],
            ],
        ]);
    }

    public function testPoolCandidatesSearchSuspendedFilter(): void
    {
        PoolCandidate::factory()->count(5)->placed(PlacementType::PLACED_CASUAL)->for($this->pool)->create();
        PoolCandidate::factory()->placed(PlacementType::PLACED_CASUAL)->for($this->pool)->create([
            'suspended_at' => config('constants.far_past_datetime'),
        ]);
        PoolCandidate::factory()->placed(PlacementType::PLACED_CASUAL)->for($this->pool)->create([
            'suspended_at' => Carbon::now()->subMinutes(1),
        ]);
        PoolCandidate::factory()->placed(PlacementType::PLACED_CASUAL)->for($this->pool)->create([
            'suspended_at' => Carbon::now()->addMinutes(1),
        ]);

        $query =
            /** @lang GraphQL */
            '
            query poolCandidatesPaginatedAdminView ($where: PoolCandidateSearchInput) {
                poolCandidatesPaginatedAdminView (
                  where: $where
                  orderBy: [
                  { column: "status_weight", order: ASC }
                  { user: { aggregate: MAX, column: PRIORITY_WEIGHT }, order: ASC }
                ]) {
                    paginatorInfo {
                        count
                    }
                }
            }
        ';

        // assert active 6 returned
        $this->actingAs($this->processOperator, 'api')->graphQL(
            $query,
            [
                'where' => [
                    'suspendedStatus' => null, // default active for the scope
                ],
            ]
        )->assertJson([
            'data' => [
                'poolCandidatesPaginatedAdminView' => [
                    'paginatorInfo' => [
                        'count' => 6,
                    ],
                ],
            ],
        ]);

        // assert active 6 returned
        $this->actingAs($this->processOperator, 'api')->graphQL(
            $query,
            [
                'where' => [
                    'suspendedStatus' => CandidateSuspendedFilter::ACTIVE->name,
                ],
            ]
        )->assertJson([
            'data' => [
                'poolCandidatesPaginatedAdminView' => [
                    'paginatorInfo' => [
                        'count' => 6,
                    ],
                ],
            ],
        ]);

        // assert suspended 2 returned
        $this->actingAs($this->processOperator, 'api')->graphQL(
            $query,
            [
                'where' => [
                    'suspendedStatus' => CandidateSuspendedFilter::SUSPENDED->name,
                ],
            ]
        )->assertJson([
            'data' => [
                'poolCandidatesPaginatedAdminView' => [
                    'paginatorInfo' => [
                        'count' => 2,
                    ],
                ],
            ],
        ]);

        // assert all 8 returned
        $this->actingAs($this->processOperator, 'api')->graphQL(
            $query,
            [
                'where' => [
                    'suspendedStatus' => CandidateSuspendedFilter::ALL->name,
                ],
            ]
        )->assertJson([
            'data' => [
                'poolCandidatesPaginatedAdminView' => [
                    'paginatorInfo' => [
                        'count' => 8,
                    ],
                ],
            ],
        ]);
    }

    public function testPoolCandidatesSearchGovEmployee(): void
    {
        // Create 5 Gov Employees
        foreach (range(1, 5) as $i) {
            PoolCandidate::factory()
                ->placed(PlacementType::PLACED_CASUAL)
                ->for(User::factory()->withGovEmployeeProfile())
                ->for($this->pool)
                ->create();
        }

        // Create 3 Non-Gov Employees
        foreach (range(1, 3) as $i) {
            PoolCandidate::factory()
                ->placed(PlacementType::PLACED_CASUAL)
                ->for(User::factory()->withNonGovProfile())
                ->for($this->pool)
                ->create();
        }

        $query =
            /** @lang GraphQL */
            '
            query poolCandidatesPaginatedAdminView ($where: PoolCandidateSearchInput) {
                poolCandidatesPaginatedAdminView (
                  where: $where
                  orderBy: [
                  { column: "status_weight", order: ASC }
                  { user: { aggregate: MAX, column: PRIORITY_WEIGHT }, order: ASC }
                ]) {
                    paginatorInfo {
                        count
                    }
                }
            }
        ';

        // assert all 8 returned
        $this->actingAs($this->processOperator, 'api')->graphQL(
            $query,
            [
                'where' => [
                    'isGovEmployee' => null,
                ],
            ]
        )->assertJson([
            'data' => [
                'poolCandidatesPaginatedAdminView' => [
                    'paginatorInfo' => [
                        'count' => 8,
                    ],
                ],
            ],
        ]);

        // assert the 5 govEmployee = true models returned
        $this->actingAs($this->processOperator, 'api')->graphQL(
            $query,
            [
                'where' => [
                    'isGovEmployee' => true,
                ],
            ]
        )->assertJson([
            'data' => [
                'poolCandidatesPaginatedAdminView' => [
                    'paginatorInfo' => [
                        'count' => 5,
                    ],
                ],
            ],
        ]);
    }

    public function testPoolCandidatesSearchClassification(): void
    {
        // Create qualified right classification candidates
        $classificationIT1 = Classification::factory()->create([
            'group' => 'IT',
            'level' => 1,
        ]);
        $poolIT1 = Pool::factory()->create([
            'community_id' => $this->community->id,
            'classification_id' => $classificationIT1->id,
        ]);
        PoolCandidate::factory()->count(5)->placed(PlacementType::PLACED_CASUAL)->for($poolIT1)->create();

        // Wrong classification candidates
        $classificationIT2 = Classification::factory()->create([
            'group' => 'IT',
            'level' => 2,
        ]);
        $poolIT2 = Pool::factory()->create([
            'community_id' => $this->community->id,
            'classification_id' => $classificationIT2->id,
        ]);
        PoolCandidate::factory()->count(3)->placed(PlacementType::PLACED_CASUAL)->for($poolIT2)->create();
        PoolCandidate::factory()->screening(ScreeningStage::UNDER_ASSESSMENT)->for($poolIT1)->create();

        $query =
            /** @lang GraphQL */
            '
            query poolCandidatesPaginatedAdminView ($where: PoolCandidateSearchInput) {
                poolCandidatesPaginatedAdminView (
                  where: $where
                  ) {
                    paginatorInfo {
                        count
                    }
                }
            }
        ';

        // assert all 9 returned
        $this->actingAs($this->communityRecruiter, 'api')->graphQL(
            $query,
            [
                'where' => [
                    'appliedClassifications' => null,
                ],
            ]
        )->assertJson([
            'data' => [
                'poolCandidatesPaginatedAdminView' => [
                    'paginatorInfo' => [
                        'count' => 9,
                    ],
                ],
            ],
        ]);

        // assert the 6 right classifications returned - regardless of qualified status
        $this->actingAs($this->communityRecruiter, 'api')->graphQL(
            $query,
            [
                'where' => [
                    'appliedClassifications' => [
                        [
                            'group' => 'IT',
                            'level' => 1,
                        ],
                    ],
                ],
            ]
        )->assertJson([
            'data' => [
                'poolCandidatesPaginatedAdminView' => [
                    'paginatorInfo' => [
                        'count' => 6,
                    ],
                ],
            ],
        ]);

        // assert the 5 qualified right classification candidates returned
        $this->actingAs($this->communityRecruiter, 'api')->graphQL(
            $query,
            [
                'where' => [
                    'applicantFilter' => [
                        'qualifiedInClassifications' => [
                            [
                                'group' => 'IT',
                                'level' => 1,
                            ],
                        ],
                    ],
                ],
            ]
        )->assertJson([
            'data' => [
                'poolCandidatesPaginatedAdminView' => [
                    'paginatorInfo' => [
                        'count' => 5,
                    ],
                ],
            ],
        ]);
    }

    // test pool candidates  general search by notes
    public function testPoolCandidatesSearchByNotes()
    {
        PoolCandidate::factory()->placed(PlacementType::PLACED_CASUAL)->for($this->pool)->create([
            'notes' => 'test notes',
        ]);

        $query =
            /** @lang GraphQL */
            '
        query poolCandidatesPaginatedAdminView($where: PoolCandidateSearchInput) {
            poolCandidatesPaginatedAdminView(
                where: $where
            ) {
                paginatorInfo {
                    count
                }
            }
        }
    ';

        $this->actingAs($this->processOperator, 'api')->graphQL(
            $query,
            [
                'where' => [
                    'generalSearch' => 'test notes',
                ],
            ]
        )->assertJson([
            'data' => [
                'poolCandidatesPaginatedAdminView' => [
                    'paginatorInfo' => [
                        'count' => 1,
                    ],
                ],
            ],
        ]);
    }

    public function testScopeDepartmentsIn(): void
    {
        $query = <<<'GRAPHQL'
        query PoolCandidates($where: PoolCandidateSearchInput) {
            poolCandidatesPaginatedAdminView(where: $where) {
                data {
                    id
                }
                paginatorInfo {
                    total
                }
            }
        }
        GRAPHQL;

        // Create 10 unexpected candidates
        PoolCandidate::factory(10)
            ->availableInSearch()
            ->for($this->pool)
            ->create();

        $expectedCandidate = PoolCandidate::factory()
            ->availableInSearch()
            ->for($this->pool)
            ->for(User::factory()->withGovEmployeeProfile())
            ->create();

        $this->actingAs($this->communityRecruiter, 'api')
            ->graphQL($query, [
                'where' => [
                    'departments' => [$expectedCandidate->user->department->id],
                ],
            ])->assertJsonFragment([
                'data' => [
                    'poolCandidatesPaginatedAdminView' => [
                        'data' => [
                            ['id' => $expectedCandidate->id],
                        ],
                        'paginatorInfo' => [
                            'total' => 1,
                        ],
                    ],
                ]]);

    }

    public function testScopeAssessmentStepIn(): void
    {
        $query = <<<'GRAPHQL'
        query PoolCandidates($where: PoolCandidateSearchInput) {
            poolCandidatesPaginatedAdminView(where: $where) {
                data {
                    id
                }
                paginatorInfo {
                    total
                }
            }
        }
        GRAPHQL;

        // Create 10 unexpected candidates
        PoolCandidate::factory(10)
            ->availableInSearch()
            ->withAssessmentResults()
            ->for($this->pool)
            ->create();

        $expectedCandidate = PoolCandidate::factory()
            ->availableInSearch()
            ->for($this->pool)
            ->create();

        $expectedAssessmentStep = AssessmentStep::factory()->create([
            'pool_id' => $this->pool->id,
        ]);

        $expectedCandidate->assessment_step_id = $expectedAssessmentStep->id;
        $expectedCandidate->save();

        $this->actingAs($this->communityRecruiter, 'api')
            ->graphQL($query, [
                'where' => [
                    'assessmentSteps' => [$expectedAssessmentStep->sort_order],
                ],
            ])->assertJsonFragment([
                'data' => [
                    'poolCandidatesPaginatedAdminView' => [
                        'data' => [
                            ['id' => $expectedCandidate->id],
                        ],
                        'paginatorInfo' => [
                            'total' => 1,
                        ],
                    ],
                ]]);

    }

    public function testScopeWhereStatusIn(): void
    {
        $query = <<<'GRAPHQL'
        query PoolCandidates($where: PoolCandidateSearchInput) {
            poolCandidatesPaginatedAdminView(where: $where) {
                data {
                    id
                }
                paginatorInfo {
                    total
                }
            }
        }
        GRAPHQL;

        $expectedStatus = ApplicationStatus::TO_ASSESS->name;

        // Create 10 unexpected candidates
        PoolCandidate::factory(10)
            ->availableInSearch()
            ->for($this->pool)
            ->create([
                'application_status' => Arr::random(Arr::where(array_column(ApplicationStatus::cases(), 'name'), function ($status) use ($expectedStatus) {
                    return $status !== $expectedStatus;
                })),
            ]);

        $expectedCandidate = PoolCandidate::factory()
            ->availableInSearch()
            ->for($this->pool)
            ->create([
                'application_status' => $expectedStatus,
            ]);

        $this->actingAs($this->communityRecruiter, 'api')
            ->graphQL($query, [
                'where' => [
                    'statuses' => [$expectedStatus],
                ],
            ])->assertJsonFragment([
                'data' => [
                    'poolCandidatesPaginatedAdminView' => [
                        'data' => [
                            ['id' => $expectedCandidate->id],
                        ],
                        'paginatorInfo' => [
                            'total' => 1,
                        ],
                    ],
                ]]);

    }

    public function testScopePlacementTypesIn(): void
    {
        $query = <<<'GRAPHQL'
        query PoolCandidates($where: PoolCandidateSearchInput) {
            poolCandidatesPaginatedAdminView(where: $where) {
                data {
                    id
                }
                paginatorInfo {
                    total
                }
            }
        }
        GRAPHQL;

        $types = collect(PlacementType::cases())
            ->reject(fn ($type) => $type->name === PlacementType::UNDER_CONSIDERATION->name);

        foreach (range(1, 10) as $i) {
            PoolCandidate::factory()
                ->placed($types->random())
                ->create();
        }

        $expectedCandidate = PoolCandidate::factory()
            ->for($this->pool)
            ->placed(PlacementType::UNDER_CONSIDERATION)
            ->create();

        $this->actingAs($this->communityRecruiter, 'api')
            ->graphQL($query, [
                'where' => [
                    'placementTypes' => [$expectedCandidate->placement_type],
                ],
            ])->assertJsonFragment([
                'data' => [
                    'poolCandidatesPaginatedAdminView' => [
                        'data' => [
                            ['id' => $expectedCandidate->id],
                        ],
                        'paginatorInfo' => [
                            'total' => 1,
                        ],
                    ],
                ]]);
    }

    public function testScopeRemovalReasonIn(): void
    {
        $query = <<<'GRAPHQL'
        query PoolCandidates($where: PoolCandidateSearchInput) {
            poolCandidatesPaginatedAdminView(where: $where) {
                data {
                    id
                }
                paginatorInfo {
                    total
                }
            }
        }
        GRAPHQL;

        $reasons = collect(CandidateRemovalReason::cases())
            ->reject(fn ($reason) => $reason->name === CandidateRemovalReason::INELIGIBLE->name);

        foreach (range(1, 10) as $i) {
            PoolCandidate::factory()
                ->removed($reasons->random())
                ->create();
        }

        $expectedCandidate = PoolCandidate::factory()
            ->removed(CandidateRemovalReason::INELIGIBLE)
            ->create([
                'pool_id' => $this->pool->id,
                'removal_reason' => CandidateRemovalReason::INELIGIBLE->name,
            ]);

        $this->actingAs($this->communityRecruiter, 'api')
            ->graphQL($query, [
                'where' => [
                    'removalReasons' => [CandidateRemovalReason::INELIGIBLE->name],
                ],
            ])->assertJsonFragment([
                'data' => [
                    'poolCandidatesPaginatedAdminView' => [
                        'data' => [
                            ['id' => $expectedCandidate->id],
                        ],
                        'paginatorInfo' => [
                            'total' => 1,
                        ],
                    ],
                ]]);
    }

    public function testScopeScreeningStageIn(): void
    {
        $query = <<<'GRAPHQL'
        query PoolCandidates($where: PoolCandidateSearchInput) {
            poolCandidatesPaginatedAdminView(where: $where) {
                data {
                    id
                }
                paginatorInfo {
                    total
                }
            }
        }
        GRAPHQL;

        // Create 10 unexpected candidates
        $unexpected = PoolCandidate::factory(10)
            ->availableInSearch()
            ->for($this->pool)
            ->create();

        foreach ($unexpected as $candidate) {
            $candidate->screening_stage = Arr::random(Arr::where(
                array_column(ScreeningStage::cases(), 'name'),
                fn ($status) => $status !== ScreeningStage::UNDER_ASSESSMENT->name,
            ));
            $candidate->save();
        }

        $expectedCandidate = PoolCandidate::factory()
            ->availableInSearch()
            ->for($this->pool)
            ->create();

        $expectedCandidate->screening_stage = ScreeningStage::UNDER_ASSESSMENT->name;
        $expectedCandidate->save();

        $this->actingAs($this->communityRecruiter, 'api')
            ->graphQL($query, [
                'where' => [
                    'screeningStages' => [ScreeningStage::UNDER_ASSESSMENT->name],
                ],
            ])->assertJsonFragment([
                'data' => [
                    'poolCandidatesPaginatedAdminView' => [
                        'data' => [
                            ['id' => $expectedCandidate->id],
                        ],
                        'paginatorInfo' => [
                            'total' => 1,
                        ],
                    ],
                ]]);

    }
}
