<?php

namespace Tests\Unit;

use App\Models\Pool;
use App\Models\PoolCandidate;
use App\Models\Team;
use App\Models\User;
use Carbon\Carbon;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
use Tests\TestCase;
use Tests\UsesProtectedRequestContext;

use function PHPUnit\Framework\assertEqualsCanonicalizing;

class UserAuthorizationScopeTest extends TestCase
{
    use RefreshDatabase;
    use UsesProtectedRequestContext;

    protected $platformAdmin;

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

        $this->pool1 = Pool::factory()
            ->for($this->platformAdmin)
            ->published()
            ->afterCreating(function (Pool $p) {
                // normally this happens only when the process operator is added - might want to reconsider that logic
                $p->team()->create(['name' => 'pool-'.$p->id]);
            })
            ->create();

        $this->pool2 = Pool::factory()
            ->for($this->platformAdmin)
            ->published()
            ->afterCreating(function (Pool $p) {
                $p->team()->create(['name' => 'pool-'.$p->id]);
            })
            ->create();

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

    // an pool operator should be able to view themselves and any users with submitted candidates in their pools
    public function testViewAsPoolOperator(): void
    {
        $poolOperator = User::factory()
            ->asPoolOperator($this->pool1->team->name)
            ->create();
        Auth::shouldReceive('user')
            ->andReturn($poolOperator);

        // can also see the user with an application submitted to team 1's pool
        $userIds = User::authorizedToView()->get()->pluck('id');
        assertEqualsCanonicalizing([
            $poolOperator->id,
            $this->user1->id,
        ], $userIds->toArray());
    }

    // a request responder should be able to view any user
    public function testViewAsRequestResponder(): void
    {
        $requestResponder = User::factory()
            ->asRequestResponder()
            ->create();
        Auth::shouldReceive('user')
            ->andReturn($requestResponder);

        $userIds = User::authorizedToView()->get()->pluck('id');
        assertEqualsCanonicalizing([
            $this->platformAdmin->id,
            $this->user1->id,
            $this->user2->id,
            $requestResponder->id,
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

    // an pool operator should be able to view themselves and any users with submitted candidates in their pools
    public function testViewBasicAsPoolOperator(): void
    {
        $poolOperator = User::factory()
            ->asPoolOperator($this->pool1->team->name)
            ->create();
        Auth::shouldReceive('user')
            ->andReturn($poolOperator);

        // can also see the user with an application submitted to team 1's pool
        $userIds = User::authorizedToViewBasicInfo()->get()->pluck('id');
        assertEqualsCanonicalizing([
            $poolOperator->id,
            $this->user1->id,
        ], $userIds->toArray());
    }

    // a request responder should be able to view any user
    public function testViewBasicAsRequestResponder(): void
    {
        $requestResponder = User::factory()
            ->asRequestResponder()
            ->create();
        Auth::shouldReceive('user')
            ->andReturn($requestResponder);

        $userIds = User::authorizedToViewBasicInfo()->get()->pluck('id');
        assertEqualsCanonicalizing([
            $this->platformAdmin->id,
            $this->user1->id,
            $this->user2->id,
            $requestResponder->id,
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

    // TODO: add tests for new roles as part of #10609
}
