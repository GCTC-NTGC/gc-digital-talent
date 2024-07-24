<?php

namespace Tests\Unit;

use App\Models\Community;
use App\Models\Pool;
use App\Models\Team;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use Tests\UsesProtectedRequestContext;

class PoolPolicyTest extends TestCase
{
    use RefreshDatabase;
    use UsesProtectedRequestContext;
    use WithFaker;

    protected $guestUser;

    protected $applicantUser;

    protected $poolOperatorUser;

    protected $processOperatorUser;

    protected $requestResponderUser;

    protected $communityRecruiterUser;

    protected $communityManagerUser;

    protected $communityAdminUser;

    protected $adminUser;

    protected $team;

    protected $otherTeam;

    protected $community;

    protected $otherCommunity;

    protected $teamPool;

    protected $unOwnedPool;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);

        $this->guestUser = User::factory()
            ->asGuest()
            ->create([
                'email' => 'guest-user@test.com',
                'sub' => 'guest-user@test.com',
            ]);

        $this->applicantUser = User::factory()
            ->asApplicant()
            ->create([
                'email' => 'applicant-user@test.com',
                'sub' => 'applicant-user@test.com',
            ]);

        $this->team = Team::factory()->create(['name' => 'test-team']);
        $this->community = Community::factory()->create(['name' => 'test-team']);
        $this->otherCommunity = Community::factory()->create(['name' => 'suspicious-team']);

        $this->poolOperatorUser = User::factory()
            ->asApplicant()
            ->asPoolOperator($this->team->name)
            ->create([
                'email' => 'pool-operator-user@test.com',
                'sub' => 'pool-operator-user@test.com',
            ]);

        $this->requestResponderUser = User::factory()
            ->asApplicant()
            ->asRequestResponder()
            ->create([
                'email' => 'request-responder-user@test.com',
                'sub' => 'request-responder-user@test.com',
            ]);

        $this->communityManagerUser = User::factory()
            ->asApplicant()
            ->asCommunityManager()
            ->create([
                'email' => 'community-manager-user@test.com',
                'sub' => 'community-manager-user@test.com',
            ]);

        $this->adminUser = User::factory()
            ->asApplicant()
            ->asAdmin()
            ->create([
                'email' => 'platform-admin-user@test.com',
                'sub' => 'platform-admin-user@test.com',
            ]);

        $this->teamPool = Pool::factory()->create([
            'user_id' => $this->poolOperatorUser->id,
            'team_id' => $this->team->id,
        ]);

        $this->processOperatorUser = User::factory()
            ->asApplicant()
            ->asProcessOperator($this->teamPool->id)
            ->create([
                'email' => 'process-operator-user@test.com',
            ]);

        $this->communityRecruiterUser = User::factory()
            ->asApplicant()
            ->asCommunityRecruiter($this->community->id)
            ->create([
                'email' => 'community-recruiter-user@test.com',
            ]);

        $this->communityAdminUser = User::factory()
            ->asApplicant()
            ->asCommunityAdmin($this->community->id)
            ->create([
                'email' => 'community-admin-user@test.com',
            ]);

        $this->otherTeam = Team::factory()->create();

        $this->unOwnedPool = Pool::factory(['team_id' => $this->otherTeam->id])->create();
    }

    /**
     * Assert that only platform admins and community managers may view any pool
     *
     * @return void
     */
    public function testViewAny()
    {
        $this->assertTrue($this->adminUser->can('viewAny', Pool::class));
        $this->assertTrue($this->communityManagerUser->can('viewAny', Pool::class));

        $this->assertFalse($this->guestUser->can('viewAny', Pool::class));
        $this->assertFalse($this->applicantUser->can('viewAny', Pool::class));
        $this->assertFalse($this->poolOperatorUser->can('viewAny', Pool::class));
        $this->assertFalse($this->requestResponderUser->can('viewAny', Pool::class));
    }

    /**
     * Assert that anyone can view any published pools
     *
     * @return void
     */
    public function testViewAnyPublishedPools()
    {
        $this->assertTrue($this->guestUser->can('viewAnyPublished', Pool::class));
        $this->assertTrue($this->applicantUser->can('viewAnyPublished', Pool::class));
        $this->assertTrue($this->poolOperatorUser->can('viewAnyPublished', Pool::class));
        $this->assertTrue($this->requestResponderUser->can('viewAnyPublished', Pool::class));
        $this->assertTrue($this->communityManagerUser->can('viewAnyPublished', Pool::class));
        $this->assertTrue($this->adminUser->can('viewAnyPublished', Pool::class));
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
        $this->assertTrue($this->communityManagerUser->can('view', $this->teamPool));
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
        $this->assertTrue($this->communityManagerUser->can('view', $this->teamPool));
        $this->assertTrue($this->adminUser->can('view', $this->teamPool));
    }

    /**
     * Assert that the following can view a draft pool:
     *
     * pool operator, platform admin
     *
     * @return void
     */
    public function testViewDraftPool()
    {
        $this->teamPool->published_at = null;
        $this->teamPool->save();

        $this->assertTrue($this->poolOperatorUser->can('view', $this->teamPool));
        $this->assertTrue($this->communityManagerUser->can('view', $this->teamPool));
        $this->assertTrue($this->adminUser->can('view', $this->teamPool));

        $this->assertFalse($this->guestUser->can('view', $this->teamPool));
        $this->assertFalse($this->applicantUser->can('view', $this->teamPool));
        $this->assertFalse($this->requestResponderUser->can('view', $this->teamPool));

        // Pool operator cannot view other teams draft pools
        $this->unOwnedPool->published_at = null;
        $this->unOwnedPool->save();

        $this->assertFalse($this->poolOperatorUser->can('view', $this->unOwnedPool));
    }

    /**
     * Assert that anyone can view a published pool:
     *
     * @return void
     */
    public function testViewPublishedPool()
    {
        $this->teamPool->published_at = config('constants.past_date');
        $this->teamPool->save();

        $this->assertTrue($this->guestUser->can('view', $this->teamPool));
        $this->assertTrue($this->applicantUser->can('view', $this->teamPool));
        $this->assertTrue($this->poolOperatorUser->can('view', $this->teamPool));
        $this->assertTrue($this->requestResponderUser->can('view', $this->teamPool));
        $this->assertTrue($this->communityManagerUser->can('view', $this->teamPool));
        $this->assertTrue($this->adminUser->can('view', $this->teamPool));
    }

    /**
     * Assert that only pool operators can create pools
     *
     * @return void
     */
    public function testCreate()
    {
        $createPoolInput = [
            'team_id' => $this->team->id,
            'community_id' => $this->community->id,
        ];

        $this->assertTrue($this->poolOperatorUser->can('create', [Pool::class, $createPoolInput]));
        $this->assertTrue($this->communityRecruiterUser->can('create', [Pool::class, $createPoolInput]));
        $this->assertTrue($this->communityAdminUser->can('create', [Pool::class, $createPoolInput]));

        $this->assertFalse($this->guestUser->can('create', [Pool::class, $createPoolInput]));
        $this->assertFalse($this->applicantUser->can('create', [Pool::class, $createPoolInput]));
        $this->assertFalse($this->requestResponderUser->can('create', [Pool::class, $createPoolInput]));
        $this->assertFalse($this->communityManagerUser->can('create', [Pool::class, $createPoolInput]));
        $this->assertFalse($this->adminUser->can('create', [Pool::class, $createPoolInput]));
        $this->assertFalse($this->processOperatorUser->can('create', [Pool::class, $createPoolInput]));

        // Pool operator cannot create pools for other teams, and community roles cannot do so for other communities
        $createOtherPoolInput = [
            'team_id' => $this->otherTeam->id,
            'community_id' => $this->otherCommunity->id,
        ];
        $this->assertFalse($this->poolOperatorUser->can('create', [Pool::class, $createOtherPoolInput]));
        $this->assertFalse($this->communityRecruiterUser->can('create', [Pool::class, $createOtherPoolInput]));
        $this->assertFalse($this->communityAdminUser->can('create', [Pool::class, $createOtherPoolInput]));
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
        $this->assertFalse($this->communityManagerUser->can('updateDraft', $this->teamPool));
        $this->assertFalse($this->adminUser->can('updateDraft', $this->teamPool));

        // Pool operator cannot update other teams draft pools
        $this->unOwnedPool->published_at = null;
        $this->unOwnedPool->save();

        $this->assertFalse($this->poolOperatorUser->can('updateDraft', $this->unOwnedPool));
    }

    /**
     * Assert that only community managers can publish pools
     *
     * @return void
     */
    public function testPublish()
    {
        $this->teamPool->published_at = null;
        $this->teamPool->closing_date = config('constants.far_future_date');
        $this->teamPool->save();

        $this->assertTrue($this->communityManagerUser->can('publish', $this->teamPool));

        $this->assertFalse($this->guestUser->can('publish', $this->teamPool));
        $this->assertFalse($this->applicantUser->can('publish', $this->teamPool));
        $this->assertFalse($this->poolOperatorUser->can('publish', $this->teamPool));
        $this->assertFalse($this->requestResponderUser->can('publish', $this->teamPool));
        $this->assertFalse($this->adminUser->can('publish', $this->teamPool));
    }

    /**
     * Assert that only Community Managers can update a pools closing date
     *
     * @return void
     */
    public function testChangeClosingDate()
    {
        $this->assertTrue($this->communityManagerUser->can('changePoolClosingDate', $this->teamPool));

        $this->assertFalse($this->guestUser->can('changePoolClosingDate', $this->teamPool));
        $this->assertFalse($this->applicantUser->can('changePoolClosingDate', $this->teamPool));
        $this->assertFalse($this->requestResponderUser->can('changePoolClosingDate', $this->teamPool));
        $this->assertFalse($this->adminUser->can('changePoolClosingDate', $this->teamPool));
        $this->assertFalse($this->poolOperatorUser->can('changePoolClosingDate', $this->teamPool));
        // Pool operator cannot update other teams pools closing dates
        $this->assertFalse($this->poolOperatorUser->can('changePoolClosingDate', $this->unOwnedPool));
    }

    /**
     * Assert that only Community Managers can close a pool
     *
     * @return void
     */
    public function testClosePool()
    {
        $this->assertTrue($this->communityManagerUser->can('closePool', $this->teamPool));

        $this->assertFalse($this->poolOperatorUser->can('closePool', $this->teamPool));
        $this->assertFalse($this->guestUser->can('closePool', $this->teamPool));
        $this->assertFalse($this->applicantUser->can('closePool', $this->teamPool));
        $this->assertFalse($this->requestResponderUser->can('closePool', $this->teamPool));
        $this->assertFalse($this->adminUser->can('closePool', $this->teamPool));
        // Pool operator cannot close other teams pools
        $this->assertFalse($this->poolOperatorUser->can('closePool', $this->unOwnedPool));
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
        $this->assertFalse($this->communityManagerUser->can('deleteDraft', $this->teamPool));
        $this->assertFalse($this->adminUser->can('deleteDraft', $this->teamPool));
        // Pool operator cannot close other teams pools
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
        $this->assertFalse($this->communityManagerUser->can('deleteDraft', $this->teamPool));
        $this->assertFalse($this->adminUser->can('deleteDraft', $this->teamPool));
    }

    /**
     * Assert that only pool operators can archive and un-archive a pool
     *
     * @return void
     */
    public function testArchiveAndUnarchive()
    {
        $this->assertTrue($this->poolOperatorUser->can('archiveAndUnarchive', $this->teamPool));

        $this->assertFalse($this->guestUser->can('archiveAndUnarchive', $this->teamPool));
        $this->assertFalse($this->applicantUser->can('archiveAndUnarchive', $this->teamPool));
        $this->assertFalse($this->requestResponderUser->can('archiveAndUnarchive', $this->teamPool));
        $this->assertFalse($this->communityManagerUser->can('archiveAndUnarchive', $this->teamPool));
        $this->assertFalse($this->adminUser->can('archiveAndUnarchive', $this->teamPool));
        // Pool operator cannot close other teams pools
        $this->assertFalse($this->poolOperatorUser->can('archiveAndUnarchive', $this->unOwnedPool));
    }
}
