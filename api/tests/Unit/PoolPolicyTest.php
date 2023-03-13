<?php

namespace Tests\Unit;

use App\Models\Pool;
use App\Models\Team;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class PoolPolicyTest extends TestCase
{
    use RefreshDatabase;
    use WithFaker;

    protected $guestUser;
    protected $applicantUser;
    protected $poolOperatorUser;
    protected $requestResponderUser;
    protected $adminUser;
    protected $team;
    protected $teamPool;
    protected $unOwnedPool;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);

        $baseRoles = ["guest", "base_user", "applicant"];

        $this->guestUser = User::factory()->create([
            'email' => 'guest-user@test.com',
            'sub' => 'guest-user@test.com',
        ]);
        $this->guestUser->syncRoles(["guest"]);

        $this->applicantUser = User::factory()->create([
            'email' => 'applicant-user@test.com',
            'sub' => 'applicant-user@test.com',
        ]);
        $this->applicantUser->syncRoles($baseRoles);

        $this->poolOperatorUser = User::factory()->create([
            'email' => 'pool-operator-user@test.com',
            'sub' => 'pool-operator-user@test.com',
        ]);
        $this->team = Team::factory()->create(['name' => 'test-team']);
        $this->poolOperatorUser->syncRoles($baseRoles);
        $this->poolOperatorUser->attachRole("pool_operator", $this->team);

        $this->requestResponderUser = User::factory()->create([
            'email' => 'request-responder-user@test.com',
            'sub' => 'request-responder-user@test.com',
        ]);
        $this->requestResponderUser->syncRoles($baseRoles);
        $this->requestResponderUser->attachRole("request_responder");

        $this->adminUser = User::factory()->create([
            'email' => 'platform-admin-user@test.com',
            'sub' => 'platform-admin-user@test.com',
        ]);
        $this->adminUser->syncRoles($baseRoles);
        $this->adminUser->attachRole("platform_admin");

        $this->teamPool = Pool::factory()->create([
            'user_id' => $this->poolOperatorUser->id,
            'team_id' => $this->team->id,
        ]);

        $noUsersTeam = Team::factory()->create();

        $this->unOwnedPool = Pool::factory(['team_id' => $noUsersTeam->id])->create();
    }


    /**
     * Assert that only platform admins may view any pool
     *
     * @return void
     */
    public function testViewAny()
    {
        $this->assertTrue($this->adminUser->can('viewAny', Pool::class));

        $this->assertFalse($this->guestUser->can('viewAny', Pool::class));
        $this->assertFalse($this->applicantUser->can('viewAny', Pool::class));
        $this->assertFalse($this->poolOperatorUser->can('viewAny', Pool::class));
        $this->assertFalse($this->requestResponderUser->can('viewAny', Pool::class));
    }

    /**
     * Assert that anyone can view any published pool advertisements
     *
     * @return void
     */
    public function testViewAnyPublishedAdvertisements()
    {
        $this->assertTrue($this->guestUser->can('viewAnyPublishedAdvertisement', Pool::class));
        $this->assertTrue($this->applicantUser->can('viewAnyPublishedAdvertisement', Pool::class));
        $this->assertTrue($this->poolOperatorUser->can('viewAnyPublishedAdvertisement', Pool::class));
        $this->assertTrue($this->requestResponderUser->can('viewAnyPublishedAdvertisement', Pool::class));
        $this->assertTrue($this->adminUser->can('viewAnyPublishedAdvertisement', Pool::class));
    }

    /**
     * Assert that the following can view a pool:
     *
     * pool operator, platform admin
     *
     * @return void
     */
    public function testView()
    {
        $this->assertTrue($this->poolOperatorUser->can('view', $this->teamPool));
        $this->assertTrue($this->adminUser->can('view', $this->teamPool));

        $this->assertFalse($this->guestUser->can('view', $this->teamPool));
        $this->assertFalse($this->applicantUser->can('view', $this->teamPool));
        $this->assertFalse($this->requestResponderUser->can('view', $this->teamPool));
        // Pool operator cannot view other teams pools
        $this->assertFalse($this->poolOperatorUser->can('view', $this->unOwnedPool));
    }

    /**
     * Assert that the following can view a draft pool advertisement:
     *
     * pool operator, platform admin
     *
     * @return void
     */
    public function testViewDraftAdvertisement()
    {
        $this->teamPool->published_at = null;
        $this->teamPool->save();

        $this->assertTrue($this->poolOperatorUser->can('viewAdvertisement', $this->teamPool));
        $this->assertTrue($this->adminUser->can('viewAdvertisement', $this->teamPool));

        $this->assertFalse($this->guestUser->can('viewAdvertisement', $this->teamPool));
        $this->assertFalse($this->applicantUser->can('viewAdvertisement', $this->teamPool));
        $this->assertFalse($this->requestResponderUser->can('viewAdvertisement', $this->teamPool));

        // Pool operator cannot view other teams draft pools
        $this->unOwnedPool->published_at = null;
        $this->unOwnedPool->save();

        $this->assertFalse($this->poolOperatorUser->can('viewAdvertisement', $this->unOwnedPool));
    }

    /**
     * Assert that anyone can view a published pool advertisement:
     *
     * @return void
     */
    public function testViewPublishedAdvertisement()
    {
        $this->teamPool->published_at = config('constants.past_date');
        $this->teamPool->save();

        $this->assertTrue($this->guestUser->can('viewAdvertisement', $this->teamPool));
        $this->assertTrue($this->applicantUser->can('viewAdvertisement', $this->teamPool));
        $this->assertTrue($this->poolOperatorUser->can('viewAdvertisement', $this->teamPool));
        $this->assertTrue($this->requestResponderUser->can('viewAdvertisement', $this->teamPool));
        $this->assertTrue($this->adminUser->can('viewAdvertisement', $this->teamPool));
    }

    /**
     * Assert that only pool operators can create pools
     *
     * @return void
     */
    public function testCreate()
    {
        $this->assertTrue($this->poolOperatorUser->can('create', Pool::class));

        $this->assertFalse($this->guestUser->can('create', Pool::class));
        $this->assertFalse($this->applicantUser->can('create', Pool::class));
        $this->assertFalse($this->requestResponderUser->can('create', Pool::class));
        $this->assertFalse($this->adminUser->can('create', Pool::class));
    }

    /**
     * Assert that only pool operators can update draft pools
     *
     * @return void
     */
    public function testUpdateDraft()
    {
        $this->teamPool->published_at = null;
        $this->teamPool->save();

        $this->assertTrue($this->poolOperatorUser->can('updateDraft', $this->teamPool));

        $this->assertFalse($this->guestUser->can('updateDraft', $this->teamPool));
        $this->assertFalse($this->applicantUser->can('updateDraft', $this->teamPool));
        $this->assertFalse($this->requestResponderUser->can('updateDraft', $this->teamPool));
        $this->assertFalse($this->adminUser->can('updateDraft', $this->teamPool));

        // Pool operator cannot update other teams draft pools
        $this->unOwnedPool->published_at = null;
        $this->unOwnedPool->save();

        $this->assertFalse($this->poolOperatorUser->can('updateDraft', $this->unOwnedPool));
    }

    /**
     * Assert that no one can update published pools
     *
     * @return void
     */
    public function testUpdatePublished()
    {
        $this->teamPool->published_at = config('constants.past_date');
        $this->teamPool->save();

        $this->assertFalse($this->guestUser->can('updateDraft', $this->teamPool));
        $this->assertFalse($this->applicantUser->can('updateDraft', $this->teamPool));
        $this->assertFalse($this->poolOperatorUser->can('updateDraft', $this->teamPool));
        $this->assertFalse($this->requestResponderUser->can('updateDraft', $this->teamPool));
        $this->assertFalse($this->adminUser->can('updateDraft', $this->teamPool));
    }

    /**
     * Assert that only platform admins can publish pools
     *
     * @return void
     */
    public function testPublish()
    {
        $this->teamPool->published_at = null;
        $this->teamPool->closing_date = config('constants.far_future_date');
        $this->teamPool->save();

        $this->assertTrue($this->adminUser->can('publish', $this->teamPool));

        $this->assertFalse($this->guestUser->can('publish', $this->teamPool));
        $this->assertFalse($this->applicantUser->can('publish', $this->teamPool));
        $this->assertFalse($this->poolOperatorUser->can('publish', $this->teamPool));
        $this->assertFalse($this->requestResponderUser->can('publish', $this->teamPool));
    }
}
