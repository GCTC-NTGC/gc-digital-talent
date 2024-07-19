<?php

namespace Tests\Feature;

use App\Enums\PoolCandidateStatus;
use App\Models\Community;
use App\Models\Pool;
use App\Models\PoolCandidate;
use App\Models\Team;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Tests\TestCase;
use Tests\UsesProtectedGraphqlEndpoint;

class PoolCandidatesPaginatedTest extends TestCase
{
    use MakesGraphQLRequests;
    use RefreshDatabase;
    use RefreshesSchemaCache;
    use UsesProtectedGraphqlEndpoint;

    public Pool $pool;

    public Team $team;

    public User $applicant;

    public PoolCandidate $noTeamCandidate;

    public PoolCandidate $teamCandidate;

    public PoolCandidate $applicantCandidate;

    public string $query = /** GraphQL */ '
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

    public function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);

        $this->team = Team::factory()->create([
            'name' => 'candidates-paginated',
        ]);

        $this->pool = Pool::factory()->create([
            'team_id' => $this->team->id,
        ]);

        // A Draft candidate that no one should be able to see
        PoolCandidate::factory()->create([
            'pool_candidate_status' => PoolCandidateStatus::DRAFT->name,
        ]);

        // Random team candidate
        $this->noTeamCandidate = PoolCandidate::factory()->create([
            'pool_candidate_status' => PoolCandidateStatus::NEW_APPLICATION->name,
            'pool_id' => Pool::factory()->create([
                'team_id' => Team::factory()->create(),
            ]),
        ]);

        // Assigned Team
        $this->teamCandidate = PoolCandidate::factory()->create([
            'pool_candidate_status' => PoolCandidateStatus::NEW_APPLICATION->name,
            'pool_id' => $this->pool->id,
        ]);

        $this->applicant = User::factory()->asApplicant()->create();

        $this->applicantCandidate = PoolCandidate::factory()->create([
            'pool_candidate_status' => PoolCandidateStatus::DRAFT->name,
            'user_id' => $this->applicant->id,
            'pool_id' => $this->pool->id,
        ]);

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

    public function testPoolOperatorCanViewTeamApplications(): void
    {
        $poolOperator = User::factory()
            ->asPoolOperator($this->team->name)
            ->create();
        $this->assertPaginatedResponse($poolOperator, 1, [
            $this->teamCandidate->id,
        ]);
    }

    public function testRequestResponserCanViewAllSubmittedApplications(): void
    {
        $requestResponder = User::factory()
            ->asRequestResponder()
            ->create();
        $this->assertPaginatedResponse($requestResponder, 2, [
            $this->noTeamCandidate->id,
            $this->teamCandidate->id,
        ]);
    }

    public function testCommunityManagerCannotViewAnyApplications(): void
    {
        $communityManager = User::factory()
            ->asCommunityManager()
            ->create();
        $this->assertPaginatedResponse($communityManager, 0, []);
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

    // TO DO: Update in #10364
    public function testCommunityRecruiterCannotViewAnyApplications(): void
    {
        $community = Community::factory()->create();
        $processOperator = User::factory()
            ->asCommunityRecruiter($community->id)
            ->create();
        $this->assertPaginatedResponse($processOperator, 0, []);
    }

    // TO DO: Update in #10364
    public function testCommunityAdminCannotViewAnyApplications(): void
    {
        $community = Community::factory()->create();
        $communityAdmin = User::factory()
            ->asCommunityAdmin($community->id)
            ->create();
        $this->assertPaginatedResponse($communityAdmin, 0, []);
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
}
