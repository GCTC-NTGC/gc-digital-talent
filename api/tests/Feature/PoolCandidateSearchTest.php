<?php

namespace Tests\Feature;

use App\Enums\ArmedForcesStatus;
use App\Enums\CandidateExpiryFilter;
use App\Enums\CandidateSuspendedFilter;
use App\Enums\CitizenshipStatus;
use App\Enums\PoolCandidateStatus;
use App\Facades\Notify;
use App\Models\Classification;
use App\Models\Pool;
use App\Models\PoolCandidate;
use App\Models\Team;
use App\Models\User;
use Carbon\Carbon;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
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

    protected $teamUser;

    protected $team;

    protected $teamName = 'application-test-team';

    protected $pool;

    protected function setUp(): void
    {
        parent::setUp();
        Notify::spy(); // don't send any notifications
        $this->seed(RolePermissionSeeder::class);

        $this->bootRefreshesSchemaCache();

        $this->team = Team::factory()->create([
            'name' => $this->teamName,
        ]);

        $this->pool = Pool::factory()->create([
            'team_id' => $this->team->id,
        ]);

        $this->teamUser = User::factory()
            ->asApplicant()
            ->asProcessOperator($this->team->name)
            ->create([
                'email' => 'team-user@test.com',
                'sub' => 'team-user@test.com',
            ]);
    }

    public function testPoolCandidatesSearchFilter(): void
    {
        // DRAFT, NOT PRESENT
        $candidateOne = PoolCandidate::factory()->create([
            'pool_id' => $this->pool->id,
            'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
            'expiry_date' => config('constants.far_future_date'),
            'pool_candidate_status' => PoolCandidateStatus::DRAFT->name,
            'user_id' => User::factory([
                'has_priority_entitlement' => true,
                'armed_forces_status' => ArmedForcesStatus::VETERAN->name,
                'citizenship' => CitizenshipStatus::CITIZEN->name,
                'has_diploma' => false,
                'is_woman' => false,
            ]),
        ]);
        // NEW APPLICATION, NO PRIORITY SO SECOND
        $candidateTwo = PoolCandidate::factory()->create([
            'pool_id' => $this->pool->id,
            'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
            'expiry_date' => config('constants.far_future_date'),
            'submitted_at' => config('constants.past_date'),
            'pool_candidate_status' => PoolCandidateStatus::NEW_APPLICATION->name,
            'user_id' => User::factory([
                'has_priority_entitlement' => false,
                'armed_forces_status' => ArmedForcesStatus::NON_CAF->name,
                'citizenship' => CitizenshipStatus::OTHER->name,
                'has_diploma' => false,
                'is_woman' => false,
            ]),
        ]);
        // APPLICATION REVIEW, NO PRIORITY SO THIRD
        $candidateThree = PoolCandidate::factory()->create([
            'pool_id' => $this->pool->id,
            'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
            'expiry_date' => config('constants.far_future_date'),
            'submitted_at' => config('constants.past_date'),
            'pool_candidate_status' => PoolCandidateStatus::APPLICATION_REVIEW->name,
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
        $candidateFour = PoolCandidate::factory()->create([
            'pool_id' => $this->pool->id,
            'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14',
            'expiry_date' => config('constants.far_future_date'),
            'submitted_at' => config('constants.past_date'),
            'pool_candidate_status' => PoolCandidateStatus::NEW_APPLICATION->name,
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
        $candidateFive = PoolCandidate::factory()->create([
            'pool_id' => $this->pool->id,
            'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15',
            'expiry_date' => config('constants.far_future_date'),
            'submitted_at' => config('constants.past_date'),
            'pool_candidate_status' => PoolCandidateStatus::QUALIFIED_AVAILABLE->name,
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
            query poolCandidatesPaginated($where: PoolCandidateSearchInput) {
                poolCandidatesPaginated (orderBy: [
                  { column: "status_weight", order: ASC }
                  { user: { aggregate: MAX, column: PRIORITY_WEIGHT }, order: ASC }
                ], where: $where) {
                    data {
                        id
                    }
                }
            }
        ';

        // Assert the order is correct
        // candidate one not present due to being DRAFT
        $this->actingAs($this->teamUser, 'api')
            ->graphQL($query, ['where' => []])
            ->assertJson([
                'data' => [
                    'poolCandidatesPaginated' => [
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
        $this->actingAs($this->teamUser, 'api')
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
                    'poolCandidatesPaginated' => [
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

        $candidateActive = PoolCandidate::factory()->create([
            'pool_id' => $this->pool->id,
            'expiry_date' => config('constants.far_future_date'),
            'pool_candidate_status' => PoolCandidateStatus::PLACED_CASUAL->name,
            'user_id' => User::factory(),
        ]);
        $candidateActive2 = PoolCandidate::factory()->create([
            'pool_id' => $this->pool->id,
            'expiry_date' => config('constants.far_future_date'),
            'pool_candidate_status' => PoolCandidateStatus::PLACED_CASUAL->name,
            'user_id' => User::factory(),
        ]);
        $candidateExpired = PoolCandidate::factory()->create([
            'pool_id' => $this->pool->id,
            'expiry_date' => config('constants.past_date'),
            'pool_candidate_status' => PoolCandidateStatus::PLACED_CASUAL->name,
            'user_id' => User::factory(),
        ]);
        $candidateNullExpiry = PoolCandidate::factory()->create([
            'pool_id' => $this->pool->id,
            'expiry_date' => null,
            'pool_candidate_status' => PoolCandidateStatus::PLACED_CASUAL->name,
            'user_id' => User::factory(),
        ]);

        $query =
            /** @lang GraphQL */
            '
            query poolCandidatesPaginated ($where: PoolCandidateSearchInput) {
                poolCandidatesPaginated (
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
        $this->actingAs($this->teamUser, 'api')->graphQL(
            $query,
            [
                'where' => [
                    'expiryStatus' => CandidateExpiryFilter::ACTIVE->name,
                ],
            ]
        )->assertJson([
            'data' => [
                'poolCandidatesPaginated' => [
                    'paginatorInfo' => [
                        'count' => 3,
                    ],
                ],
            ],
        ]);

        // Assert that EXPIRED returns 1
        $this->actingAs($this->teamUser, 'api')->graphQL(
            $query,
            [
                'where' => [
                    'expiryStatus' => CandidateExpiryFilter::EXPIRED->name,
                ],
            ]
        )->assertJson([
            'data' => [
                'poolCandidatesPaginated' => [
                    'paginatorInfo' => [
                        'count' => 1,
                    ],
                ],
            ],
        ]);

        // Assert that ALL returns 4 (all candidates)
        $this->actingAs($this->teamUser, 'api')->graphQL(
            $query,
            [
                'where' => [
                    'expiryStatus' => CandidateExpiryFilter::ALL->name,
                ],
            ]
        )->assertJson([
            'data' => [
                'poolCandidatesPaginated' => [
                    'paginatorInfo' => [
                        'count' => 4,
                    ],
                ],
            ],
        ]);
    }

    public function testPoolCandidatesSearchSuspendedFilter(): void
    {
        PoolCandidate::factory()->count(5)->create([
            'pool_id' => $this->pool->id,
            'expiry_date' => config('constants.far_future_date'),
            'pool_candidate_status' => PoolCandidateStatus::PLACED_CASUAL->name,
            'suspended_at' => null,
        ]);
        PoolCandidate::factory()->create([
            'pool_id' => $this->pool->id,
            'expiry_date' => config('constants.far_future_date'),
            'pool_candidate_status' => PoolCandidateStatus::PLACED_CASUAL->name,
            'suspended_at' => config('constants.far_past_datetime'),
        ]);
        PoolCandidate::factory()->create([
            'pool_id' => $this->pool->id,
            'expiry_date' => config('constants.far_future_date'),
            'pool_candidate_status' => PoolCandidateStatus::PLACED_CASUAL->name,
            'suspended_at' => Carbon::now()->subMinutes(1),
        ]);
        PoolCandidate::factory()->create([
            'pool_id' => $this->pool->id,
            'expiry_date' => config('constants.far_future_date'),
            'pool_candidate_status' => PoolCandidateStatus::PLACED_CASUAL->name,
            'suspended_at' => Carbon::now()->addMinutes(1),
        ]);

        $query =
            /** @lang GraphQL */
            '
            query poolCandidatesPaginated ($where: PoolCandidateSearchInput) {
                poolCandidatesPaginated (
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
        $this->actingAs($this->teamUser, 'api')->graphQL(
            $query,
            [
                'where' => [
                    'suspendedStatus' => null, // default active for the scope
                ],
            ]
        )->assertJson([
            'data' => [
                'poolCandidatesPaginated' => [
                    'paginatorInfo' => [
                        'count' => 6,
                    ],
                ],
            ],
        ]);

        // assert active 6 returned
        $this->actingAs($this->teamUser, 'api')->graphQL(
            $query,
            [
                'where' => [
                    'suspendedStatus' => CandidateSuspendedFilter::ACTIVE->name,
                ],
            ]
        )->assertJson([
            'data' => [
                'poolCandidatesPaginated' => [
                    'paginatorInfo' => [
                        'count' => 6,
                    ],
                ],
            ],
        ]);

        // assert suspended 2 returned
        $this->actingAs($this->teamUser, 'api')->graphQL(
            $query,
            [
                'where' => [
                    'suspendedStatus' => CandidateSuspendedFilter::SUSPENDED->name,
                ],
            ]
        )->assertJson([
            'data' => [
                'poolCandidatesPaginated' => [
                    'paginatorInfo' => [
                        'count' => 2,
                    ],
                ],
            ],
        ]);

        // assert all 8 returned
        $this->actingAs($this->teamUser, 'api')->graphQL(
            $query,
            [
                'where' => [
                    'suspendedStatus' => CandidateSuspendedFilter::ALL->name,
                ],
            ]
        )->assertJson([
            'data' => [
                'poolCandidatesPaginated' => [
                    'paginatorInfo' => [
                        'count' => 8,
                    ],
                ],
            ],
        ]);
    }

    public function testPoolCandidatesSearchGovEmployee(): void
    {
        PoolCandidate::factory()->count(5)->create([
            'pool_id' => $this->pool->id,
            'expiry_date' => config('constants.far_future_date'),
            'pool_candidate_status' => PoolCandidateStatus::PLACED_CASUAL->name,
            'suspended_at' => null,
            'user_id' => User::factory([
                'is_gov_employee' => true,
            ]),
        ]);
        PoolCandidate::factory()->count(3)->create([
            'pool_id' => $this->pool->id,
            'expiry_date' => config('constants.far_future_date'),
            'pool_candidate_status' => PoolCandidateStatus::PLACED_CASUAL->name,
            'suspended_at' => null,
            'user_id' => User::factory([
                'is_gov_employee' => false,
            ]),
        ]);

        $query =
            /** @lang GraphQL */
            '
            query poolCandidatesPaginated ($where: PoolCandidateSearchInput) {
                poolCandidatesPaginated (
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
        $this->actingAs($this->teamUser, 'api')->graphQL(
            $query,
            [
                'where' => [
                    'isGovEmployee' => null,
                ],
            ]
        )->assertJson([
            'data' => [
                'poolCandidatesPaginated' => [
                    'paginatorInfo' => [
                        'count' => 8,
                    ],
                ],
            ],
        ]);

        // assert the 5 govEmployee = true models returned
        $this->actingAs($this->teamUser, 'api')->graphQL(
            $query,
            [
                'where' => [
                    'isGovEmployee' => true,
                ],
            ]
        )->assertJson([
            'data' => [
                'poolCandidatesPaginated' => [
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
            'team_id' => $this->team->id,
            'classification_id' => $classificationIT1->id,
        ]);
        PoolCandidate::factory()->count(5)->create([
            'pool_id' => $poolIT1->id,
            'expiry_date' => config('constants.far_future_date'),
            'pool_candidate_status' => PoolCandidateStatus::PLACED_CASUAL->name,
            'suspended_at' => null,
        ]);

        // Wrong classification candidates
        $classificationIT2 = Classification::factory()->create([
            'group' => 'IT',
            'level' => 2,
        ]);
        $poolIT2 = Pool::factory()->create([
            'team_id' => $this->team->id,
            'classification_id' => $classificationIT2->id,
        ]);
        PoolCandidate::factory()->count(3)->create([
            'pool_id' => $poolIT2->id,
            'expiry_date' => config('constants.far_future_date'),
            'pool_candidate_status' => PoolCandidateStatus::PLACED_CASUAL->name,
            'suspended_at' => null,
        ]);

        PoolCandidate::factory()->create([
            'pool_id' => $poolIT1->id,
            'expiry_date' => config('constants.far_future_date'),
            'pool_candidate_status' => PoolCandidateStatus::UNDER_ASSESSMENT->name,
            'suspended_at' => null,
        ]);

        $query =
            /** @lang GraphQL */
            '
            query poolCandidatesPaginated ($where: PoolCandidateSearchInput) {
                poolCandidatesPaginated (
                  where: $where) {
                    paginatorInfo {
                        count
                    }
                }
            }
        ';

        // assert all 9 returned
        $this->actingAs($this->teamUser, 'api')->graphQL(
            $query,
            [
                'where' => [
                    'appliedClassifications' => null,
                ],
            ]
        )->assertJson([
            'data' => [
                'poolCandidatesPaginated' => [
                    'paginatorInfo' => [
                        'count' => 9,
                    ],
                ],
            ],
        ]);

        // assert the 6 right classifications returned - regardless of qualified status
        $this->actingAs($this->teamUser, 'api')->graphQL(
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
                'poolCandidatesPaginated' => [
                    'paginatorInfo' => [
                        'count' => 6,
                    ],
                ],
            ],
        ]);

        // assert the 5 qualified right classification candidates returned
        $this->actingAs($this->teamUser, 'api')->graphQL(
            $query,
            [
                'where' => [
                    'applicantFilter' => [
                        'qualifiedClassifications' => [
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
                'poolCandidatesPaginated' => [
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
        $candidateId = PoolCandidate::factory()->create([
            'pool_id' => $this->pool->id,
            'expiry_date' => config('constants.far_future_date'),
            'pool_candidate_status' => PoolCandidateStatus::PLACED_CASUAL->name,
            'suspended_at' => null,
            'notes' => 'test notes',
        ]);

        $query =
            /** @lang GraphQL */
            '
        query poolCandidatesPaginated($where: PoolCandidateSearchInput) {
            poolCandidatesPaginated(
                where: $where
            ) {
                paginatorInfo {
                    count
                }
            }
        }
    ';

        $this->actingAs($this->teamUser, 'api')->graphQL(
            $query,
            [
                'where' => [
                    'generalSearch' => 'test notes',
                ],
            ]
        )->assertJson([
            'data' => [
                'poolCandidatesPaginated' => [
                    'paginatorInfo' => [
                        'count' => 1,
                    ],
                ],
            ],
        ]);
    }
}
