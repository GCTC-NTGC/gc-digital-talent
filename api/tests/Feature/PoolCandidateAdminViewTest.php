<?php

namespace Tests\Feature;

use App\Enums\PoolCandidateStatus;
use App\Models\Community;
use App\Models\CommunityInterest;
use App\Models\Pool;
use App\Models\PoolCandidate;
use App\Models\TalentNomination;
use App\Models\TalentNominationEvent;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Tests\TestCase;
use Tests\UsesProtectedGraphqlEndpoint;

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
        query PoolCandidates {
            poolCandidatesPaginatedAdminView(first: 100) {
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
                'pool_candidate_status' => PoolCandidateStatus::NEW_APPLICATION->name,
            ]
        );
        $this->draftPoolCandidate = PoolCandidate::factory()->create(
            [
                'user_id' => User::factory()->create(),
                'pool_id' => $this->pool->id,
                'pool_candidate_status' => PoolCandidateStatus::DRAFT->name,
            ]
        );
        $this->thirdPoolCandidate = PoolCandidate::factory()->availableInSearch()->create(
            [
                'user_id' => User::factory()->create(),
                'pool_id' => Pool::factory()->create(['community_id' => Community::factory()->create()]),
                'pool_candidate_status' => PoolCandidateStatus::NEW_APPLICATION->name,
            ]
        );
    }

    protected function assertPaginatedResponse(User $user, int $count, array $ids): void
    {
        $res = $this->actingAs($user, 'api')
            ->graphQL($this->paginatedAdminViewQuery);

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

    public function testApplicantViewsOnlyOwn(): void
    {
        $this->assertPaginatedResponse($this->applicant, 1, [
            $this->applicantPoolCandidate->id,
        ]);
    }

    public function testPlatformAdminViewsExpected(): void
    {
        $this->assertPaginatedResponse($this->platformAdmin, 2, [
            $this->applicantPoolCandidate->id,
            $this->thirdPoolCandidate->id,
        ]);
    }

    public function testCommunityAdminsViewExpected(): void
    {
        $this->assertPaginatedResponse($this->communityAdmin, 1, [
            $this->applicantPoolCandidate->id,
        ]);

        $this->assertPaginatedResponse($this->otherCommunityAdmin, 0, []);
    }

    public function testProcessOperatorsViewExpected(): void
    {
        $this->assertPaginatedResponse($this->processOperator, 1, [
            $this->applicantPoolCandidate->id,
        ]);

        $this->assertPaginatedResponse($this->otherProcessOperator, 0, []);
    }

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
                    ->withSkillsAndExperiences()
                    ->asGovEmployee(),
                'pool_id' => Pool::factory()->create(['community_id' => Community::factory()->create()]),
            ]);

        $this->assertPaginatedResponse($this->communityAdmin, 0, []);
        $this->assertPaginatedResponse($this->otherCommunityAdmin, 0, []);
        $this->assertPaginatedResponse($this->processOperator, 0, []);
        $this->assertPaginatedResponse($this->otherProcessOperator, 0, []);
        $this->assertPaginatedResponse($this->communityRecruiter, 0, []);
        $this->assertPaginatedResponse($this->otherCommunityRecruiter, 0, []);
    }
}
