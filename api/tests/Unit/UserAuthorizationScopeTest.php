<?php

namespace Tests\Unit;

use App\Models\Community;
use App\Models\Pool;
use App\Models\PoolCandidate;
use App\Models\Team;
use App\Models\User;
use Carbon\Carbon;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
use Tests\TestCase;

use function PHPUnit\Framework\assertEqualsCanonicalizing;

class UserAuthorizationScopeTest extends TestCase
{
    use RefreshDatabase;

    protected $platformAdmin;

    protected $teamA;

    protected $teamB;

    protected $pool1;

    protected $pool2;

    protected $user1;

    protected $user2;

    protected $candidate1;

    protected $candidate2;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);

        $this->platformAdmin = User::factory()
            ->asAdmin()
            ->create();

        $this->teamA = Team::factory()->create();

        $this->teamB = Team::factory()->create();

        $this->pool1 = Pool::factory()
            ->for($this->platformAdmin)
            ->published()
            ->create([
                // legacy_team
                'team_id' => $this->teamA->id,
            ]);

        $this->pool2 = Pool::factory()
            ->for($this->platformAdmin)
            ->published()
            ->create([
                // legacy_team
                'team_id' => $this->teamB->id,
            ]);

        $this->user1 = User::factory()
            ->asApplicant()
            ->create();

        $this->user2 = User::factory()
            ->asApplicant()
            ->create();

        $this->candidate1 = PoolCandidate::factory()
            ->for($this->user1)
            ->for($this->pool1)
            ->create([
                'submitted_at' => Carbon::now(),
            ]);

        $this->candidate2 = PoolCandidate::factory()
            ->for($this->user2)
            ->for($this->pool2)
            ->create([
                'submitted_at' => Carbon::now(),
            ]);
    }

    // no tests for scopeAuthorizedToViewSpecific since it is never directly used by the graphql schema

    // a guest should be able to view no users
    public function testViewAsGuest(): void
    {
        Auth::shouldReceive('user')
            ->andReturn(null);

        $userIds = User::authorizedToView()->get()->pluck('id');
        assertEqualsCanonicalizing([], $userIds->toArray());
    }

    // an applicant should be able to view just themselves
    public function testViewAsApplicant(): void
    {
        Auth::shouldReceive('user')
            ->andReturn($this->user1);

        $userIds = User::authorizedToView()->get()->pluck('id');
        assertEqualsCanonicalizing([
            $this->user1->id,
        ], $userIds->toArray());
    }

    // the community manager role has no special privileges - can just see themselves
    public function testViewAsCommunityManager(): void
    {
        $communityManager = User::factory()
            ->asCommunityManager()
            ->create();
        Auth::shouldReceive('user')
            ->andReturn($communityManager);

        $userIds = User::authorizedToView()->get()->pluck('id');
        assertEqualsCanonicalizing([
            $communityManager->id,
        ], $userIds->toArray());
    }

    // a platform admin should be able to view any user
    public function testViewAsPlatformAdmin(): void
    {
        Auth::shouldReceive('user')
            ->andReturn($this->platformAdmin);

        $userIds = User::authorizedToView()->get()->pluck('id');
        assertEqualsCanonicalizing([
            $this->platformAdmin->id,
            $this->user1->id,
            $this->user2->id,
        ], $userIds->toArray());
    }

    // a guest should be able to view no users
    public function testViewBasicAsGuest(): void
    {
        Auth::shouldReceive('user')
            ->andReturn(null);

        $userIds = User::authorizedToViewBasicInfo()->get()->pluck('id');
        assertEqualsCanonicalizing([], $userIds->toArray());
    }

    // an applicant should be able to view just themselves
    public function testViewBasicAsApplicant(): void
    {
        Auth::shouldReceive('user')
            ->andReturn($this->user1);

        $userIds = User::authorizedToViewBasicInfo()->get()->pluck('id');
        assertEqualsCanonicalizing([
            $this->user1->id,
        ], $userIds->toArray());
    }

    // a community manager can see any basic info
    public function testViewBasicAsCommunityManager(): void
    {
        $communityManager = User::factory()
            ->asCommunityManager()
            ->create();
        Auth::shouldReceive('user')
            ->andReturn($communityManager);

        $userIds = User::authorizedToViewBasicInfo()->get()->pluck('id');
        assertEqualsCanonicalizing([
            $this->platformAdmin->id,
            $this->user1->id,
            $this->user2->id,
            $communityManager->id,
        ], $userIds->toArray());
    }

    // a platform admin should be able to view any user
    public function testViewBasicAsPlatformAdmin(): void
    {
        Auth::shouldReceive('user')
            ->andReturn($this->platformAdmin);

        $userIds = User::authorizedToViewBasicInfo()->get()->pluck('id');
        assertEqualsCanonicalizing([
            $this->platformAdmin->id,
            $this->user1->id,
            $this->user2->id,
        ], $userIds->toArray());
    }

    // process operator can only see the user that submitted an application to the pool they are an operator on
    // and their own self
    public function testScopeAuthorizedToViewAsProcessOperator(): void
    {
        $processOperator = User::factory()
            ->asProcessOperator($this->pool1->id)
            ->create();

        Auth::shouldReceive('user')
            ->andReturn($processOperator);

        $userIds = User::authorizedToView()->get()->pluck('id')->toArray();

        assertEqualsCanonicalizing([
            $processOperator->id,
            $this->user1->id,
        ], $userIds);
    }

    // community recruiter can only see the user that submitted an application to the pool that is connected to the community that they belong to
    // and their own self
    public function testScopeAuthorizedToViewAsCommunityRecruiter(): void
    {
        $community = Community::factory()->create();
        $this->pool2->community_id = $community->id;
        $this->pool2->save();

        $communityRecruiter = User::factory()
            ->asCommunityRecruiter($community->id)
            ->create();

        Auth::shouldReceive('user')
            ->andReturn($communityRecruiter);

        $userIds = User::authorizedToView()->get()->pluck('id')->toArray();

        assertEqualsCanonicalizing([
            $communityRecruiter->id,
            $this->user2->id,
        ], $userIds);
    }

    // community admin can only see the user that submitted an application to the pool that is connected to the community that they belong to
    // and their own self
    public function testScopeAuthorizedToViewAsCommunityAdmin(): void
    {
        $community = Community::factory()->create();
        $this->pool2->community_id = $community->id;
        $this->pool2->save();

        $communityAdmin = User::factory()
            ->asCommunityAdmin($community->id)
            ->create();

        Auth::shouldReceive('user')
            ->andReturn($communityAdmin);

        $userIds = User::authorizedToView()->get()->pluck('id')->toArray();

        assertEqualsCanonicalizing([
            $communityAdmin->id,
            $this->user2->id,
        ], $userIds);
    }
}
