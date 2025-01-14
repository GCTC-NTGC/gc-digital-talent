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

class PoolPolicyTest extends TestCase
{
    use RefreshDatabase;
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
        $this->community = Community::factory()->create();
        $this->otherCommunity = Community::factory()->create();

        $this->poolOperatorUser = User::factory()
            ->asApplicant()
            ->asProcessOperator($this->team->name)
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
            'community_id' => $this->community->id,
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

        $this->unOwnedPool = Pool::factory([
            'team_id' => $this->otherTeam->id,
            'community_id' => $this->otherCommunity->id,
        ])->create();
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
        $this->assertFalse($this->processOperatorUser->can('viewAny', Pool::class));
        $this->assertFalse($this->communityRecruiterUser->can('viewAny', Pool::class));
        $this->assertFalse($this->communityAdminUser->can('viewAny', Pool::class));
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

        $this->assertTrue($this->processOperatorUser->can('viewAnyPublished', Pool::class));
        $this->assertTrue($this->communityRecruiterUser->can('viewAnyPublished', Pool::class));
        $this->assertTrue($this->communityAdminUser->can('viewAnyPublished', Pool::class));
    }

    /**
     * Assert that the following can view a pool:
     *
     * Pool Operator, Platform Admin, Process Operator, Community Recruiter, Community Admin
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
        $this->assertTrue($this->processOperatorUser->can('view', $this->teamPool));
        $this->assertTrue($this->communityRecruiterUser->can('view', $this->teamPool));
        $this->assertTrue($this->communityAdminUser->can('view', $this->teamPool));

        $this->assertFalse($this->guestUser->can('view', $this->teamPool));
        $this->assertFalse($this->applicantUser->can('view', $this->teamPool));
        $this->assertFalse($this->requestResponderUser->can('view', $this->teamPool));

        // Below roles cannot view other team's draft pools
        $this->assertFalse($this->poolOperatorUser->can('view', $this->unOwnedPool));
        $this->assertFalse($this->processOperatorUser->can('view', $this->unOwnedPool));
        $this->assertFalse($this->communityRecruiterUser->can('view', $this->unOwnedPool));
        $this->assertFalse($this->communityAdminUser->can('view', $this->unOwnedPool));

        // Note: We now allow everyone to view published pools
        $this->teamPool->published_at = config('constants.past_date');
        $this->teamPool->save();
        $this->unOwnedPool->published_at = config('constants.past_date');
        $this->unOwnedPool->save();

        $this->assertTrue($this->guestUser->can('view', $this->teamPool));
        $this->assertTrue($this->applicantUser->can('view', $this->teamPool));
        $this->assertTrue($this->poolOperatorUser->can('view', $this->teamPool));

        // All can view other teams pools if they are published
        $this->assertTrue($this->poolOperatorUser->can('view', $this->unOwnedPool));
        $this->assertTrue($this->guestUser->can('view', $this->unOwnedPool));
        $this->assertTrue($this->requestResponderUser->can('view', $this->unOwnedPool));
        $this->assertTrue($this->communityManagerUser->can('view', $this->unOwnedPool));
        $this->assertTrue($this->adminUser->can('view', $this->unOwnedPool));
        $this->assertTrue($this->processOperatorUser->can('view', $this->unOwnedPool));
        $this->assertTrue($this->communityRecruiterUser->can('view', $this->unOwnedPool));
        $this->assertTrue($this->communityAdminUser->can('view', $this->unOwnedPool));
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
        $this->assertTrue($this->processOperatorUser->can('view', $this->teamPool));
        $this->assertTrue($this->communityRecruiterUser->can('view', $this->teamPool));
        $this->assertTrue($this->communityAdminUser->can('view', $this->teamPool));
    }

    /**
     * Assert that only pool operators, community recruiters, and community admins can create pools
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
     * Assert that only pool operators, community recruiters, and community admins can duplicate pools
     *
     * @return void
     */
    public function testDuplicate()
    {
        $this->assertTrue($this->poolOperatorUser->can('duplicate', $this->teamPool));
        $this->assertTrue($this->communityRecruiterUser->can('duplicate', $this->teamPool));
        $this->assertTrue($this->communityAdminUser->can('duplicate', $this->teamPool));

        $this->assertFalse($this->guestUser->can('duplicate', $this->teamPool));
        $this->assertFalse($this->applicantUser->can('duplicate', $this->teamPool));
        $this->assertFalse($this->requestResponderUser->can('duplicate', $this->teamPool));
        $this->assertFalse($this->communityManagerUser->can('duplicate', $this->teamPool));
        $this->assertFalse($this->adminUser->can('duplicate', $this->teamPool));
        $this->assertFalse($this->processOperatorUser->can('duplicate', $this->teamPool));

        // cannot duplicate unowned or other's pools
        $this->assertFalse($this->poolOperatorUser->can('duplicate', $this->unOwnedPool));
        $this->assertFalse($this->communityRecruiterUser->can('duplicate', $this->unOwnedPool));
        $this->assertFalse($this->communityAdminUser->can('duplicate', $this->unOwnedPool));
    }

    /**
     * Assert pool operator, process operator, community recruiter, community admin can update draft
     *
     * @return void
     */
    public function testUpdateDraft()
    {
        $this->teamPool->published_at = null;
        $this->teamPool->save();

        $this->assertTrue($this->poolOperatorUser->can('updateDraft', $this->teamPool));
        $this->assertTrue($this->processOperatorUser->can('updateDraft', $this->teamPool));
        $this->assertTrue($this->communityRecruiterUser->can('updateDraft', $this->teamPool));
        $this->assertTrue($this->communityAdminUser->can('updateDraft', $this->teamPool));

        $this->assertFalse($this->guestUser->can('updateDraft', $this->teamPool));
        $this->assertFalse($this->applicantUser->can('updateDraft', $this->teamPool));
        $this->assertFalse($this->requestResponderUser->can('updateDraft', $this->teamPool));
        $this->assertFalse($this->communityManagerUser->can('updateDraft', $this->teamPool));
        $this->assertFalse($this->adminUser->can('updateDraft', $this->teamPool));

        // Cannot update other team's draft pools
        $this->unOwnedPool->published_at = null;
        $this->unOwnedPool->save();

        $this->assertFalse($this->poolOperatorUser->can('updateDraft', $this->unOwnedPool));
        $this->assertFalse($this->processOperatorUser->can('updateDraft', $this->unOwnedPool));
        $this->assertFalse($this->communityRecruiterUser->can('updateDraft', $this->unOwnedPool));
        $this->assertFalse($this->communityAdminUser->can('updateDraft', $this->unOwnedPool));
    }

    /**
     * Assert that community manager and community admin can publish pools
     *
     * @return void
     */
    public function testPublish()
    {
        $this->teamPool->published_at = null;
        $this->teamPool->closing_date = config('constants.far_future_date');
        $this->teamPool->save();

        $this->assertTrue($this->communityManagerUser->can('publish', $this->teamPool));
        $this->assertTrue($this->communityAdminUser->can('publish', $this->teamPool));

        $this->assertFalse($this->guestUser->can('publish', $this->teamPool));
        $this->assertFalse($this->applicantUser->can('publish', $this->teamPool));
        $this->assertFalse($this->poolOperatorUser->can('publish', $this->teamPool));
        $this->assertFalse($this->requestResponderUser->can('publish', $this->teamPool));
        $this->assertFalse($this->adminUser->can('publish', $this->teamPool));
        $this->assertFalse($this->processOperatorUser->can('publish', $this->teamPool));
        $this->assertFalse($this->communityRecruiterUser->can('publish', $this->teamPool));

        // Cannot publish other team's draft pools
        $this->unOwnedPool->published_at = null;
        $this->unOwnedPool->save();

        $this->assertFalse($this->poolOperatorUser->can('publish', $this->unOwnedPool));
        $this->assertFalse($this->processOperatorUser->can('publish', $this->unOwnedPool));
        $this->assertFalse($this->communityRecruiterUser->can('publish', $this->unOwnedPool));
        $this->assertFalse($this->communityAdminUser->can('publish', $this->unOwnedPool));
    }

    /**
     * Assert Community Manager, Community Admin can update a pool's closing date
     *
     * @return void
     */
    public function testChangeClosingDate()
    {
        $this->assertTrue($this->communityManagerUser->can('changePoolClosingDate', $this->teamPool));
        $this->assertTrue($this->communityAdminUser->can('changePoolClosingDate', $this->teamPool));

        $this->assertFalse($this->guestUser->can('changePoolClosingDate', $this->teamPool));
        $this->assertFalse($this->applicantUser->can('changePoolClosingDate', $this->teamPool));
        $this->assertFalse($this->requestResponderUser->can('changePoolClosingDate', $this->teamPool));
        $this->assertFalse($this->adminUser->can('changePoolClosingDate', $this->teamPool));
        $this->assertFalse($this->poolOperatorUser->can('changePoolClosingDate', $this->teamPool));
        $this->assertFalse($this->processOperatorUser->can('changePoolClosingDate', $this->teamPool));
        $this->assertFalse($this->communityRecruiterUser->can('changePoolClosingDate', $this->teamPool));

        // Cannot update other teams pool's closing dates
        $this->assertFalse($this->poolOperatorUser->can('changePoolClosingDate', $this->unOwnedPool));
        $this->assertFalse($this->processOperatorUser->can('changePoolClosingDate', $this->unOwnedPool));
        $this->assertFalse($this->communityRecruiterUser->can('changePoolClosingDate', $this->unOwnedPool));
        $this->assertFalse($this->communityAdminUser->can('changePoolClosingDate', $this->unOwnedPool));
    }

    /**
     * Assert Community Manager, Community Admin can update a published pool
     *
     * @return void
     */
    public function testUpdatePublished()
    {
        $this->teamPool->published_at = null;
        $this->teamPool->save();

        // fails for unpublished
        $this->assertFalse($this->communityManagerUser->can('updatePublished', $this->teamPool));
        $this->assertFalse($this->communityAdminUser->can('updatePublished', $this->teamPool));

        $this->teamPool->published_at = config('constants.past_date');
        $this->teamPool->save();
        $this->unOwnedPool->published_at = config('constants.past_date');
        $this->unOwnedPool->save();

        $this->assertTrue($this->communityManagerUser->can('updatePublished', $this->teamPool));
        $this->assertTrue($this->communityAdminUser->can('updatePublished', $this->teamPool));

        $this->assertFalse($this->guestUser->can('updatePublished', $this->teamPool));
        $this->assertFalse($this->applicantUser->can('updatePublished', $this->teamPool));
        $this->assertFalse($this->requestResponderUser->can('updatePublished', $this->teamPool));
        $this->assertFalse($this->adminUser->can('updatePublished', $this->teamPool));
        $this->assertFalse($this->poolOperatorUser->can('updatePublished', $this->teamPool));
        $this->assertFalse($this->processOperatorUser->can('updatePublished', $this->teamPool));
        $this->assertFalse($this->communityRecruiterUser->can('updatePublished', $this->teamPool));

        // Cannot update other teams published pools
        $this->assertFalse($this->poolOperatorUser->can('updatePublished', $this->unOwnedPool));
        $this->assertFalse($this->processOperatorUser->can('updatePublished', $this->unOwnedPool));
        $this->assertFalse($this->communityRecruiterUser->can('updatePublished', $this->unOwnedPool));
        $this->assertFalse($this->communityAdminUser->can('updatePublished', $this->unOwnedPool));
    }

    /**
     * Assert that only Community Manager and Community Admin can close a pool
     *
     * @return void
     */
    public function testClosePool()
    {
        $this->assertTrue($this->communityManagerUser->can('closePool', $this->teamPool));
        $this->assertTrue($this->communityAdminUser->can('closePool', $this->teamPool));

        $this->assertFalse($this->poolOperatorUser->can('closePool', $this->teamPool));
        $this->assertFalse($this->guestUser->can('closePool', $this->teamPool));
        $this->assertFalse($this->applicantUser->can('closePool', $this->teamPool));
        $this->assertFalse($this->requestResponderUser->can('closePool', $this->teamPool));
        $this->assertFalse($this->adminUser->can('closePool', $this->teamPool));
        $this->assertFalse($this->processOperatorUser->can('closePool', $this->teamPool));
        $this->assertFalse($this->communityRecruiterUser->can('closePool', $this->teamPool));

        // Cannot close other team's pools
        $this->assertFalse($this->poolOperatorUser->can('closePool', $this->unOwnedPool));
        $this->assertFalse($this->processOperatorUser->can('closePool', $this->unOwnedPool));
        $this->assertFalse($this->communityRecruiterUser->can('closePool', $this->unOwnedPool));
        $this->assertFalse($this->communityAdminUser->can('closePool', $this->unOwnedPool));
    }

    /**
     * Assert that pool operator, community recruiter, community admin can delete a draft pool
     *
     * @return void
     */
    public function testDeleteDraft()
    {
        $this->teamPool->published_at = null;
        $this->teamPool->save();
        $this->unOwnedPool->published_at = null;
        $this->unOwnedPool->save();

        $this->assertTrue($this->poolOperatorUser->can('deleteDraft', $this->teamPool));
        $this->assertTrue($this->communityRecruiterUser->can('deleteDraft', $this->teamPool));
        $this->assertTrue($this->communityAdminUser->can('deleteDraft', $this->teamPool));

        $this->assertFalse($this->guestUser->can('deleteDraft', $this->teamPool));
        $this->assertFalse($this->applicantUser->can('deleteDraft', $this->teamPool));
        $this->assertFalse($this->requestResponderUser->can('deleteDraft', $this->teamPool));
        $this->assertFalse($this->communityManagerUser->can('deleteDraft', $this->teamPool));
        $this->assertFalse($this->adminUser->can('deleteDraft', $this->teamPool));
        $this->assertFalse($this->processOperatorUser->can('deleteDraft', $this->teamPool));

        // Cannot delete other team's pools
        $this->assertFalse($this->poolOperatorUser->can('deleteDraft', $this->unOwnedPool));
        $this->assertFalse($this->processOperatorUser->can('deleteDraft', $this->unOwnedPool));
        $this->assertFalse($this->communityRecruiterUser->can('deleteDraft', $this->unOwnedPool));
        $this->assertFalse($this->communityAdminUser->can('deleteDraft', $this->unOwnedPool));
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
        $this->assertFalse($this->processOperatorUser->can('deleteDraft', $this->teamPool));
        $this->assertFalse($this->communityRecruiterUser->can('deleteDraft', $this->teamPool));
        $this->assertFalse($this->communityAdminUser->can('deleteDraft', $this->teamPool));
    }

    /**
     * Assert that only pool operator, community recruiter, community admin can archive and un-archive a pool
     *
     * @return void
     */
    public function testArchiveAndUnarchive()
    {
        $this->assertTrue($this->poolOperatorUser->can('archiveAndUnarchive', $this->teamPool));
        $this->assertTrue($this->communityRecruiterUser->can('archiveAndUnarchive', $this->teamPool));
        $this->assertTrue($this->communityAdminUser->can('archiveAndUnarchive', $this->teamPool));

        $this->assertFalse($this->guestUser->can('archiveAndUnarchive', $this->teamPool));
        $this->assertFalse($this->applicantUser->can('archiveAndUnarchive', $this->teamPool));
        $this->assertFalse($this->requestResponderUser->can('archiveAndUnarchive', $this->teamPool));
        $this->assertFalse($this->communityManagerUser->can('archiveAndUnarchive', $this->teamPool));
        $this->assertFalse($this->adminUser->can('archiveAndUnarchive', $this->teamPool));
        $this->assertFalse($this->processOperatorUser->can('archiveAndUnarchive', $this->teamPool));

        // Cannot archive other team's pools
        $this->assertFalse($this->poolOperatorUser->can('archiveAndUnarchive', $this->unOwnedPool));
        $this->assertFalse($this->processOperatorUser->can('archiveAndUnarchive', $this->unOwnedPool));
        $this->assertFalse($this->communityRecruiterUser->can('archiveAndUnarchive', $this->unOwnedPool));
        $this->assertFalse($this->communityAdminUser->can('archiveAndUnarchive', $this->unOwnedPool));
    }

    /**
     * Assert who can view assessment plans
     *
     * @return void
     */
    public function testViewAssessmentPlan()
    {
        $this->assertTrue($this->requestResponderUser->can('viewAssessmentPlan', $this->teamPool));
        $this->assertTrue($this->adminUser->can('viewAssessmentPlan', $this->teamPool));
        $this->assertTrue($this->communityManagerUser->can('viewAssessmentPlan', $this->teamPool));
        $this->assertTrue($this->poolOperatorUser->can('viewAssessmentPlan', $this->teamPool));
        $this->assertTrue($this->processOperatorUser->can('viewAssessmentPlan', $this->teamPool));
        $this->assertTrue($this->communityRecruiterUser->can('viewAssessmentPlan', $this->teamPool));
        $this->assertTrue($this->communityAdminUser->can('viewAssessmentPlan', $this->teamPool));

        $this->assertFalse($this->guestUser->can('viewAssessmentPlan', $this->teamPool));
        $this->assertFalse($this->applicantUser->can('viewAssessmentPlan', $this->teamPool));

        // Cannot view other team's assessment plans
        $this->assertFalse($this->poolOperatorUser->can('viewAssessmentPlan', $this->unOwnedPool));
        $this->assertFalse($this->processOperatorUser->can('viewAssessmentPlan', $this->unOwnedPool));
        $this->assertFalse($this->communityRecruiterUser->can('viewAssessmentPlan', $this->unOwnedPool));
        $this->assertFalse($this->communityAdminUser->can('viewAssessmentPlan', $this->unOwnedPool));
    }

    /**
     * Assert who can view team members
     *
     * @return void
     */
    public function testViewTeamMembers()
    {
        $this->assertTrue($this->adminUser->can('viewTeamMembers', $this->teamPool));
        $this->assertTrue($this->communityManagerUser->can('viewTeamMembers', $this->teamPool));
        $this->assertTrue($this->poolOperatorUser->can('viewTeamMembers', $this->teamPool));
        $this->assertTrue($this->processOperatorUser->can('viewTeamMembers', $this->teamPool));
        $this->assertTrue($this->communityRecruiterUser->can('viewTeamMembers', $this->teamPool));
        $this->assertTrue($this->communityAdminUser->can('viewTeamMembers', $this->teamPool));

        $this->assertFalse($this->guestUser->can('viewTeamMembers', $this->teamPool));
        $this->assertFalse($this->applicantUser->can('viewTeamMembers', $this->teamPool));
        $this->assertFalse($this->requestResponderUser->can('viewTeamMembers', $this->teamPool));

        // Cannot view other team's members
        $this->assertFalse($this->poolOperatorUser->can('viewTeamMembers', $this->unOwnedPool));
        $this->assertFalse($this->processOperatorUser->can('viewTeamMembers', $this->unOwnedPool));
        $this->assertFalse($this->communityRecruiterUser->can('viewTeamMembers', $this->unOwnedPool));
        $this->assertFalse($this->communityAdminUser->can('viewTeamMembers', $this->unOwnedPool));
    }
}
