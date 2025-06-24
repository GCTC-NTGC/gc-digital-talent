<?php

namespace Tests\Feature;

use App\Enums\PoolCandidateStatus;
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

    public function testGuestCannotViewAnyApplications(): void
    {
        $guest = User::factory()->create();
        $this->assertPaginatedResponse($guest, 0, []);
    }

    public function testApplicantCanViewOnlyOwn(): void
    {
        $this->assertPaginatedResponse($this->applicant, 1, [
            $this->applicantPoolCandidate->id,
        ]);
    }
}
