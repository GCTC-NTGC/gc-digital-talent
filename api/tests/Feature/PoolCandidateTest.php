<?php

namespace Tests\Feature;

use App\Enums\PoolCandidateStatus;
use App\Facades\Notify;
use App\Models\AwardExperience;
use App\Models\Community;
use App\Models\EducationExperience;
use App\Models\PersonalExperience;
use App\Models\Pool;
use App\Models\PoolCandidate;
use App\Models\Skill;
use App\Models\Team;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Tests\TestCase;
use Tests\UsesProtectedGraphqlEndpoint;

class PoolCandidateTest extends TestCase
{
    use MakesGraphQLRequests;
    use RefreshDatabase;
    use RefreshesSchemaCache;
    use UsesProtectedGraphqlEndpoint;

    protected $adminUser;

    protected $applicantUser;

    protected $requestResponderUser;

    protected $teamUser;

    protected $unAssociatedTeamUser;

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

        $this->adminUser = User::factory()
            ->asApplicant()
            ->asRequestResponder()
            ->asAdmin()
            ->create([
                'email' => 'platform-admin-user@test.com',
                'sub' => 'platform-admin-user@test.com',
            ]);

        $this->applicantUser = User::factory()
            ->asApplicant()
            ->create([
                'email' => 'applicant-user@test.com',
                'sub' => 'applicant-user@test.com',
            ]);

        $this->requestResponderUser = User::factory()
            ->asRequestResponder()
            ->create([
                'email' => 'request-responder-user@test.com',
                'sub' => 'request-responder-user@test.com',
            ]);

        $this->teamUser = User::factory()
            ->asApplicant()
            ->asPoolOperator($this->team->name)
            ->create([
                'email' => 'team-user@test.com',
                'sub' => 'team-user@test.com',
            ]);

        // Team and users not associated with the Pool we are testing against
        $unAssociatedTeam = Team::factory()->create();

        $this->unAssociatedTeamUser = User::factory()
            ->asApplicant()
            ->asPoolOperator($unAssociatedTeam->name)
            ->create([
                'email' => 'unassociated-team-user@test.com',
                'sub' => 'unassociated-team-user@test.com',
            ]);
    }

    public function testPoolCandidateStatusAccessor(): void
    {
        $query =
            /** @lang GraphQL */
            '
            query poolCandidate($id: UUID!) {
                poolCandidate(id: $id) {
                    status { value }
                }
            }
        ';

        // 1
        // not submitted, expiry date in the future DRAFT
        $candidateOne = PoolCandidate::factory()->create([
            'pool_candidate_status' => PoolCandidateStatus::DRAFT->name,
            'submitted_at' => null,
            'expiry_date' => config('constants.far_future_date'),
            'pool_id' => $this->pool->id,
        ]);
        // set status to EXPIRED manually despite not being submitted
        // this was split into two steps as otherwise PoolCandidateFactory automatically assigns a submitted_at
        $candidateOne->pool_candidate_status = PoolCandidateStatus::EXPIRED->name;
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
            'pool_candidate_status' => PoolCandidateStatus::DRAFT_EXPIRED->name,
            'submitted_at' => null,
            'expiry_date' => config('constants.past_date'),
            'pool_id' => $this->pool->id,
        ]);
        // set status to EXPIRED manually despite not being submitted
        $candidateTwo->pool_candidate_status = PoolCandidateStatus::EXPIRED->name;
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
            'pool_candidate_status' => PoolCandidateStatus::PLACED_CASUAL->name,
            'submitted_at' => config('constants.past_date'),
            'expiry_date' => config('constants.past_date'),
            'pool_id' => $this->pool->id,
        ]);

        // Assert candidate 3 is PLACED_CASUAL, despite being past expiry date
        $this->actingAs($this->teamUser, 'api')
            ->graphQL($query, ['id' => $candidateThree->id])
            ->assertJson([
                'data' => [
                    'poolCandidate' => [
                        'status' => [
                            'value' => PoolCandidateStatus::PLACED_CASUAL->name,
                        ],
                    ],
                ],
            ]);

        // 4
        // expired and submitted applicant that lacks a PLACED status
        $candidateFour = PoolCandidate::factory()->create([
            'pool_candidate_status' => PoolCandidateStatus::UNDER_ASSESSMENT->name,
            'submitted_at' => config('constants.past_date'),
            'expiry_date' => config('constants.past_date'),
            'pool_id' => $this->pool->id,
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
            'pool_candidate_status' => PoolCandidateStatus::NEW_APPLICATION->name,
            'submitted_at' => config('constants.past_date'),
            'expiry_date' => config('constants.far_future_date'),
            'pool_id' => $this->pool->id,
        ]);

        // Assert candidate 5 is NEW_APPLICATION as it was set
        $this->actingAs($this->teamUser, 'api')
            ->graphQL($query, ['id' => $candidateFive->id])
            ->assertJson([
                'data' => [
                    'poolCandidate' => [
                        'status' => [
                            'value' => PoolCandidateStatus::NEW_APPLICATION->name,
                        ],
                    ],
                ],
            ]);

        // 6
        // unexpired and submitted
        $candidateSix = PoolCandidate::factory()->create([
            'pool_candidate_status' => PoolCandidateStatus::APPLICATION_REVIEW->name,
            'submitted_at' => config('constants.past_date'),
            'expiry_date' => config('constants.far_future_date'),
            'pool_id' => $this->pool->id,
        ]);

        // Assert candidate 6 is APPLICATION_REVIEW as it was set
        $this->actingAs($this->teamUser, 'api')
            ->graphQL($query, ['id' => $candidateSix->id])
            ->assertJson([
                'data' => [
                    'poolCandidate' => [
                        'status' => [
                            'value' => PoolCandidateStatus::APPLICATION_REVIEW->name,
                        ],
                    ],
                ],
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

        $orderByAsc = [
            'column' => 'skill_count',
            'order' => 'ASC',
        ];

        $orderByDesc = [
            'column' => 'skill_count',
            'order' => 'DESC',
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
        $award->syncSkills([$skills[0]]);
        $users[0]->awardExperiences()->save($award);

        $education = EducationExperience::factory()->create([
            'user_id' => $users[0]->id,
        ]);
        $education->syncSkills([$skills[1]]);
        $users[0]->educationExperiences()->save($education);

        $personal = PersonalExperience::factory()->create([
            'user_id' => $users[1]->id,
        ]);
        $personal->syncSkills([$skills[2]]);
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
        $this->actingAs($this->teamUser, 'api')
            ->graphQL($query, [
                'orderBy' => $orderByAsc,
                'where' => [
                    'applicantFilter' => [
                        'skills' => array_map(function ($id) {
                            return ['id' => $id];
                        }, $skillSubset),
                    ],
                ],
            ])
            ->assertJson([
                'data' => [
                    'poolCandidatesPaginated' => [
                        'data' => [
                            [
                                'id' => $userTwoCandidate->id,
                                'skillCount' => 1,
                            ],
                            [
                                'id' => $userOneCandidate->id,
                                'skillCount' => 2,
                            ],
                        ],
                    ],
                ],
            ]);

        // Assert skill count matches the number of skills in the subset and orders by skill count in descending order
        $this->actingAs($this->teamUser, 'api')
            ->graphQL($query, [
                'orderBy' => $orderByDesc,
                'where' => [
                    'applicantFilter' => [
                        'skills' => array_map(function ($id) {
                            return ['id' => $id];
                        }, $skillSubset),
                    ],
                ],
            ])
            ->assertJson([
                'data' => [
                    'poolCandidatesPaginated' => [
                        'data' => [
                            [
                                'id' => $userOneCandidate->id,
                                'skillCount' => 2,
                            ],
                            [
                                'id' => $userTwoCandidate->id,
                                'skillCount' => 1,
                            ],
                        ],
                    ],
                ],
            ]);

        // Assert no skill count when no overlapping
        $this->actingAs($this->teamUser, 'api')
            ->graphQL($query, [
                'orderBy' => $orderByAsc,
                'where' => [
                    'applicantFilter' => [
                        'skills' => array_map(function ($id) {
                            return ['id' => $id];
                        }, $missingSkills),
                    ],
                ],
            ])->assertJson([
                'data' => [
                    'poolCandidatesPaginated' => [
                        'data' => [],
                    ],
                ],
            ]);

        // Assert no skill count when no skills requested
        $this->actingAs($this->teamUser, 'api')
            ->graphQL($query, [
                'orderBy' => $orderByAsc,
            ])->assertJsonFragment(['skillCount' => null]);

        // Assert skill count only matches one skill overlapping (user two does not exist in the subset)
        $this->actingAs($this->teamUser, 'api')
            ->graphQL($query, [
                'orderBy' => $orderByAsc,
                'where' => [
                    'applicantFilter' => [
                        'skills' => [
                            ['id' => $skillSubset[0]],
                            ['id' => $missingSkills[0]],
                            ['id' => $missingSkills[1]],
                            ['id' => $missingSkills[2]],
                        ],
                    ],
                ],
            ])->assertJson([
                'data' => [
                    'poolCandidatesPaginated' => [
                        'data' => [
                            [
                                'id' => $userOneCandidate->id,
                                'skillCount' => 1,
                            ],
                        ],
                    ],
                ],
            ]);
    }

    public function testNotesAccess(): void
    {
        $candidate = PoolCandidate::factory()->create([
            'pool_candidate_status' => PoolCandidateStatus::NEW_APPLICATION->name,
            'submitted_at' => config('constants.past_date'),
            'expiry_date' => config('constants.far_future_date'),
            'pool_id' => $this->pool->id,
            'user_id' => $this->applicantUser->id,
        ]);

        $basicQuery = /** @lang GraphQL */
        '
            query poolCandidate($id: UUID!) {
                poolCandidate(id: $id) {
                    id
                }
            }
         ';

        $notesQuery = /** @lang GraphQL */
        '
            query poolCandidate($id: UUID!) {
                poolCandidate(id: $id) {
                    notes
                }
            }
         ';

        // Assert team member can view notes
        $this->actingAs($this->teamUser, 'api')
            ->graphQL($notesQuery, ['id' => $candidate->id])
            ->assertJson([
                'data' => [
                    'poolCandidate' => [
                        'notes' => $candidate->notes,
                    ],
                ],
            ]);

        // Assert request responder can view notes
        $this->actingAs($this->requestResponderUser, 'api')
            ->graphQL($notesQuery, ['id' => $candidate->id])
            ->assertJson([
                'data' => [
                    'poolCandidate' => [
                        'notes' => $candidate->notes,
                    ],
                ],
            ]);

        // Assert admin can view notes
        $this->actingAs($this->adminUser, 'api')
            ->graphQL($notesQuery, ['id' => $candidate->id])
            ->assertJson([
                'data' => [
                    'poolCandidate' => [
                        'notes' => $candidate->notes,
                    ],
                ],
            ]);

        // Assert applicant can query candidate, but not access notes
        $this->actingAs($this->applicantUser, 'api')
            ->graphQL($basicQuery, ['id' => $candidate->id])
            ->assertJson([
                'data' => [
                    'poolCandidate' => [
                        'id' => $candidate->id,
                    ],
                ],
            ]);
        $this->actingAs($this->applicantUser, 'api')
            ->graphQL($notesQuery, ['id' => $candidate->id])
            ->assertGraphQLErrorMessage('This action is unauthorized.');

        // Assert an unassociated pool operator cannot query candidate notes
        $this->actingAs($this->unAssociatedTeamUser, 'api')
            ->graphQL($notesQuery, ['id' => $candidate->id])
            ->assertGraphQLErrorMessage('This action is unauthorized.');
    }

    public function testNotesUpdate(): void
    {
        $candidate = PoolCandidate::factory()->create([
            'pool_candidate_status' => PoolCandidateStatus::NEW_APPLICATION->name,
            'submitted_at' => config('constants.past_date'),
            'expiry_date' => config('constants.far_future_date'),
            'pool_id' => $this->pool->id,
            'user_id' => $this->applicantUser->id,
        ]);

        $notesMutation = /** @lang GraphQL */
        '
            mutation UpdatePoolCandidateNotes($id: UUID!, $notes: String) {
                updatePoolCandidateNotes(id: $id, notes: $notes) {
                    id
                    notes
                }
            }
         ';

        $notesVariables = ['id' => $candidate->id, 'notes' => 'new notes'];

        $this->actingAs($this->applicantUser, 'api')
            ->graphQL($notesMutation, $notesVariables)
            ->assertGraphQLErrorMessage('This action is unauthorized.');

        $this->actingAs($this->unAssociatedTeamUser, 'api')
            ->graphQL($notesMutation, $notesVariables)
            ->assertGraphQLErrorMessage('This action is unauthorized.');

        // Assert team member can update notes
        $this->actingAs($this->teamUser, 'api')
            ->graphQL($notesMutation, $notesVariables)
            ->assertJson([
                'data' => [
                    'updatePoolCandidateNotes' => $notesVariables,
                ],
            ]);
    }

    /**
     * Status access permissions are similar to notes, except a candidate can see their own status
     */
    public function testStatusAccess(): void
    {
        $candidate = PoolCandidate::factory()->create([
            'pool_candidate_status' => PoolCandidateStatus::NEW_APPLICATION->name,
            'submitted_at' => config('constants.past_date'),
            'expiry_date' => config('constants.far_future_date'),
            'pool_id' => $this->pool->id,
            'user_id' => $this->applicantUser->id,
        ]);

        $statusQuery = /** @lang GraphQL */
        '
            query poolCandidate($id: UUID!) {
                poolCandidate(id: $id) {
                    status { value }
                }
            }
         ';

        // Assert team member can view status
        $this->actingAs($this->teamUser, 'api')
            ->graphQL($statusQuery, ['id' => $candidate->id])
            ->assertJson([
                'data' => [
                    'poolCandidate' => [
                        'status' => [
                            'value' => $candidate->pool_candidate_status,
                        ],
                    ],
                ],
            ]);

        // Assert request responder can view status
        $this->actingAs($this->requestResponderUser, 'api')
            ->graphQL($statusQuery, ['id' => $candidate->id])
            ->assertJson([
                'data' => [
                    'poolCandidate' => [
                        'status' => [
                            'value' => $candidate->pool_candidate_status,
                        ],
                    ],
                ],
            ]);

        // Assert admin can view status
        $this->actingAs($this->adminUser, 'api')
            ->graphQL($statusQuery, ['id' => $candidate->id])
            ->assertJson([
                'data' => [
                    'poolCandidate' => [
                        'status' => [
                            'value' => $candidate->pool_candidate_status,
                        ],
                    ],
                ],
            ]);

        // Assert applicant can access status
        $this->actingAs($this->applicantUser, 'api')
            ->graphQL($statusQuery, ['id' => $candidate->id])
            ->assertJson([
                'data' => [
                    'poolCandidate' => [
                        'status' => [
                            'value' => $candidate->pool_candidate_status,
                        ],
                    ],
                ],
            ]);

        // Assert an unassociated pool operator cannot query candidate status
        $this->actingAs($this->unAssociatedTeamUser, 'api')
            ->graphQL($statusQuery, ['id' => $candidate->id])
            ->assertGraphQLErrorMessage('This action is unauthorized.');
    }

    public function testOrderByPoolName(): void
    {
        $query =
            /** @lang GraphQL */
            '
            query PoolCandidates($orderBy: PoolCandidatePoolNameOrderByInput) {
                poolCandidatesPaginated(orderByPoolName: $orderBy) {
                    data {
                        id
                        poolCandidate {
                            id
                            pool {
                                id
                                name {
                                    en
                                    fr
                                    localized
                                }
                            }
                        }
                    }
                }
            }
        ';

        $poolOne = Pool::factory()->published()->create([
            'name' => ['en' => 'AA (EN)', 'fr' => 'ÀÉ (FR)'],
        ]);

        $poolTwo = Pool::factory()->published()->create([
            'name' => ['en' => 'AB (EN)', 'fr' => 'ÀÀ (FR)'],
        ]);

        $userOneCandidate = PoolCandidate::factory()->create([
            'pool_id' => $poolOne->id,
            'submitted_at' => config('constants.past_date'),
        ]);
        $userTwoCandidate = PoolCandidate::factory()->create([
            'pool_id' => $poolTwo->id,
            'submitted_at' => config('constants.past_date'),
        ]);

        // Assert sorting by EN ASC returns proper order
        $this->actingAs($this->adminUser, 'api')
            ->graphQL($query, [
                'orderBy' => [
                    'locale' => 'en',
                    'order' => 'ASC',
                ],
            ])
            ->assertJson([
                'data' => [
                    'poolCandidatesPaginated' => [
                        'data' => [
                            [
                                'poolCandidate' => [
                                    'pool' => [
                                        'name' => $poolOne->name,
                                    ],
                                ],
                            ],
                            [
                                'poolCandidate' => [
                                    'pool' => [
                                        'name' => $poolTwo->name,
                                    ],
                                ],
                            ],
                        ],
                    ],
                ],
            ]);

        // Assert sorting by FR ASC returns proper order
        $this->actingAs($this->adminUser, 'api')
            ->graphQL($query, [
                'orderBy' => [
                    'locale' => 'fr',
                    'order' => 'ASC',
                ],
            ])
            ->assertJson([
                'data' => [
                    'poolCandidatesPaginated' => [
                        'data' => [
                            [
                                'poolCandidate' => [
                                    'pool' => [
                                        'name' => $poolTwo->name,
                                    ],
                                ],
                            ],
                            [
                                'poolCandidate' => [
                                    'pool' => [
                                        'name' => $poolOne->name,
                                    ],
                                ],
                            ],
                        ],
                    ],
                ],
            ]);

        // Assert sorting by EN DESC returns proper order
        $this->actingAs($this->adminUser, 'api')
            ->graphQL($query, [
                'orderBy' => [
                    'locale' => 'en',
                    'order' => 'DESC',
                ],
            ])
            ->assertJson([
                'data' => [
                    'poolCandidatesPaginated' => [
                        'data' => [
                            [
                                'poolCandidate' => [
                                    'pool' => [
                                        'name' => $poolTwo->name,
                                    ],
                                ],
                            ],
                            [
                                'poolCandidate' => [
                                    'pool' => [
                                        'name' => $poolOne->name,
                                    ],
                                ],
                            ],
                        ],
                    ],
                ],
            ]);

        // Assert sorting by FR DESC returns proper order
        $this->actingAs($this->adminUser, 'api')
            ->graphQL($query, [
                'orderBy' => [
                    'locale' => 'fr',
                    'order' => 'DESC',
                ],
            ])
            ->assertJson([
                'data' => [
                    'poolCandidatesPaginated' => [
                        'data' => [
                            [
                                'poolCandidate' => [
                                    'pool' => [
                                        'name' => $poolOne->name,
                                    ],
                                ],
                            ],
                            [
                                'poolCandidate' => [
                                    'pool' => [
                                        'name' => $poolTwo->name,
                                    ],
                                ],
                            ],
                        ],
                    ],
                ],
            ]);

    }

    public function testScopeCandidatesInCommunity(): void
    {
        $query =
        /** @lang GraphQL */
        '
            query PoolCandidates($where: PoolCandidateSearchInput, $orderBy: QueryPoolCandidatesPaginatedOrderByRelationOrderByClause!) {
                poolCandidatesPaginated(where: $where, orderBy: [$orderBy]) {
                    data {
                        id
                    }
                    paginatorInfo {
                        total
                    }
                }
            }
        ';

        $community = Community::factory()->create();
        $otherCommunity = Community::factory()->create();
        $communityPool = Pool::factory()->published()->create(['community_id' => $community->id]);
        $otherPool = Pool::factory()->published()->create(['community_id' => $otherCommunity->id]);
        $communityCandidate = PoolCandidate::factory()->availableInSearch()->create(['pool_id' => $communityPool]);
        $otherCandidate = PoolCandidate::factory()->availableInSearch()->create(['pool_id' => $otherPool]);

        // acting user belongs to both communities to avoid interaction with authorizedToViewScope
        $communityAdmin = User::factory()
            ->asCommunityAdmin([$community->id, $otherCommunity->id])
            ->create();

        // assert no community selection displays both candidates
        $this->actingAs($communityAdmin, 'api')
            ->graphQL($query, [
                'orderBy' => [
                    'column' => 'id',
                    'order' => 'ASC',
                ],
                'where' => [
                    'applicantFilter' => [],
                ],
            ])->assertJsonFragment(['total' => 2])
            ->assertJsonFragment(['id' => $communityCandidate->id])
            ->assertJsonFragment(['id' => $otherCandidate->id]);

        // assert selecting $community returns one candidate associated with that community
        $this->actingAs($communityAdmin, 'api')
            ->graphQL($query, [
                'orderBy' => [
                    'column' => 'id',
                    'order' => 'ASC',
                ],
                'where' => [
                    'applicantFilter' => [
                        'community' => ['id' => $community->id],
                    ],
                ],
            ])->assertJsonFragment(['total' => 1])
            ->assertJsonFragment(['id' => $communityCandidate->id]);
    }
}
