<?php

namespace Tests\Feature;

use App\Enums\ApplicationStatus;
use App\Enums\ArmedForcesStatus;
use App\Enums\CandidateRemovalReason;
use App\Enums\CitizenshipStatus;
use App\Enums\DisqualificationReason;
use App\Enums\IndigenousCommunity;
use App\Enums\PlacementType;
use App\Enums\ScreeningStage;
use App\Facades\Notify;
use App\Models\Pool;
use App\Models\PoolCandidate;
use App\Models\User;
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

    private function qualifiedPoolCandidateData(array $overrides = []): array
    {
        return array_merge([
            'expiry_date' => config('constants.far_future_date'),
            'application_status' => ApplicationStatus::QUALIFIED->name,
            'placement_type' => PlacementType::NOT_PLACED->name,
            'submitted_at' => config('constants.past_date'),
        ], $overrides);
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
                    applicationStatusData {
                        statusWeight
                        status { value }
                    }
                }
            }
        ';

        $variables = ['id' => $candidate->id];

        // Assert candidate one DRAFT is 10
        $this->actingAs($this->adminUser, 'api')
            ->graphQL($query, $variables)->assertJson([
                'data' => [
                    'poolCandidate' => [
                        'applicationStatusData' => [
                            'statusWeight' => 10,
                            'status' => [
                                'value' => ApplicationStatus::DRAFT->name,
                            ],
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
                        'applicationStatusData' => [
                            'statusWeight' => 20,
                            'status' => [
                                'value' => ApplicationStatus::TO_ASSESS->name,
                            ],
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
                        'applicationStatusData' => [
                            'statusWeight' => 30,
                            'status' => [
                                'value' => ApplicationStatus::DISQUALIFIED->name,
                            ],
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
                        'applicationStatusData' => [
                            'statusWeight' => 40,
                            'status' => [
                                'value' => ApplicationStatus::QUALIFIED->name,
                            ],
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
                        'applicationStatusData' => [
                            'statusWeight' => 50,
                            'status' => [
                                'value' => ApplicationStatus::REMOVED->name,
                            ],
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
}
