<?php

namespace Tests\Feature;

use App\Models\Pool;
use App\Models\Team;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
use Tests\TestCase;
use Tests\UsesProtectedRequestContext;

use function PHPUnit\Framework\assertEqualsCanonicalizing;

class PoolAuthorizationScopeTest extends TestCase
{
    use RefreshDatabase;
    use UsesProtectedRequestContext;

    protected $team1;

    protected $team2;

    protected $poolDraft1;

    protected $poolPublished1;

    protected $poolClosed1;

    protected $poolArchived1;

    protected $poolDraft2;

    protected $poolPublished2;

    protected $poolClosed2;

    protected $poolArchived2;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);

        $this->team1 = Team::factory()->create(['name' => 'team1']);
        $this->team2 = Team::factory()->create(['name' => 'team2']);

        $this->poolDraft1 = Pool::factory()->draft()->create(['team_id' => $this->team1->id]);
        $this->poolPublished1 = Pool::factory()->published()->create(['team_id' => $this->team1->id]);
        $this->poolClosed1 = Pool::factory()->closed()->create(['team_id' => $this->team1->id]);
        $this->poolArchived1 = Pool::factory()->archived()->create(['team_id' => $this->team1->id]);

        $this->poolDraft2 = Pool::factory()->draft()->create(['team_id' => $this->team2->id]);
        $this->poolPublished2 = Pool::factory()->published()->create(['team_id' => $this->team2->id]);
        $this->poolClosed2 = Pool::factory()->closed()->create(['team_id' => $this->team2->id]);
        $this->poolArchived2 = Pool::factory()->archived()->create(['team_id' => $this->team2->id]);
    }

    // a guest should be able to admin no pools
    public function testAdminAsGuest(): void
    {
        Auth::shouldReceive('user')
            ->andReturn(null);

        $poolIds = Pool::authorizedToAdmin()->get()->pluck('id');
        assertEqualsCanonicalizing([], $poolIds->toArray());
    }

    // an applicant should be able to admin no pools
    public function testAdminAsApplicant(): void
    {
        Auth::shouldReceive('user')
            ->andReturn(User::factory()
                ->asApplicant()
                ->create());

        $poolIds = Pool::authorizedToAdmin()->get()->pluck('id');
        assertEqualsCanonicalizing([], $poolIds->toArray());
    }

    // a pool operator should be able to admin just their team's pools
    public function testAdminAsPoolOperator(): void
    {
        Auth::shouldReceive('user')
            ->andReturn(User::factory()
                ->asPoolOperator($this->team1->name)
                ->create());

        // just the four team1 pools, not team2
        $poolIds = Pool::authorizedToAdmin()->get()->pluck('id');
        assertEqualsCanonicalizing([
            $this->poolDraft1->id,
            $this->poolPublished1->id,
            $this->poolClosed1->id,
            $this->poolArchived1->id,
        ], $poolIds->toArray());
    }

    // a request responder should be able to admin all the pools
    public function testAdminAsRequestResponder(): void
    {
        Auth::shouldReceive('user')
            ->andReturn(User::factory()
                ->asRequestResponder()
                ->create());

        // four from team 1 and four from team 2
        $poolIds = Pool::authorizedToAdmin()->get()->pluck('id');
        assertEqualsCanonicalizing([
            $this->poolDraft1->id,
            $this->poolPublished1->id,
            $this->poolClosed1->id,
            $this->poolArchived1->id,
            $this->poolDraft2->id,
            $this->poolPublished2->id,
            $this->poolClosed2->id,
            $this->poolArchived2->id,
        ], $poolIds->toArray());
    }

    // a community manager should be able to admin all the pools
    public function testAdminAsCommunityManager(): void
    {
        Auth::shouldReceive('user')
            ->andReturn(User::factory()
                ->asCommunityManager()
                ->create());

        // four from team 1 and four from team 2
        $poolIds = Pool::authorizedToAdmin()->get()->pluck('id');
        assertEqualsCanonicalizing([
            $this->poolDraft1->id,
            $this->poolPublished1->id,
            $this->poolClosed1->id,
            $this->poolArchived1->id,
            $this->poolDraft2->id,
            $this->poolPublished2->id,
            $this->poolClosed2->id,
            $this->poolArchived2->id,
        ], $poolIds->toArray());
    }

    // a platform admin should be able to admin all the pools
    public function testAdminAsPlatformAdmin(): void
    {
        Auth::shouldReceive('user')
            ->andReturn(User::factory()
                ->asAdmin()
                ->create());

        // four from team 1 and four from team 2
        $poolIds = Pool::authorizedToAdmin()->get()->pluck('id');
        assertEqualsCanonicalizing([
            $this->poolDraft1->id,
            $this->poolPublished1->id,
            $this->poolClosed1->id,
            $this->poolArchived1->id,
            $this->poolDraft2->id,
            $this->poolPublished2->id,
            $this->poolClosed2->id,
            $this->poolArchived2->id,
        ], $poolIds->toArray());
    }

    // a guest should be able to view any published pool (like anyone can)
    public function testViewAsGuest(): void
    {
        Auth::shouldReceive('user')
            ->andReturn(null);

        // three published from both teams
        $poolIds = Pool::authorizedToView()->get()->pluck('id');
        assertEqualsCanonicalizing([
            $this->poolPublished1->id,
            $this->poolClosed1->id,
            $this->poolArchived1->id,
            $this->poolPublished2->id,
            $this->poolClosed2->id,
            $this->poolArchived2->id,
        ], $poolIds->toArray());
    }

    // an applicant should be able to view any published pool (like anyone can)
    public function testViewAsApplicant(): void
    {
        Auth::shouldReceive('user')
            ->andReturn(User::factory()
                ->asApplicant()
                ->create());

        // three published from both teams
        $poolIds = Pool::authorizedToView()->get()->pluck('id');
        assertEqualsCanonicalizing([
            $this->poolPublished1->id,
            $this->poolClosed1->id,
            $this->poolArchived1->id,
            $this->poolPublished2->id,
            $this->poolClosed2->id,
            $this->poolArchived2->id,
        ], $poolIds->toArray());
    }

    // an pool operator should be able to view team draft pools and any published pool
    public function testViewAsPoolOperator(): void
    {
        Auth::shouldReceive('user')
            ->andReturn(User::factory()
                ->asPoolOperator($this->team1->name)
                ->create());

        // draft pool from team 1 and three published pools from both teams
        $poolIds = Pool::authorizedToView()->get()->pluck('id');
        assertEqualsCanonicalizing([
            $this->poolDraft1->id,
            $this->poolPublished1->id,
            $this->poolClosed1->id,
            $this->poolArchived1->id,
            $this->poolPublished2->id,
            $this->poolClosed2->id,
            $this->poolArchived2->id,
        ], $poolIds->toArray());
    }

    // a request responder should be able to view any published pool (like anyone can)
    public function testViewAsRequestResponder(): void
    {
        Auth::shouldReceive('user')
            ->andReturn(User::factory()
                ->asRequestResponder()
                ->create());

        // three published from both teams
        $poolIds = Pool::authorizedToView()->get()->pluck('id');
        assertEqualsCanonicalizing([
            $this->poolPublished1->id,
            $this->poolClosed1->id,
            $this->poolArchived1->id,
            $this->poolPublished2->id,
            $this->poolClosed2->id,
            $this->poolArchived2->id,
        ], $poolIds->toArray());
    }

    // a community manager should be able to view all the pools
    public function testViewAsCommunityManager(): void
    {
        Auth::shouldReceive('user')
            ->andReturn(User::factory()
                ->asCommunityManager()
                ->create());

        // four from team 1 and four from team 2
        $poolIds = Pool::authorizedToView()->get()->pluck('id');
        assertEqualsCanonicalizing([
            $this->poolDraft1->id,
            $this->poolPublished1->id,
            $this->poolClosed1->id,
            $this->poolArchived1->id,
            $this->poolDraft2->id,
            $this->poolPublished2->id,
            $this->poolClosed2->id,
            $this->poolArchived2->id,
        ], $poolIds->toArray());
    }

    // a platform admin should be able to view all the pools
    public function testViewAsPlatformAdmin(): void
    {
        Auth::shouldReceive('user')
            ->andReturn(User::factory()
                ->asAdmin()
                ->create());

        // four from team 1 and four from team 2
        $poolIds = Pool::authorizedToView()->get()->pluck('id');
        assertEqualsCanonicalizing([
            $this->poolDraft1->id,
            $this->poolPublished1->id,
            $this->poolClosed1->id,
            $this->poolArchived1->id,
            $this->poolDraft2->id,
            $this->poolPublished2->id,
            $this->poolClosed2->id,
            $this->poolArchived2->id,
        ], $poolIds->toArray());
    }
}
