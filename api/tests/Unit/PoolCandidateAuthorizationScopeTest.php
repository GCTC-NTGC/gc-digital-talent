<?php

namespace Tests\Unit;

use App\Enums\ApplicationStatus;
use App\Enums\ScreeningStage;
use App\Models\Community;
use App\Models\Pool;
use App\Models\PoolCandidate;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
use Tests\TestCase;

use function PHPUnit\Framework\assertEqualsCanonicalizing;

class PoolCandidateAuthorizationScopeTest extends TestCase
{
    use RefreshDatabase;

    protected $communityA;

    protected $communityB;

    protected $poolA;

    protected $poolB;

    protected $user1;

    protected $user2;

    protected $candidateDraft1A;

    protected $candidateSubmitted1B;

    protected $candidateDraft2B;

    protected $candidateSubmitted2A;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);

        $this->communityA = Community::factory()->create();
        $this->communityB = Community::factory()->create();

        $this->poolA = Pool::factory()
            ->published()
            ->create(['community_id' => $this->communityA->id]);
        $this->poolB = Pool::factory()
            ->published()
            ->create(['community_id' => $this->communityB->id]);

        $this->user1 = User::factory()
            ->asApplicant()
            ->create();

        $this->candidateDraft1A = PoolCandidate::factory()
            ->for($this->user1)
            ->for($this->poolA)
            ->create([
                'application_status' => ApplicationStatus::DRAFT->name,
            ]);

        $this->candidateSubmitted1B = PoolCandidate::factory()
            ->for($this->user1)
            ->for($this->poolB)
            ->create([
                'application_status' => ApplicationStatus::TO_ASSESS->name,
                'screening_stage' => ScreeningStage::UNDER_ASSESSMENT->name,
            ]);

        $this->user2 = User::factory()
            ->asApplicant()
            ->create();

        $this->candidateDraft2B = PoolCandidate::factory()
            ->for($this->user2)
            ->for($this->poolB)
            ->create([
                'application_status' => ApplicationStatus::DRAFT->name,
            ]);

        $this->candidateSubmitted2A = PoolCandidate::factory()
            ->for($this->user2)
            ->for($this->poolA)
            ->create([
                'application_status' => ApplicationStatus::TO_ASSESS->name,
                'screening_stage' => ScreeningStage::NEW_APPLICATION->name,
            ]);
    }

    // a guest should be able to view no candidates
    public function testViewAsGuest(): void
    {
        Auth::shouldReceive('user')
            ->andReturn(null);

        $candidateIds = PoolCandidate::whereAuthorizedToView()->get()->pluck('id');
        assertEqualsCanonicalizing([], $candidateIds->toArray());
    }

    // an applicant should be able to view their own candidates
    public function testViewAsApplicant(): void
    {
        Auth::shouldReceive('user')
            ->andReturn($this->user1);

        // just the draft and submitted candidates for user 1
        $candidateIds = PoolCandidate::whereAuthorizedToView()->get()->pluck('id');
        assertEqualsCanonicalizing([
            $this->candidateDraft1A->id,
            $this->candidateSubmitted1B->id,
        ], $candidateIds->toArray());
    }

    // a platform admin should be able to view submitted candidates in any team
    public function testViewAsPlatformAdmin(): void
    {
        Auth::shouldReceive('user')
            ->andReturn(
                User::factory()
                    ->asAdmin()
                    ->create()
            );

        // there is one submitted candidate in each team's pool
        $candidateIds = PoolCandidate::whereAuthorizedToView()->get()->pluck('id');
        assertEqualsCanonicalizing([
            $this->candidateSubmitted1B->id,
            $this->candidateSubmitted2A->id,
        ], $candidateIds->toArray());
    }

    // process operator can only see the submitted candidate attached to their pool thru authorizedToView
    public function testScopeAuthorizedToViewAsProcessOperator(): void
    {
        Auth::shouldReceive('user')
            ->andReturn(User::factory()
                ->asProcessOperator($this->poolA->id)
                ->create());

        $poolCandidateIds = PoolCandidate::whereAuthorizedToView()->get()->pluck('id')->toArray();

        assertEqualsCanonicalizing([
            $this->candidateSubmitted2A->id,
        ], $poolCandidateIds);
    }

    // community recruiter only sees submitted candidate attached to poolB as it is in turn attached to the community thru authorizedToView
    public function testScopeAuthorizedToViewAsCommunityRecruiter(): void
    {
        $community = Community::factory()->create();
        $this->poolB->community_id = $community->id;
        $this->poolB->save();

        Auth::shouldReceive('user')
            ->andReturn(User::factory()
                ->asCommunityRecruiter($community->id)
                ->create());

        $poolCandidateIds = PoolCandidate::whereAuthorizedToView()->get()->pluck('id')->toArray();

        assertEqualsCanonicalizing([
            $this->candidateSubmitted1B->id,
        ], $poolCandidateIds);
    }

    // community admin only sees submitted candidate attached to poolA as it is in turn attached to the community thru authorizedToView
    public function testScopeAuthorizedToViewAsCommunityAdmin(): void
    {
        $community = Community::factory()->create();
        $this->poolA->community_id = $community->id;
        $this->poolA->save();

        Auth::shouldReceive('user')
            ->andReturn(User::factory()
                ->asCommunityAdmin($community->id)
                ->create());

        $poolCandidateIds = PoolCandidate::whereAuthorizedToView()->get()->pluck('id')->toArray();

        assertEqualsCanonicalizing([
            $this->candidateSubmitted2A->id,
        ], $poolCandidateIds);
    }
}
