<?php

use App\Models\User;
use App\Models\Pool;
use App\Models\PoolCandidate;
use App\Models\Team;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Tests\TestCase;
use Database\Helpers\ApiEnums;

class PoolCandidateSearchTest extends TestCase
{
    use RefreshDatabase;
    use MakesGraphQLRequests;
    use RefreshesSchemaCache;

    protected $teamUser;
    protected $team;
    protected $teamName = "application-test-team";
    protected $pool;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);

        $this->bootRefreshesSchemaCache();

        $this->team = Team::factory()->create([
            'name' => $this->teamName,
        ]);

        $this->pool = Pool::factory()->create([
            'team_id' => $this->team->id
        ]);

        $this->teamUser = User::factory()
            ->asApplicant()
            ->asPoolOperator($this->team->name)
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
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_DRAFT,
            'user_id' => User::factory([
                'has_priority_entitlement' => true,
                'armed_forces_status' => ApiEnums::ARMED_FORCES_VETERAN,
                'citizenship' => ApiEnums::CITIZENSHIP_CITIZEN,
                'has_diploma' => false,
                'is_woman' => false,
            ])
        ]);
        // NEW APPLICATION, NO PRIORITY SO SECOND
        $candidateTwo = PoolCandidate::factory()->create([
            'pool_id' => $this->pool->id,
            'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
            'expiry_date' => config('constants.far_future_date'),
            'submitted_at' => config('constants.past_date'),
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_NEW_APPLICATION,
            'user_id' => User::factory([
                'has_priority_entitlement' => false,
                'armed_forces_status' => ApiEnums::ARMED_FORCES_NON_CAF,
                'citizenship' => ApiEnums::CITIZENSHIP_OTHER,
                'has_diploma' => false,
                'is_woman' => false,
            ])
        ]);
        // APPLICATION REVIEW, NO PRIORITY SO THIRD
        $candidateThree = PoolCandidate::factory()->create([
            'pool_id' => $this->pool->id,
            'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
            'expiry_date' => config('constants.far_future_date'),
            'submitted_at' => config('constants.past_date'),
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_APPLICATION_REVIEW,
            'user_id' => User::factory([
                'has_priority_entitlement' => false,
                'armed_forces_status' => ApiEnums::ARMED_FORCES_NON_CAF,
                'citizenship' => ApiEnums::CITIZENSHIP_OTHER,
                'has_diploma' => false,
                'is_woman' => false,
            ])
        ]);

        // NEW APPLICATION, VETERAN SO FIRST
        // has diploma and is woman
        $candidateFour = PoolCandidate::factory()->create([
            'pool_id' => $this->pool->id,
            'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14',
            'expiry_date' => config('constants.far_future_date'),
            'submitted_at' => config('constants.past_date'),
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_NEW_APPLICATION,
            'user_id' => User::factory([
                'has_priority_entitlement' => false,
                'armed_forces_status' => ApiEnums::ARMED_FORCES_VETERAN,
                'citizenship' => ApiEnums::CITIZENSHIP_CITIZEN,
                'has_diploma' => true,
                'is_woman' => true,
            ])
        ]);
        // QUALIFIED AVAILABLE, HAS ENTITLEMENT FOURTH
        // has diploma and is woman
        $candidateFive = PoolCandidate::factory()->create([
            'pool_id' => $this->pool->id,
            'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15',
            'expiry_date' => config('constants.far_future_date'),
            'submitted_at' => config('constants.past_date'),
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE,
            'user_id' => User::factory([
                'has_priority_entitlement' => true,
                'armed_forces_status' => ApiEnums::ARMED_FORCES_VETERAN,
                'citizenship' => ApiEnums::CITIZENSHIP_CITIZEN,
                'has_diploma' => true,
                'is_woman' => true,
            ])
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
        $this->actingAs($this->teamUser, "api")
            ->graphQL($query, ['where' => []])
            ->assertJson([
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

        // Assert that
        // PoolCandidates are filtered out by data on User, must have Diploma and be Woman
        // Candidate Four always precedes Candidate Five due to ORDERING
        $this->actingAs($this->teamUser, "api")
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
                        ]

                    ]
                ]
            )->assertJson([
                "data" => [
                    "poolCandidatesPaginated" => [
                        "data" => [
                            ["id" => $candidateFour->id,],
                            ["id" => $candidateFive->id,],
                        ]
                    ]
                ]
            ]);
    }

    public function testPoolCandidatesSearchExpiryFilter(): void
    {

        $candidateActive = PoolCandidate::factory()->create([
            'pool_id' => $this->pool->id,
            'expiry_date' => config('constants.far_future_date'),
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_PLACED_CASUAL,
            'user_id' => User::factory()
        ]);
        $candidateActive2 = PoolCandidate::factory()->create([
            'pool_id' => $this->pool->id,
            'expiry_date' => config('constants.far_future_date'),
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_PLACED_CASUAL,
            'user_id' => User::factory()
        ]);
        $candidateExpired = PoolCandidate::factory()->create([
            'pool_id' => $this->pool->id,
            'expiry_date' => config('constants.past_date'),
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_PLACED_CASUAL,
            'user_id' => User::factory()
        ]);
        $candidateNullExpiry = PoolCandidate::factory()->create([
            'pool_id' => $this->pool->id,
            'expiry_date' => null,
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_PLACED_CASUAL,
            'user_id' => User::factory()
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
        $this->actingAs($this->teamUser, "api")->graphQL(
            $query,
            [
                'where' => [
                    'expiryStatus' => ApiEnums::CANDIDATE_EXPIRY_FILTER_ACTIVE,
                ]
            ]
        )->assertJson([
            "data" => [
                "poolCandidatesPaginated" => [
                    "paginatorInfo" => [
                        'count' => 3,
                    ]
                ]
            ]
        ]);

        // Assert that EXPIRED returns 1
        $this->actingAs($this->teamUser, "api")->graphQL(
            $query,
            [
                'where' => [
                    'expiryStatus' => ApiEnums::CANDIDATE_EXPIRY_FILTER_EXPIRED,
                ]
            ]
        )->assertJson([
            "data" => [
                "poolCandidatesPaginated" => [
                    "paginatorInfo" => [
                        'count' => 1,
                    ]
                ]
            ]
        ]);

        // Assert that ALL returns 4 (all candidates)
        $this->actingAs($this->teamUser, "api")->graphQL(
            $query,
            [
                'where' => [
                    'expiryStatus' => ApiEnums::CANDIDATE_EXPIRY_FILTER_ALL,
                ]
            ]
        )->assertJson([
            "data" => [
                "poolCandidatesPaginated" => [
                    "paginatorInfo" => [
                        'count' => 4,
                    ]
                ]
            ]
        ]);
    }
}
