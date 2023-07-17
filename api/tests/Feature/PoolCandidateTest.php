<?php

use App\Models\AwardExperience;
use App\Models\EducationExperience;
use App\Models\PersonalExperience;
use App\Models\Pool;
use App\Models\PoolCandidate;
use App\Models\Team;
use App\Models\User;
use App\Models\Skill;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Tests\TestCase;
use Database\Helpers\ApiEnums;

class PoolCandidateTest extends TestCase
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

    public function testPoolCandidateStatusAccessor(): void
    {
        $query =
            /** @lang GraphQL */
            '
            query poolCandidate($id: UUID!) {
                poolCandidate(id: $id) {
                    status
                }
            }
        ';

        // 1
        // not submitted, expiry date in the future DRAFT
        $candidateOne = PoolCandidate::factory()->create([
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_DRAFT,
            'submitted_at' => null,
            'expiry_date' => config('constants.far_future_date'),
            'pool_id' => $this->pool->id
        ]);
        // set status to EXPIRED manually despite not being submitted
        // this was split into two steps as otherwise PoolCandidateFactory automatically assigns a submitted_at
        $candidateOne->pool_candidate_status = ApiEnums::CANDIDATE_STATUS_EXPIRED;
        $candidateOne->save();

        // Assert candidate 1 is DRAFT, despite being set as EXPIRED, the null submitted_at forces an override
        // $this->actingAs($this->teamUser, "api")
        // ->graphQL($query, ['id' => $candidateOne->id])
        //     ->assertJson([
        //         "data" => [
        //             "poolCandidate" => [
        //                 "status" => ApiEnums::CANDIDATE_STATUS_DRAFT,
        //             ]
        //         ]
        //     ]);

        // 2
        // not submitted, expiry date in the past, DRAFT EXPIRED
        $candidateTwo = PoolCandidate::factory()->create([
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_DRAFT_EXPIRED,
            'submitted_at' => null,
            'expiry_date' => config('constants.past_date'),
            'pool_id' => $this->pool->id
        ]);
        // set status to EXPIRED manually despite not being submitted
        $candidateTwo->pool_candidate_status = ApiEnums::CANDIDATE_STATUS_EXPIRED;
        $candidateTwo->save();

        // Assert candidate 2 is DRAFT_EXPIRED, despite being set as EXPIRED, the null submitted_at forces an override
        // $this->actingAs($this->teamUser, "api")
        // ->graphQL($query, ['id' => $candidateTwo->id])
        //     ->assertJson([
        //         "data" => [
        //             "poolCandidate" => [
        //                 "status" => ApiEnums::CANDIDATE_STATUS_DRAFT_EXPIRED,
        //             ]
        //         ]
        //     ]);

        // 3
        // expired and submitted applicant that has a PLACED status
        $candidateThree = PoolCandidate::factory()->create([
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_PLACED_CASUAL,
            'submitted_at' => config('constants.past_date'),
            'expiry_date' => config('constants.past_date'),
            'pool_id' => $this->pool->id
        ]);

        // Assert candidate 3 is PLACED_CASUAL, despite being past expiry date
        $this->actingAs($this->teamUser, "api")
            ->graphQL($query, ['id' => $candidateThree->id])
            ->assertJson([
                "data" => [
                    "poolCandidate" => [
                        "status" => ApiEnums::CANDIDATE_STATUS_PLACED_CASUAL,
                    ]
                ]
            ]);

        // 4
        // expired and submitted applicant that lacks a PLACED status
        $candidateFour = PoolCandidate::factory()->create([
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_UNDER_ASSESSMENT,
            'submitted_at' => config('constants.past_date'),
            'expiry_date' => config('constants.past_date'),
            'pool_id' => $this->pool->id
        ]);

        // Assert candidate 2 is DRAFT_EXPIRED, despite being set as EXPIRED, the null submitted_at forces an override
        // $this->actingAs($this->teamUser, "api")
        // ->graphQL($query, ['id' => $candidateFour->id])
        //     ->assertJson([
        //         "data" => [
        //             "poolCandidate" => [
        //                 "status" => ApiEnums::CANDIDATE_STATUS_DRAFT_EXPIRED,
        //             ]
        //         ]
        //     ]);

        // 5
        // unexpired and submitted
        $candidateFive = PoolCandidate::factory()->create([
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_NEW_APPLICATION,
            'submitted_at' => config('constants.past_date'),
            'expiry_date' => config('constants.far_future_date'),
            'pool_id' => $this->pool->id
        ]);

        // Assert candidate 5 is NEW_APPLICATION as it was set
        $this->actingAs($this->teamUser, "api")
            ->graphQL($query, ['id' => $candidateFive->id])
            ->assertJson([
                "data" => [
                    "poolCandidate" => [
                        "status" => ApiEnums::CANDIDATE_STATUS_NEW_APPLICATION,
                    ]
                ]
            ]);

        // 6
        // unexpired and submitted
        $candidateSix = PoolCandidate::factory()->create([
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_APPLICATION_REVIEW,
            'submitted_at' => config('constants.past_date'),
            'expiry_date' => config('constants.far_future_date'),
            'pool_id' => $this->pool->id
        ]);

        // Assert candidate 6 is APPLICATION_REVIEW as it was set
        $this->actingAs($this->teamUser, "api")
            ->graphQL($query, ['id' => $candidateSix->id])
            ->assertJson([
                "data" => [
                    "poolCandidate" => [
                        "status" => ApiEnums::CANDIDATE_STATUS_APPLICATION_REVIEW,
                    ]
                ]
            ]);
    }

    public function testSkillCount(): void
    {
        $query =
            /** @lang GraphQL */
            '
            query PoolCandidates($where: PoolCandidateSearchInput, $orderBy: QueryPoolCandidatesPaginatedOrderByRelationOrderByClause!) {
                poolCandidatesPaginated(where: $where, orderBy: [$orderBy]) {
                    data {
                        id
                        skillCount
                    }
                }
            }
        ';

        $orderByAsc =  [
            'column' => 'skill_count',
            'order' => 'ASC'
        ];

        $orderByDesc =  [
            'column' => 'skill_count',
            'order' => 'DESC'
        ];

        $skills = Skill::factory()->count(10)->create();
        $skillSubset = [$skills[0]->id, $skills[1]->id, $skills[2]->id];
        $missingSkills = Skill::whereNotIn('id', $skillSubset)
            ->limit(3)
            ->get()
            ->pluck('id')
            ->toArray();

        $users = User::factory()->count(2)->create();
        $award = AwardExperience::factory()->create([
            'user_id' => $users[0]->id,
        ]);
        $award->skills()->sync([$skills[0]->id]);
        $users[0]->awardExperiences()->save($award);

        $education = EducationExperience::factory()->create([
            'user_id' => $users[0]->id,
        ]);
        $education->skills()->sync([$skills[1]->id]);
        $users[0]->educationExperiences()->save($education);

        $personal = PersonalExperience::factory()->create([
            'user_id' => $users[1]->id,
        ]);
        $personal->skills()->sync([$skills[2]->id]);
        $users[1]->personalExperiences()->save($personal);

        $userOneCandidate = PoolCandidate::factory()->create([
            'user_id' => $users[0]->id,
            'pool_id' => $this->pool->id,
            'submitted_at' => config('constants.past_date'),
        ]);
        $userTwoCandidate = PoolCandidate::factory()->create([
            'user_id' => $users[1]->id,
            'pool_id' => $this->pool->id,
            'submitted_at' => config('constants.past_date'),
        ]);

        // Assert skill count matches the number of skills in the subset and orders by skill count in ascending order
        $this->actingAs($this->teamUser, "api")
            ->graphQL($query, [
                'orderBy' => $orderByAsc,
                'where' => [
                    'applicantFilter' => [
                        'skills' => array_map(function ($id) {
                            return ['id' => $id];
                        }, $skillSubset)
                    ]
                ]
            ])
            ->assertJson([
                'data' => [
                    'poolCandidatesPaginated' => [
                        'data' => [
                            [
                                'id' => $userTwoCandidate->id,
                                'skillCount' => 1
                            ],
                            [
                                'id' => $userOneCandidate->id,
                                'skillCount' => 2
                            ]
                        ]
                    ]
                ]
            ]);

        // Assert skill count matches the number of skills in the subset and orders by skill count in descending order
        $this->actingAs($this->teamUser, "api")
            ->graphQL($query, [
                'orderBy' => $orderByDesc,
                'where' => [
                    'applicantFilter' => [
                        'skills' => array_map(function ($id) {
                            return ['id' => $id];
                        }, $skillSubset)
                    ]
                ]
            ])
            ->assertJson([
                'data' => [
                    'poolCandidatesPaginated' => [
                        'data' => [
                            [
                                'id' => $userOneCandidate->id,
                                'skillCount' => 2
                            ],
                            [
                                'id' => $userTwoCandidate->id,
                                'skillCount' => 1
                            ]
                        ]
                    ]
                ]
            ]);

        // Assert no skill count when no overlapping
        $this->actingAs($this->teamUser, "api")
            ->graphQL($query, [
                'orderBy' => $orderByAsc,
                'where' => [
                    'applicantFilter' => [
                        'skills' => array_map(function ($id) {
                            return ['id' => $id];
                        }, $missingSkills)
                    ]
                ]
            ])->assertJson([
                'data' => [
                    'poolCandidatesPaginated' => [
                        'data' => []
                    ]
                ]
            ]);

        // Assert no skill count when no skills requested
        $this->actingAs($this->teamUser, "api")
            ->graphQL($query, [
                'orderBy' => $orderByAsc,
            ])->assertJsonFragment(['skillCount' => null]);

        // Assert skill count only matches one skill overlapping (user two does not exist in the subset)
        $this->actingAs($this->teamUser, "api")
            ->graphQL($query, [
                'orderBy' => $orderByAsc,
                'where' => [
                    'applicantFilter' => [
                        'skills' =>
                        [
                            ['id' => $skillSubset[0]],
                            ['id' => $missingSkills[0]],
                            ['id' => $missingSkills[1]],
                            ['id' => $missingSkills[2]]
                        ],
                    ]
                ]
            ])->assertJson([
                'data' => [
                    'poolCandidatesPaginated' => [
                        'data' => [
                            [
                                'id' => $userOneCandidate->id,
                                'skillCount' => 1
                            ]
                        ]
                    ]
                ]
            ]);
    }
}
