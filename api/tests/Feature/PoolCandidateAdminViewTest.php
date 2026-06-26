<?php

namespace Tests\Feature;

use App\Enums\ApplicationStatus;
use App\Enums\ScreeningStage;
use App\Models\AwardExperience;
use App\Models\Community;
use App\Models\CommunityInterest;
use App\Models\Department;
use App\Models\EducationExperience;
use App\Models\PersonalExperience;
use App\Models\Pool;
use App\Models\PoolCandidate;
use App\Models\Skill;
use App\Models\TalentNomination;
use App\Models\TalentNominationEvent;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Tests\TestCase;
use Tests\UsesProtectedGraphqlEndpoint;

use function PHPUnit\Framework\assertEqualsCanonicalizing;
use function PHPUnit\Framework\assertSame;

class PoolCandidateAdminViewTest extends TestCase
{
    use MakesGraphQLRequests;
    use RefreshDatabase;
    use RefreshesSchemaCache;
    use UsesProtectedGraphqlEndpoint;

    public Pool $pool;

    public Community $community;

    public Pool $otherPool;

    public Community $otherCommunity;

    protected Department $department;

    protected Department $otherDepartment;

    public User $applicant;

    public User $platformAdmin;

    public User $communityAdmin;

    public User $otherCommunityAdmin;

    public User $processOperator;

    public User $otherProcessOperator;

    public User $communityRecruiter;

    public User $otherCommunityRecruiter;

    protected $departmentAdmin;

    protected $otherDepartmentAdmin;

    protected $departmentHRAdvisor;

    protected $otherDepartmentHRAdvisor;

    public PoolCandidate $applicantPoolCandidate;

    public PoolCandidate $draftPoolCandidate;

    public PoolCandidate $thirdPoolCandidate;

    public string $paginatedAdminViewQuery =
        /** GraphQL */
        '
        query PoolCandidates ($orderByBase: PoolCandidatesBaseSort!) {
            poolCandidatesPaginatedAdminView(first: 100, orderByBase: $orderByBase) {
                paginatorInfo {
                    total
                }
                data {
                    id
                }
            }
        }
    ';

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);

        // Community/Pool/Department
        $this->community = Community::factory()->create();
        $this->department = Department::factory()->create();
        $this->pool = Pool::factory()->create([
            'community_id' => $this->community->id,
            'department_id' => $this->department->id,
        ]);
        $this->otherCommunity = Community::factory()->create();
        $this->otherDepartment = Department::factory()->create();
        $this->otherPool = Pool::factory()->create([
            'community_id' => $this->otherCommunity->id,
            'department_id' => $this->otherDepartment->id,
        ]);

        // Users
        $this->applicant = User::factory()->asApplicant()->create();
        $this->platformAdmin = User::factory()->asAdmin()->create();
        $this->communityAdmin = User::factory()->asCommunityAdmin($this->community->id)->create();
        $this->otherCommunityAdmin = User::factory()->asCommunityAdmin($this->otherCommunity->id)->create();
        $this->processOperator = User::factory()->asProcessOperator($this->pool->id)->create();
        $this->otherProcessOperator = User::factory()->asProcessOperator($this->otherPool->id)->create();
        $this->communityRecruiter = User::factory()->asCommunityRecruiter($this->community->id)->create();
        $this->otherCommunityRecruiter = User::factory()->asCommunityRecruiter($this->otherCommunity->id)->create();
        $this->departmentAdmin = User::factory()->asDepartmentAdmin($this->department->id)->create();
        $this->otherDepartmentAdmin = User::factory()->asDepartmentAdmin($this->otherDepartment->id)->create();
        $this->departmentHRAdvisor = User::factory()->asDepartmentHRAdvisor($this->department->id)->create();
        $this->otherDepartmentHRAdvisor = User::factory()->asDepartmentHRAdvisor($this->otherDepartment->id)->create();

        // PoolCandidates
        $this->applicantPoolCandidate = PoolCandidate::factory()->availableInSearch()->create(
            [
                'user_id' => $this->applicant->id,
                'pool_id' => $this->pool->id,
                'application_status' => ApplicationStatus::TO_ASSESS->name,
                'screening_stage' => ScreeningStage::NEW_APPLICATION->name,
            ]
        );
        $this->draftPoolCandidate = PoolCandidate::factory()->create(
            [
                'user_id' => User::factory()->create(),
                'pool_id' => $this->pool->id,
                'application_status' => ApplicationStatus::DRAFT->name,
            ]
        );
        $this->thirdPoolCandidate = PoolCandidate::factory()->availableInSearch()->create(
            [
                'user_id' => User::factory()->create(),
                'pool_id' => Pool::factory()->create([
                    'community_id' => Community::factory()->create(),
                    'department_id' => Department::factory()->create(),
                ]),
                'application_status' => ApplicationStatus::TO_ASSESS->name,
                'screening_stage' => ScreeningStage::NEW_APPLICATION->name,
            ]
        );
    }

    protected function assertPaginatedResponse(User $user, int $count, array $ids): void
    {
        $res = $this->actingAs($user, 'api')
            ->graphQL($this->paginatedAdminViewQuery, ['orderByBase' => []]);

        $res->assertJsonFragment([
            'paginatorInfo' => [
                'total' => $count,
            ],
        ]);

        foreach ($ids as $id) {
            $res->assertJsonFragment(['id' => $id]);
        }
    }

    // before testing, assert the candidates seeded
    public function testSeededCandidates(): void
    {
        // three candidates, two of them submitted
        // one draft candidate exists, that will NOT be fetched in any of the subsequent tests
        $candidates = PoolCandidate::all();
        assertSame(3, count($candidates));
        assertSame(2, count($candidates->whereNotNull('submitted_at')));
        assertSame(1, count($candidates->whereNull('submitted_at')));

        // two candidates belongs to public variable pool, other candidate does not belong to either public variable pools
        assertSame(2, count($candidates->whereIn('pool_id', [$this->pool->id])));
        assertSame(1, count($candidates->whereNotIn('pool_id', [$this->pool->id, $this->otherPool->id])));
    }

    public function testGuestCannotViewAnyApplications(): void
    {
        $guest = User::factory()->create();
        $this->assertPaginatedResponse($guest, 0, []);
    }

    // applicant cannot even view own
    public function testApplicantViewsNoOne(): void
    {
        $this->assertPaginatedResponse($this->applicant, 0, []);
    }

    // views all submitted applications
    public function testPlatformAdminViewsExpected(): void
    {
        $this->assertPaginatedResponse($this->platformAdmin, 2, [
            $this->applicantPoolCandidate->id,
            $this->thirdPoolCandidate->id,
        ]);
    }

    // views only applications in their community/team
    public function testCommunityAdminsViewExpected(): void
    {
        $this->assertPaginatedResponse($this->communityAdmin, 1, [
            $this->applicantPoolCandidate->id,
        ]);

        $this->assertPaginatedResponse($this->otherCommunityAdmin, 0, []);
    }

    // views only applications in their pool/team
    public function testProcessOperatorsViewExpected(): void
    {
        $this->assertPaginatedResponse($this->processOperator, 1, [
            $this->applicantPoolCandidate->id,
        ]);

        $this->assertPaginatedResponse($this->otherProcessOperator, 0, []);
    }

    // views only applications in their community/team
    public function testCommunityRecruitersViewExpected(): void
    {
        $this->assertPaginatedResponse($this->communityRecruiter, 1, [
            $this->applicantPoolCandidate->id,
        ]);
        $this->assertPaginatedResponse($this->otherCommunityRecruiter, 0, []);
    }

    // views only applications in their community/team/department
    public function testDepartmentAdminsViewExpected(): void
    {
        $this->assertPaginatedResponse($this->departmentAdmin, 1, [
            $this->applicantPoolCandidate->id,
        ]);
        $this->assertPaginatedResponse($this->otherDepartmentAdmin, 0, []);
    }

    // views only applications in their community/team/department
    public function testDepartmentAdvisorsViewExpected(): void
    {
        $this->assertPaginatedResponse($this->departmentHRAdvisor, 1, [
            $this->applicantPoolCandidate->id,
        ]);
        $this->assertPaginatedResponse($this->otherDepartmentHRAdvisor, 0, []);
    }

    // create a community interest for the user applying to external pool/community
    public function testCommunityInterestDoesNotExposeCandidate(): void
    {
        $thirdCandidateUser = $this->thirdPoolCandidate->user;
        CommunityInterest::factory()->create([
            'user_id' => $thirdCandidateUser->id,
            'community_id' => $this->community->id,
            'job_interest' => true,
            'training_interest' => true,
            'consent_to_share_profile' => true,
        ]);

        // queried results same as before, platform admin could already view this candidate
        // others still only see applicantPoolCandidate (if in their team)
        $this->assertPaginatedResponse($this->communityAdmin, 1, [
            $this->applicantPoolCandidate->id,
        ]);
        $this->assertPaginatedResponse($this->otherCommunityAdmin, 0, []);
        $this->assertPaginatedResponse($this->processOperator, 1, [
            $this->applicantPoolCandidate->id,
        ]);
        $this->assertPaginatedResponse($this->otherProcessOperator, 0, []);
        $this->assertPaginatedResponse($this->communityRecruiter, 1, [
            $this->applicantPoolCandidate->id,
        ]);
        $this->assertPaginatedResponse($this->otherCommunityRecruiter, 0, []);
        $this->assertPaginatedResponse($this->departmentAdmin, 1, [
            $this->applicantPoolCandidate->id,
        ]);
        $this->assertPaginatedResponse($this->otherDepartmentAdmin, 0, []);
        $this->assertPaginatedResponse($this->departmentHRAdvisor, 1, [
            $this->applicantPoolCandidate->id,
        ]);
        $this->assertPaginatedResponse($this->otherDepartmentHRAdvisor, 0, []);
    }

    // create nominations for the user applying to external pool/community
    public function testTalentNominationsDoNotExposeCandidate(): void
    {
        $thirdCandidateUser = $this->thirdPoolCandidate->user;
        $event1 = TalentNominationEvent::factory()->create([
            'community_id' => $this->community->id,
            'include_leadership_competencies' => false,
        ]);
        $event2 = TalentNominationEvent::factory()->create([
            'community_id' => $this->community->id,
            'include_leadership_competencies' => false,
        ]);
        TalentNomination::factory()
            ->submittedReviewAndSubmit()
            ->create([
                'nominator_id' => $this->communityAdmin->id,
                'nominee_id' => $thirdCandidateUser->id,
                'talent_nomination_event_id' => $event1->id,
            ]);
        TalentNomination::factory()
            ->submittedReviewAndSubmit()
            ->create([
                'nominator_id' => $this->otherCommunityRecruiter->id,
                'nominee_id' => $thirdCandidateUser->id,
                'talent_nomination_event_id' => $event2->id,
            ]);

        // queried results same as before, platform admin could already view this candidate
        // others still only see applicantPoolCandidate (if in their team)
        $this->assertPaginatedResponse($this->communityAdmin, 1, [
            $this->applicantPoolCandidate->id,
        ]);
        $this->assertPaginatedResponse($this->otherCommunityAdmin, 0, []);
        $this->assertPaginatedResponse($this->processOperator, 1, [
            $this->applicantPoolCandidate->id,
        ]);
        $this->assertPaginatedResponse($this->otherProcessOperator, 0, []);
        $this->assertPaginatedResponse($this->communityRecruiter, 1, [
            $this->applicantPoolCandidate->id,
        ]);
        $this->assertPaginatedResponse($this->otherCommunityRecruiter, 0, []);
        $this->assertPaginatedResponse($this->departmentAdmin, 1, [
            $this->applicantPoolCandidate->id,
        ]);
        $this->assertPaginatedResponse($this->otherDepartmentAdmin, 0, []);
        $this->assertPaginatedResponse($this->departmentHRAdvisor, 1, [
            $this->applicantPoolCandidate->id,
        ]);
        $this->assertPaginatedResponse($this->otherDepartmentHRAdvisor, 0, []);
    }

    // for the sake of thoroughness, leverage random seeding to try and see if any gaps appear
    public function testSeedMultipleRandomCandidates(): void
    {
        // wipe and seed, then test that none appear for users other than platform admin
        PoolCandidate::truncate();
        PoolCandidate::factory()
            ->count(10)
            ->withSnapshot()
            ->create([
                'user_id' => User::factory()
                    ->asApplicant()
                    ->withGovEmployeeProfile(),
                'pool_id' => Pool::factory()->create([
                    'community_id' => Community::factory()->create(),
                    'department_id' => Department::factory()->create(),
                ]),
            ]);

        // platform admin can see any submitted, the rest should not see any due to no overlap in teams
        $this->assertPaginatedResponse($this->communityAdmin, 0, []);
        $this->assertPaginatedResponse($this->otherCommunityAdmin, 0, []);
        $this->assertPaginatedResponse($this->processOperator, 0, []);
        $this->assertPaginatedResponse($this->otherProcessOperator, 0, []);
        $this->assertPaginatedResponse($this->communityRecruiter, 0, []);
        $this->assertPaginatedResponse($this->otherCommunityRecruiter, 0, []);
        $this->assertPaginatedResponse($this->departmentAdmin, 0, []);
        $this->assertPaginatedResponse($this->otherDepartmentAdmin, 0, []);
        $this->assertPaginatedResponse($this->departmentHRAdvisor, 0, []);
        $this->assertPaginatedResponse($this->otherDepartmentHRAdvisor, 0, []);
    }

    // Test in isolation the scope PoolCandidate::orderByBase() used by the query
    public function testScopeOrderByBase(): void
    {
        PoolCandidate::truncate();

        // create candidates
        $candidateBookmarked = PoolCandidate::factory()
            ->withSnapshot()
            ->create([
                'user_id' => User::factory()
                    ->asApplicant()
                    ->withGovEmployeeProfile(),
                'pool_id' => Pool::factory()->create(['community_id' => Community::factory()->create()]),
                'is_flagged' => false,
            ]);
        $candidateFlagged = PoolCandidate::factory()
            ->withSnapshot()
            ->create([
                'user_id' => User::factory()
                    ->asApplicant()
                    ->withGovEmployeeProfile(),
                'pool_id' => Pool::factory()->create(['community_id' => Community::factory()->create()]),
                'is_flagged' => true,
            ]);
        $candidate = PoolCandidate::factory()
            ->withSnapshot()
            ->create([
                'user_id' => User::factory()
                    ->asApplicant()
                    ->withGovEmployeeProfile(),
                'pool_id' => Pool::factory()->create(['community_id' => Community::factory()->create()]),
                'is_flagged' => false,
            ]);

        // insert bookmark for candidate-user
        DB::table('pool_candidate_user_bookmarks')->insert([
            'pool_candidate_id' => $candidateBookmarked->id,
            'user_id' => $this->platformAdmin->id,
        ]);

        // set Auth
        Auth::shouldReceive('user')
            ->andReturn($this->platformAdmin);

        // can only reliably assert the first returned user, so check bookmarked is first
        $candidateIdsBookmarked = PoolCandidate::orderByBase([
            'useBookmark' => true,
        ])
            ->get()
            ->pluck('id')
            ->toArray();
        assertSame($candidateIdsBookmarked[0], $candidateBookmarked->id);

        // can only reliably assert the first returned user, so check flagged is first
        $candidateIdsFlagged = PoolCandidate::orderByBase([
            'useFlag' => true,
        ])
            ->get()
            ->pluck('id')
            ->toArray();
        assertSame($candidateIdsFlagged[0], $candidateFlagged->id);

        // passing in both will set the order for the three the same way, bookmarked then flagged then other
        $candidateIdsBookmarkedFlagged = PoolCandidate::orderByBase([
            'useBookmark' => true,
            'useFlag' => true,
        ])
            ->get()
            ->pluck('id')
            ->toArray();
        assertEqualsCanonicalizing([
            $candidateBookmarked->id,
            $candidateFlagged->id,
            $candidate->id,
        ], $candidateIdsBookmarkedFlagged);
    }

    public function testSkillCount(): void
    {
        $query =
            /** @lang GraphQL */
            '
            query PoolCandidates($where: PoolCandidateSearchInput, $orderBy: QueryPoolCandidatesPaginatedAdminViewOrderByRelationOrderByClause!) {
                poolCandidatesPaginatedAdminView(where: $where, orderBy: [$orderBy]) {
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

        $userOneCandidate = PoolCandidate::factory()
            ->submitted()
            ->for($users[0])
            ->for($this->pool)
            ->create();

        $userTwoCandidate = PoolCandidate::factory()
            ->submitted()
            ->for($users[1])
            ->for($this->pool)
            ->create();

        // Assert skill count matches the number of skills in the subset and orders by skill count in ascending order
        $this->actingAs($this->communityAdmin, 'api')
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
                    'poolCandidatesPaginatedAdminView' => [
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
        $this->actingAs($this->communityAdmin, 'api')
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
                    'poolCandidatesPaginatedAdminView' => [
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
        $this->actingAs($this->communityAdmin, 'api')
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
                    'poolCandidatesPaginatedAdminView' => [
                        'data' => [],
                    ],
                ],
            ]);

        // Assert no skill count when no skills requested
        $this->actingAs($this->communityAdmin, 'api')
            ->graphQL($query, [
                'orderBy' => $orderByAsc,
            ])->assertJsonFragment(['skillCount' => null]);

        // Assert skill count only matches one skill overlapping (user two does not exist in the subset)
        $this->actingAs($this->communityAdmin, 'api')
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
                    'poolCandidatesPaginatedAdminView' => [
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

    public function testOrderByPoolName(): void
    {
        $query =
            /** @lang GraphQL */
            '
            query PoolCandidates($orderBy: PoolCandidatePoolNameOrderByInput) {
                poolCandidatesPaginatedAdminView(orderByPoolName: $orderBy) {
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

        PoolCandidate::truncate();
        PoolCandidate::factory()->submitted()->for($poolOne)->create();
        PoolCandidate::factory()->submitted()->for($poolTwo)->create();

        // Assert sorting by EN ASC returns proper order
        $this->actingAs($this->platformAdmin, 'api')
            ->graphQL($query, [
                'orderBy' => [
                    'locale' => 'en',
                    'order' => 'ASC',
                ],
            ])
            ->assertJson([
                'data' => [
                    'poolCandidatesPaginatedAdminView' => [
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
        $this->actingAs($this->platformAdmin, 'api')
            ->graphQL($query, [
                'orderBy' => [
                    'locale' => 'fr',
                    'order' => 'ASC',
                ],
            ])
            ->assertJson([
                'data' => [
                    'poolCandidatesPaginatedAdminView' => [
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
        $this->actingAs($this->platformAdmin, 'api')
            ->graphQL($query, [
                'orderBy' => [
                    'locale' => 'en',
                    'order' => 'DESC',
                ],
            ])
            ->assertJson([
                'data' => [
                    'poolCandidatesPaginatedAdminView' => [
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
        $this->actingAs($this->platformAdmin, 'api')
            ->graphQL($query, [
                'orderBy' => [
                    'locale' => 'fr',
                    'order' => 'DESC',
                ],
            ])
            ->assertJson([
                'data' => [
                    'poolCandidatesPaginatedAdminView' => [
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
            query PoolCandidates($where: PoolCandidateSearchInput, $orderBy: QueryPoolCandidatesPaginatedAdminViewOrderByRelationOrderByClause!) {
                poolCandidatesPaginatedAdminView(where: $where, orderBy: [$orderBy]) {
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
        $communityCandidate = PoolCandidate::factory()->availableInSearch()->for($communityPool)->create();
        $otherCandidate = PoolCandidate::factory()->availableInSearch()->for($otherPool)->create();

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
