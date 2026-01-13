<?php

namespace Tests\Feature;

use App\Enums\ApplicationStatus;
use App\Enums\ScreeningStage;
use App\Models\Community;
use App\Models\CommunityInterest;
use App\Models\Pool;
use App\Models\PoolCandidate;
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

    public User $applicant;

    public User $platformAdmin;

    public User $communityAdmin;

    public User $otherCommunityAdmin;

    public User $processOperator;

    public User $otherProcessOperator;

    public User $communityRecruiter;

    public User $otherCommunityRecruiter;

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

        // Community/Pool
        $this->community = Community::factory()->create();
        $this->pool = Pool::factory()->create([
            'community_id' => $this->community->id,
        ]);
        $this->otherCommunity = Community::factory()->create();
        $this->otherPool = Pool::factory()->create([
            'community_id' => $this->otherCommunity->id,
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
                'pool_id' => Pool::factory()->create(['community_id' => Community::factory()->create()]),
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
                'pool_id' => Pool::factory()->create(['community_id' => Community::factory()->create()]),
            ]);

        // platform admin can see any submitted, the rest should not see any due to no overlap in teams
        $this->assertPaginatedResponse($this->communityAdmin, 0, []);
        $this->assertPaginatedResponse($this->otherCommunityAdmin, 0, []);
        $this->assertPaginatedResponse($this->processOperator, 0, []);
        $this->assertPaginatedResponse($this->otherProcessOperator, 0, []);
        $this->assertPaginatedResponse($this->communityRecruiter, 0, []);
        $this->assertPaginatedResponse($this->otherCommunityRecruiter, 0, []);
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
}
