<?php

namespace Tests\Feature;

use App\Enums\ApplicationStatus;
use App\Models\Community;
use App\Models\Pool;
use App\Models\PoolCandidate;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Tests\TestCase;
use Tests\UsesProtectedGraphqlEndpoint;

use function PHPUnit\Framework\assertSame;

class PoolCandidatesPaginatedTest extends TestCase
{
    use MakesGraphQLRequests;
    use RefreshDatabase;
    use RefreshesSchemaCache;
    use UsesProtectedGraphqlEndpoint;

    public Pool $pool;

    public Community $community;

    public User $applicant;

    public PoolCandidate $noTeamCandidate;

    public PoolCandidate $teamCandidate;

    public PoolCandidate $applicantCandidate;

    public string $query =
        /** GraphQL */
        '
        query PoolCandidates {
            poolCandidatesPaginated(first: 100) {
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

        $this->community = Community::factory()->create();

        $this->pool = Pool::factory()->create([
            'community_id' => $this->community->id,
        ]);

        // A Draft candidate that no one should be able to see
        PoolCandidate::factory()->create([
            'application_status' => ApplicationStatus::DRAFT->name,
        ]);

        // Random team candidate
        $this->noTeamCandidate = PoolCandidate::factory()->create([
            'application_status' => ApplicationStatus::TO_ASSESS->name,
            'pool_id' => Pool::factory()->create([
                'community_id' => Community::factory()->create(),
            ]),
        ]);

        // Assigned Team
        $this->teamCandidate = PoolCandidate::factory()->create([
            'application_status' => ApplicationStatus::TO_ASSESS->name,
            'pool_id' => $this->pool->id,
        ]);

        $this->applicant = User::factory()->asApplicant()->create();

        $this->applicantCandidate = PoolCandidate::factory()->create([
            'application_status' => ApplicationStatus::DRAFT->name,
            'user_id' => $this->applicant->id,
            'pool_id' => $this->pool->id,
        ]);
    }

    protected function assertPaginatedResponse(User $user, int $count, array $ids): void
    {
        $res = $this->actingAs($user, 'api')
            ->graphQL($this->query);

        $res->assertJsonFragment([
            'paginatorInfo' => [
                'total' => $count,
            ],
        ]);

        foreach ($ids as $id) {
            $res->assertJsonFragment(['id' => $id]);
        }
    }

    public function testGuestCannotViewAnyApplications(): void
    {
        $guest = User::factory()->create();
        $this->assertPaginatedResponse($guest, 0, []);
    }

    // Drafts are not visible
    public function testApplicantCannotViewAny(): void
    {
        $this->assertPaginatedResponse($this->applicant, 0, []);
    }

    public function testProcessOperatorCanViewPoolApplications(): void
    {
        $processOperator = User::factory()
            ->asProcessOperator($this->pool->id)
            ->create();
        $this->assertPaginatedResponse($processOperator, 1, [
            $this->teamCandidate->id,
        ]);
    }

    public function testUnassociatedProcessOperatorCannotViewAnyApplications(): void
    {
        $pool = Pool::factory()->create();
        $processOperator = User::factory()
            ->asProcessOperator($pool->id)
            ->create();
        $this->assertPaginatedResponse($processOperator, 0, []);
    }

    public function testCommunityRecruiterCanViewCommunitySubmittedApplications(): void
    {
        $community = Community::factory()->create();
        $otherCommunity = Community::factory()->create();
        $communityPool = Pool::factory()->create([
            'community_id' => $community->id,
        ]);
        $otherPool = Pool::factory()->create([
            'community_id' => $otherCommunity->id,
        ]);
        $communityRecruiter = User::factory()
            ->asCommunityRecruiter($community->id)
            ->create();

        PoolCandidate::truncate();
        $communityCandidate = PoolCandidate::factory()->availableInSearch()->create(['pool_id' => $communityPool]);
        $communityDraftCandidate = PoolCandidate::factory()->create([
            'pool_id' => $communityPool,
            'application_status' => ApplicationStatus::DRAFT->name,
            'submitted_at' => null,
        ]);
        $otherCandidate = PoolCandidate::factory()->availableInSearch()->create([
            'pool_id' => $otherPool]);
        $otherDraftCandidate = PoolCandidate::factory()->availableInSearch()->create([
            'pool_id' => $otherPool,
            'application_status' => ApplicationStatus::DRAFT->name,
            'submitted_at' => null,
        ]);

        assertSame(4, count(PoolCandidate::all()));
        assertSame(2, count(PoolCandidate::where('pool_id', $communityPool->id)->get()));

        // can only view the submitted candidate in own community
        $this->assertPaginatedResponse($communityRecruiter, 1, [$communityCandidate->id]);
    }

    public function testCommunityAdminCanViewCommunitySubmittedApplications(): void
    {
        $community = Community::factory()->create();
        $otherCommunity = Community::factory()->create();
        $communityPool = Pool::factory()->create([
            'community_id' => $community->id,
        ]);
        $otherPool = Pool::factory()->create([
            'community_id' => $otherCommunity->id,
        ]);
        $communityAdmin = User::factory()
            ->asCommunityAdmin($community->id)
            ->create();

        PoolCandidate::truncate();
        $communityCandidate = PoolCandidate::factory()->availableInSearch()->create(['pool_id' => $communityPool]);
        $communityDraftCandidate = PoolCandidate::factory()->create([
            'pool_id' => $communityPool,
            'application_status' => ApplicationStatus::DRAFT->name,
            'submitted_at' => null,
        ]);
        $otherCandidate = PoolCandidate::factory()->availableInSearch()->create([
            'pool_id' => $otherPool]);
        $otherDraftCandidate = PoolCandidate::factory()->availableInSearch()->create([
            'pool_id' => $otherPool,
            'application_status' => ApplicationStatus::DRAFT->name,
            'submitted_at' => null,
        ]);

        assertSame(4, count(PoolCandidate::all()));
        assertSame(2, count(PoolCandidate::where('pool_id', $communityPool->id)->get()));

        // can only view the submitted candidate in own community
        $this->assertPaginatedResponse($communityAdmin, 1, [$communityCandidate->id]);
    }

    public function testPlatformAdminCanViewAllSubmittedApplications(): void
    {
        $platformAdmin = User::factory()
            ->asAdmin()
            ->create();
        $this->assertPaginatedResponse($platformAdmin, 2, [
            $this->noTeamCandidate->id,
            $this->teamCandidate->id,
        ]);
    }
}
