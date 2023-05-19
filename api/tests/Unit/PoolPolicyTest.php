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
    protected $otherTeam;
    protected $teamPool;
    protected $unOwnedPool;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);

        $baseRoles = ["guest", "base_user", "applicant"];

        $this->guestUser = User::factory()
            ->withRoles(["guest"])
            ->create([
                'email' => 'guest-user@test.com',
                'sub' => 'guest-user@test.com',
            ]);

        $this->applicantUser = User::factory()
            ->withRoles($baseRoles)
            ->create([
                'email' => 'applicant-user@test.com',
                'sub' => 'applicant-user@test.com',
            ]);

        $this->team = Team::factory()->create(['name' => 'test-team']);
        $this->poolOperatorUser = User::factory()
            ->withRoles($baseRoles)
            ->withRoles(["pool_operator"], $this->team->name)
            ->create([
                'email' => 'pool-operator-user@test.com',
                'sub' => 'pool-operator-user@test.com',
            ]);

        $this->requestResponderUser = User::factory()
            ->withRoles([
                ...$baseRoles,
                "request_responder",
            ])
            ->create([
                'email' => 'request-responder-user@test.com',
                'sub' => 'request-responder-user@test.com',
            ]);

        $this->adminUser = User::factory()
            ->withRoles([
                ...$baseRoles,
                "platform_admin",
            ])
            ->create([
                'email' => 'platform-admin-user@test.com',
                'sub' => 'platform-admin-user@test.com',
            ]);

        $this->teamPool = Pool::factory()->create([
            'user_id' => $this->poolOperatorUser->id,
            'team_id' => $this->team->id,
        ]);

        $this->otherTeam = Team::factory()->create();

        $this->unOwnedPool = Pool::factory(['team_id' => $this->otherTeam->id])->create();
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
        $this->teamPool->published_at = null;
        $this->teamPool->save();
        $this->unOwnedPool->published_at = null;
        $this->unOwnedPool->save();

        $this->assertTrue($this->poolOperatorUser->can('view', $this->teamPool));
        $this->assertTrue($this->adminUser->can('view', $this->teamPool));

        $this->assertFalse($this->guestUser->can('view', $this->teamPool));
        $this->assertFalse($this->applicantUser->can('view', $this->teamPool));
        $this->assertFalse($this->requestResponderUser->can('view', $this->teamPool));
        // Pool operator cannot view other teams pools
        $this->assertFalse($this->poolOperatorUser->can('view', $this->unOwnedPool));

        // Note: We now allow everyone to view published pools
        $this->teamPool->published_at = config('constants.past_date');
        $this->teamPool->save();
        $this->unOwnedPool->published_at = config('constants.past_date');
        $this->unOwnedPool->save();

        $this->assertTrue($this->guestUser->can('view', $this->teamPool));
        $this->assertTrue($this->applicantUser->can('view', $this->teamPool));
        $this->assertTrue($this->poolOperatorUser->can('view', $this->teamPool));
        // Pool operator can view other teams pools if they are published
        $this->assertTrue($this->poolOperatorUser->can('view', $this->unOwnedPool));
        $this->assertTrue($this->requestResponderUser->can('view', $this->teamPool));
        $this->assertTrue($this->adminUser->can('view', $this->teamPool));
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
        $createPoolInput = [
            'team' => [
                'connect' => $this->team->id,
            ]
        ];
        $createAdvertisementInput = [
            'team_id' => $this->team->id,
        ];

        $this->assertTrue($this->poolOperatorUser->can('create', [Pool::class, $createPoolInput]));
        $this->assertTrue($this->poolOperatorUser->can('create', [Pool::class, $createAdvertisementInput]));

        $this->assertFalse($this->guestUser->can('create', [Pool::class, $createPoolInput]));
        $this->assertFalse($this->guestUser->can('create', [Pool::class, $createAdvertisementInput]));
        $this->assertFalse($this->applicantUser->can('create', [Pool::class, $createPoolInput]));
        $this->assertFalse($this->applicantUser->can('create', [Pool::class, $createAdvertisementInput]));
        $this->assertFalse($this->requestResponderUser->can('create', [Pool::class, $createPoolInput]));
        $this->assertFalse($this->requestResponderUser->can('create', [Pool::class, $createAdvertisementInput]));
        $this->assertFalse($this->adminUser->can('create', [Pool::class, $createPoolInput]));
        $this->assertFalse($this->adminUser->can('create', [Pool::class, $createAdvertisementInput]));

        // Pool operator cannot create pools for other teams
        $createOtherPoolInput = [
            'team' => [
                'connect' => $this->otherTeam->id,
            ]
        ];
        $createOtherAdvertisementInput = [
            'team_id' => $this->otherTeam->id,
        ];
        $this->assertFalse($this->poolOperatorUser->can('create', [Pool::class, $createOtherPoolInput]));
        $this->assertFalse($this->poolOperatorUser->can('create', [Pool::class, $createOtherAdvertisementInput]));
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

    /**
     * Assert that only pool operators can update a pools closing date
     *
     * @return void
     */
    public function testChangeClosingDate()
    {
        $this->assertTrue($this->poolOperatorUser->can('changePoolClosingDate', $this->teamPool));

        $this->assertFalse($this->guestUser->can('changePoolClosingDate', $this->teamPool));
        $this->assertFalse($this->applicantUser->can('changePoolClosingDate', $this->teamPool));
        $this->assertFalse($this->requestResponderUser->can('changePoolClosingDate', $this->teamPool));
        $this->assertFalse($this->adminUser->can('changePoolClosingDate', $this->teamPool));
        // Pool operator cannot update other teams pools closing dates
        $this->assertFalse($this->poolOperatorUser->can('changePoolClosingDate', $this->unOwnedPool));
    }

    /**
     * Assert that only pool operators can close a pool advertisement
     *
     * @return void
     */
    public function testCloseAdvertisement()
    {
        $this->assertTrue($this->poolOperatorUser->can('closePoolAdvertisement', $this->teamPool));

        $this->assertFalse($this->guestUser->can('closePoolAdvertisement', $this->teamPool));
        $this->assertFalse($this->applicantUser->can('closePoolAdvertisement', $this->teamPool));
        $this->assertFalse($this->requestResponderUser->can('closePoolAdvertisement', $this->teamPool));
        $this->assertFalse($this->adminUser->can('closePoolAdvertisement', $this->teamPool));
        // Pool operator cannot close other teams pool advertisements
        $this->assertFalse($this->poolOperatorUser->can('closePoolAdvertisement', $this->unOwnedPool));
    }

    /**
     * Assert that only pool operators can delete a draft pool
     *
     * @return void
     */
    public function testDeleteDraft()
    {
        $this->teamPool->published_at = null;
        $this->teamPool->save();

        $this->assertTrue($this->poolOperatorUser->can('deleteDraft', $this->teamPool));

        $this->assertFalse($this->guestUser->can('deleteDraft', $this->teamPool));
        $this->assertFalse($this->applicantUser->can('deleteDraft', $this->teamPool));
        $this->assertFalse($this->requestResponderUser->can('deleteDraft', $this->teamPool));
        $this->assertFalse($this->adminUser->can('deleteDraft', $this->teamPool));
        // Pool operator cannot close other teams pool advertisements
        $this->assertFalse($this->poolOperatorUser->can('deleteDraft', $this->unOwnedPool));
    }

    /**
     * Assert that no one can delete a published pool
     *
     * @return void
     */
    public function testDeletePublished()
    {
        $this->teamPool->published_at = config('constants.past_date');
        $this->teamPool->save();

        $this->assertFalse($this->guestUser->can('deleteDraft', $this->teamPool));
        $this->assertFalse($this->applicantUser->can('deleteDraft', $this->teamPool));
        $this->assertFalse($this->poolOperatorUser->can('deleteDraft', $this->teamPool));
        $this->assertFalse($this->requestResponderUser->can('deleteDraft', $this->teamPool));
        $this->assertFalse($this->adminUser->can('deleteDraft', $this->teamPool));
    }
}
