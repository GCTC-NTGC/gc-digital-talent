<?php

namespace Tests\Feature;

use App\Enums\ApplicationStatus;
use App\Enums\ScreeningStage;
use App\Facades\Notify;
use App\Models\AwardExperience;
use App\Models\Community;
use App\Models\EducationExperience;
use App\Models\PersonalExperience;
use App\Models\Pool;
use App\Models\PoolCandidate;
use App\Models\Skill;
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

    protected $communityRecruiterUser;

    protected $communityUser;

    protected $unAssociatedCommunityUser;

    protected $community;

    protected $pool;

    protected function setUp(): void
    {
        parent::setUp();
        Notify::spy(); // don't send any notifications
        $this->seed(RolePermissionSeeder::class);

        $this->community = Community::factory()->create();

        $this->pool = Pool::factory()->create([
            'community_id' => $this->community->id,
        ]);

        $this->adminUser = User::factory()
            ->asApplicant()
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

        $this->communityRecruiterUser = User::factory()
            ->asCommunityRecruiter($this->community->id)
            ->create([
                'email' => 'community-recruiter-user@test.com',
                'sub' => 'community-recruiter-user@test.com',
            ]);

        $this->communityUser = User::factory()
            ->asApplicant()
            ->asCommunityAdmin($this->community->id)
            ->create([
                'email' => 'community-admin@test.com',
                'sub' => 'community-admin@test.com',
            ]);

        // Community and users not associated with the Pool we are testing against
        $unAssociatedCommunity = Community::factory()->create();

        $this->unAssociatedCommunityUser = User::factory()
            ->asApplicant()
            ->asCommunityAdmin($unAssociatedCommunity->id)
            ->create([
                'email' => 'unassociated-community-admin@test.com',
                'sub' => 'unassociated-community-admin@test.com',
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
        $this->actingAs($this->communityUser, 'api')
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
        $this->actingAs($this->communityUser, 'api')
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
        $this->actingAs($this->communityUser, 'api')
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
        $this->actingAs($this->communityUser, 'api')
            ->graphQL($query, [
                'orderBy' => $orderByAsc,
            ])->assertJsonFragment(['skillCount' => null]);

        // Assert skill count only matches one skill overlapping (user two does not exist in the subset)
        $this->actingAs($this->communityUser, 'api')
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
            'application_status' => ApplicationStatus::TO_ASSESS->name,
            'screening_stage' => ScreeningStage::NEW_APPLICATION->name,
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

        // Assert community member can view notes
        $this->actingAs($this->communityUser, 'api')
            ->graphQL($notesQuery, ['id' => $candidate->id])
            ->assertJson([
                'data' => [
                    'poolCandidate' => [
                        'notes' => $candidate->notes,
                    ],
                ],
            ]);

        // Assert community recruiter can view notes
        $this->actingAs($this->communityRecruiterUser, 'api')
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

        // Assert an unassociated process operator cannot query candidate notes
        $this->actingAs($this->unAssociatedCommunityUser, 'api')
            ->graphQL($notesQuery, ['id' => $candidate->id])
            ->assertGraphQLErrorMessage('This action is unauthorized.');
    }

    public function testNotesUpdate(): void
    {
        $candidate = PoolCandidate::factory()->create([
            'application_status' => ApplicationStatus::TO_ASSESS->name,
            'screening_stage' => ScreeningStage::NEW_APPLICATION->name,
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

        $this->actingAs($this->unAssociatedCommunityUser, 'api')
            ->graphQL($notesMutation, $notesVariables)
            ->assertGraphQLErrorMessage('This action is unauthorized.');

        // Assert community member can update notes
        $this->actingAs($this->communityUser, 'api')
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
            'application_status' => ApplicationStatus::TO_ASSESS->name,
            'screening_stage' => ScreeningStage::NEW_APPLICATION->name,
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

        // Assert community member can view status
        $this->actingAs($this->communityUser, 'api')
            ->graphQL($statusQuery, ['id' => $candidate->id])
            ->assertJson([
                'data' => [
                    'poolCandidate' => [
                        'status' => [
                            'value' => $candidate->application_status,
                        ],
                    ],
                ],
            ]);

        // Assert community recruiter can view status
        $this->actingAs($this->communityRecruiterUser, 'api')
            ->graphQL($statusQuery, ['id' => $candidate->id])
            ->assertJson([
                'data' => [
                    'poolCandidate' => [
                        'status' => [
                            'value' => $candidate->application_status,
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
                            'value' => $candidate->application_status,
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
                            'value' => $candidate->application_status,
                        ],
                    ],
                ],
            ]);

        // Assert an unassociated process operator cannot query candidate status
        $this->actingAs($this->unAssociatedCommunityUser, 'api')
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

    public function testAccessingDeletedEducationExperienceIds()
    {
        $candidate = PoolCandidate::factory()
            ->availableInSearch()
            ->withSnapshot()
            ->create();

        $expected = $candidate->education_requirement_experiences->map(fn ($exp) => $exp->id)->toArray();
        $candidate->education_requirement_experiences->each(fn ($exp) => $exp->delete());

        $this->assertEqualsCanonicalizing($expected, $candidate->education_requirement_experience_ids);

    }
}
