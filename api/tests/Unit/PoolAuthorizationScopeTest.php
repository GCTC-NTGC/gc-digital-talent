<?php

namespace Tests\Unit;

use App\Models\Community;
use App\Models\Pool;
use App\Models\Team;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
use Tests\TestCase;

use function PHPUnit\Framework\assertEqualsCanonicalizing;
use function PHPUnit\Framework\assertNotContains;

class PoolAuthorizationScopeTest extends TestCase
{
    use RefreshDatabase;

    protected $community1;

    protected $community2;

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

        $this->community1 = Community::factory()->create();
        $this->community2 = Community::factory()->create();

        $this->poolDraft1 = Pool::factory()->draft()->create(['community_id' => $this->community1->id]);
        $this->poolPublished1 = Pool::factory()->published()->create(['community_id' => $this->community1->id]);
        $this->poolClosed1 = Pool::factory()->closed()->create(['community_id' => $this->community1->id]);
        $this->poolArchived1 = Pool::factory()->archived()->create(['community_id' => $this->community1->id]);

        $this->poolDraft2 = Pool::factory()->draft()->create(['community_id' => $this->community2->id]);
        $this->poolPublished2 = Pool::factory()->published()->create(['community_id' => $this->community2->id]);
        $this->poolClosed2 = Pool::factory()->closed()->create(['community_id' => $this->community2->id]);
        $this->poolArchived2 = Pool::factory()->archived()->create(['community_id' => $this->community2->id]);
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

    // process operator can see all except the draft pools they are not teamed with thru authorizedToView
    public function testScopeAuthorizedToViewAsProcessOperator(): void
    {
        $community = Community::factory()->create();
        $this->poolDraft1->community_id = $community->id;
        $this->poolDraft1->save();
        $additionalCommunityPool = Pool::factory()->draft()->create([
            'community_id' => $community->id,
        ]);

        Auth::shouldReceive('user')
            ->andReturn(User::factory()
                ->asProcessOperator($this->poolDraft1->id)
                ->create());

        $poolIds = Pool::authorizedToView()->get()->pluck('id')->toArray();

        assertNotContains($additionalCommunityPool->id, $poolIds);

        assertEqualsCanonicalizing([
            $this->poolDraft1->id,
            $this->poolPublished1->id,
            $this->poolClosed1->id,
            $this->poolArchived1->id,
            $this->poolPublished2->id, // poolDraft2 not present here, nor is additionalCommunityPool
            $this->poolClosed2->id,
            $this->poolArchived2->id,
        ], $poolIds);
    }

    // community recruiter can see all except the draft pool they are not teamed with by pool->community thru authorizedToView
    public function testScopeAuthorizedToViewAsCommunityRecruiter(): void
    {
        $community = Community::factory()->create();
        $this->poolDraft1->community_id = $community->id;
        $this->poolDraft1->save();
        $additionalCommunityPool = Pool::factory()->draft()->create([
            'community_id' => $community->id,
        ]);

        Auth::shouldReceive('user')
            ->andReturn(User::factory()
                ->asCommunityRecruiter($community->id)
                ->create());

        $poolIds = Pool::authorizedToView()->get()->pluck('id')->toArray();

        assertEqualsCanonicalizing([
            $this->poolDraft1->id,
            $this->poolPublished1->id,
            $this->poolClosed1->id,
            $this->poolArchived1->id,
            $additionalCommunityPool->id,
            $this->poolPublished2->id, // poolDraft2 not present here
            $this->poolClosed2->id,
            $this->poolArchived2->id,
        ], $poolIds);
    }

    // community admin can see all except the draft pool they are not teamed with by pool->community thru authorizedToView
    public function testScopeAuthorizedToViewAsCommunityAdmin(): void
    {
        $community = Community::factory()->create();
        $this->poolDraft1->community_id = $community->id;
        $this->poolDraft1->save();
        $additionalCommunityPool = Pool::factory()->draft()->create([
            'community_id' => $community->id,
        ]);

        Auth::shouldReceive('user')
            ->andReturn(User::factory()
                ->asCommunityAdmin($community->id)
                ->create());

        $poolIds = Pool::authorizedToView()->get()->pluck('id')->toArray();

        assertEqualsCanonicalizing([
            $this->poolDraft1->id,
            $this->poolPublished1->id,
            $this->poolClosed1->id,
            $this->poolArchived1->id,
            $additionalCommunityPool->id,
            $this->poolPublished2->id, // poolDraft2 not present here
            $this->poolClosed2->id,
            $this->poolArchived2->id,
        ], $poolIds);
    }

    // process operator can only see their attached pool thru authorizedToAdmin
    public function testScopeAuthorizedToAdminAsProcessOperator(): void
    {
        Auth::shouldReceive('user')
            ->andReturn(User::factory()
                ->asProcessOperator($this->poolDraft1->id)
                ->create());

        $poolIds = Pool::authorizedToAdmin()->get()->pluck('id')->toArray();

        assertEqualsCanonicalizing([
            $this->poolDraft1->id,
        ], $poolIds);
    }

    // community recruiter can only see their attached pool via community thru authorizedToAdmin
    public function testScopeAuthorizedToAdminAsCommunityRecruiter(): void
    {
        $community = Community::factory()->create();
        $this->poolPublished1->community_id = $community->id;
        $this->poolPublished1->save();

        Auth::shouldReceive('user')
            ->andReturn(User::factory()
                ->asCommunityRecruiter($community->id)
                ->create());

        $poolIds = Pool::authorizedToAdmin()->get()->pluck('id')->toArray();

        assertEqualsCanonicalizing([
            $this->poolPublished1->id,
        ], $poolIds);
    }

    // community admin can only see their attached pool via community thru authorizedToAdmin
    public function testScopeAuthorizedToAdminAsCommunityAdmin(): void
    {
        $community = Community::factory()->create();
        $this->poolPublished1->community_id = $community->id;
        $this->poolPublished1->save();

        Auth::shouldReceive('user')
            ->andReturn(User::factory()
                ->asCommunityAdmin($community->id)
                ->create());

        $poolIds = Pool::authorizedToAdmin()->get()->pluck('id')->toArray();

        assertEqualsCanonicalizing([
            $this->poolPublished1->id,
        ], $poolIds);
    }
}
