<?php

namespace Tests\Unit;

use App\Models\Community;
use App\Models\Pool;
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

    protected $processOperatorUser;

    protected $communityRecruiterUser;

    protected $communityAdminUser;

    protected $communityTalentCoordinatorUser;

    protected $adminUser;

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

        $this->community = Community::factory()->create();
        $this->otherCommunity = Community::factory()->create();

        $this->adminUser = User::factory()
            ->asApplicant()
            ->asAdmin()
            ->create([
                'email' => 'platform-admin-user@test.com',
                'sub' => 'platform-admin-user@test.com',
            ]);

        $this->teamPool = Pool::factory()->create([
            'user_id' => $this->adminUser->id,
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

        $this->communityTalentCoordinatorUser = User::factory()
            ->asCommunityTalentCoordinator($this->community->id)
            ->create([
                'email' => 'talent-coordinator@test.com',
            ]);

        $this->unOwnedPool = Pool::factory([
            'community_id' => $this->otherCommunity->id,
        ])->create();
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
        $this->assertFalse($this->processOperatorUser->can('viewAny', Pool::class));
        $this->assertFalse($this->communityRecruiterUser->can('viewAny', Pool::class));
        $this->assertFalse($this->communityAdminUser->can('viewAny', Pool::class));
        $this->assertFalse($this->communityTalentCoordinatorUser->can('viewAny', Pool::class));
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
        $this->assertTrue($this->adminUser->can('viewAnyPublished', Pool::class));

        $this->assertTrue($this->processOperatorUser->can('viewAnyPublished', Pool::class));
        $this->assertTrue($this->communityRecruiterUser->can('viewAnyPublished', Pool::class));
        $this->assertTrue($this->communityAdminUser->can('viewAnyPublished', Pool::class));
        $this->assertTrue($this->communityTalentCoordinatorUser->can('viewAnyPublished', Pool::class));
    }

    /**
     * Assert that the following can view a pool:
     *
     * Platform Admin, Process Operator, Community Recruiter, Community Admin
     *
     * @return void
     */
    public function testView()
    {
        $this->teamPool->published_at = null;
        $this->teamPool->save();
        $this->unOwnedPool->published_at = null;
        $this->unOwnedPool->save();

        $this->assertTrue($this->adminUser->can('view', $this->teamPool));
        $this->assertTrue($this->processOperatorUser->can('view', $this->teamPool));
        $this->assertTrue($this->communityRecruiterUser->can('view', $this->teamPool));
        $this->assertTrue($this->communityAdminUser->can('view', $this->teamPool));

        $this->assertFalse($this->guestUser->can('view', $this->teamPool));
        $this->assertFalse($this->applicantUser->can('view', $this->teamPool));
        $this->assertFalse($this->communityTalentCoordinatorUser->can('view', $this->teamPool));

        // Below roles cannot view other team's draft pools
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
        $this->assertTrue($this->communityTalentCoordinatorUser->can('view', $this->teamPool));

        // All can view other teams pools if they are published
        $this->assertTrue($this->guestUser->can('view', $this->unOwnedPool));
        $this->assertTrue($this->adminUser->can('view', $this->unOwnedPool));
        $this->assertTrue($this->processOperatorUser->can('view', $this->unOwnedPool));
        $this->assertTrue($this->communityRecruiterUser->can('view', $this->unOwnedPool));
        $this->assertTrue($this->communityAdminUser->can('view', $this->unOwnedPool));
        $this->assertTrue($this->communityTalentCoordinatorUser->can('view', $this->unOwnedPool));
    }

    /**
     * Assert that the following can view a draft pool:
     *
     * platform admin
     *
     * @return void
     */
    public function testViewDraftPool()
    {
        $this->teamPool->published_at = null;
        $this->teamPool->save();

        $this->assertTrue($this->adminUser->can('view', $this->teamPool));

        $this->assertFalse($this->guestUser->can('view', $this->teamPool));
        $this->assertFalse($this->applicantUser->can('view', $this->teamPool));

        $this->unOwnedPool->published_at = null;
        $this->unOwnedPool->save();
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
        $this->assertTrue($this->adminUser->can('view', $this->teamPool));
        $this->assertTrue($this->processOperatorUser->can('view', $this->teamPool));
        $this->assertTrue($this->communityRecruiterUser->can('view', $this->teamPool));
        $this->assertTrue($this->communityAdminUser->can('view', $this->teamPool));
        $this->assertTrue($this->communityTalentCoordinatorUser->can('view', $this->teamPool));
    }

    /**
     * Assert that only community recruiters, and community admins can create pools
     *
     * @return void
     */
    public function testCreate()
    {
        $createPoolInput = [
            'community_id' => $this->community->id,
        ];

        $this->assertTrue($this->communityRecruiterUser->can('create', [Pool::class, $createPoolInput]));
        $this->assertTrue($this->communityAdminUser->can('create', [Pool::class, $createPoolInput]));

        $this->assertFalse($this->guestUser->can('create', [Pool::class, $createPoolInput]));
        $this->assertFalse($this->applicantUser->can('create', [Pool::class, $createPoolInput]));
        $this->assertFalse($this->adminUser->can('create', [Pool::class, $createPoolInput]));
        $this->assertFalse($this->processOperatorUser->can('create', [Pool::class, $createPoolInput]));
        $this->assertFalse($this->communityTalentCoordinatorUser->can('create', [Pool::class, $createPoolInput]));

        // community roles cannot create pools for other communities
        $createOtherPoolInput = [
            'community_id' => $this->otherCommunity->id,
        ];
        $this->assertFalse($this->communityRecruiterUser->can('create', [Pool::class, $createOtherPoolInput]));
        $this->assertFalse($this->communityAdminUser->can('create', [Pool::class, $createOtherPoolInput]));
    }

    /**
     * Assert that only community recruiters, and community admins can duplicate pools
     *
     * @return void
     */
    public function testDuplicate()
    {
        $this->assertTrue($this->communityRecruiterUser->can('duplicate', $this->teamPool));
        $this->assertTrue($this->communityAdminUser->can('duplicate', $this->teamPool));

        $this->assertFalse($this->guestUser->can('duplicate', $this->teamPool));
        $this->assertFalse($this->applicantUser->can('duplicate', $this->teamPool));
        $this->assertFalse($this->adminUser->can('duplicate', $this->teamPool));
        $this->assertFalse($this->processOperatorUser->can('duplicate', $this->teamPool));
        $this->assertFalse($this->communityTalentCoordinatorUser->can('duplicate', $this->teamPool));

        // cannot duplicate unowned or other's pools
        $this->assertFalse($this->communityRecruiterUser->can('duplicate', $this->unOwnedPool));
        $this->assertFalse($this->communityAdminUser->can('duplicate', $this->unOwnedPool));
    }

    /**
     * Assert process operator, community recruiter, community admin can update draft
     *
     * @return void
     */
    public function testUpdateDraft()
    {
        $this->teamPool->published_at = null;
        $this->teamPool->save();

        $this->assertTrue($this->processOperatorUser->can('updateDraft', $this->teamPool));
        $this->assertTrue($this->communityRecruiterUser->can('updateDraft', $this->teamPool));
        $this->assertTrue($this->communityAdminUser->can('updateDraft', $this->teamPool));

        $this->assertFalse($this->guestUser->can('updateDraft', $this->teamPool));
        $this->assertFalse($this->applicantUser->can('updateDraft', $this->teamPool));
        $this->assertFalse($this->adminUser->can('updateDraft', $this->teamPool));
        $this->assertFalse($this->communityTalentCoordinatorUser->can('updateDraft', $this->teamPool));

        // Cannot update other team's draft pools
        $this->unOwnedPool->published_at = null;
        $this->unOwnedPool->save();

        $this->assertFalse($this->processOperatorUser->can('updateDraft', $this->unOwnedPool));
        $this->assertFalse($this->communityRecruiterUser->can('updateDraft', $this->unOwnedPool));
        $this->assertFalse($this->communityAdminUser->can('updateDraft', $this->unOwnedPool));
    }

    /**
     * Assert that community admin can publish pools
     *
     * @return void
     */
    public function testPublish()
    {
        $this->teamPool->published_at = null;
        $this->teamPool->closing_date = config('constants.far_future_date');
        $this->teamPool->save();

        $this->assertTrue($this->communityAdminUser->can('publish', $this->teamPool));

        $this->assertFalse($this->guestUser->can('publish', $this->teamPool));
        $this->assertFalse($this->applicantUser->can('publish', $this->teamPool));
        $this->assertFalse($this->adminUser->can('publish', $this->teamPool));
        $this->assertFalse($this->processOperatorUser->can('publish', $this->teamPool));
        $this->assertFalse($this->communityRecruiterUser->can('publish', $this->teamPool));
        $this->assertFalse($this->communityTalentCoordinatorUser->can('publish', $this->teamPool));

        // Cannot publish other team's draft pools
        $this->unOwnedPool->published_at = null;
        $this->unOwnedPool->save();

        $this->assertFalse($this->processOperatorUser->can('publish', $this->unOwnedPool));
        $this->assertFalse($this->communityRecruiterUser->can('publish', $this->unOwnedPool));
        $this->assertFalse($this->communityAdminUser->can('publish', $this->unOwnedPool));
    }

    /**
     * Assert Community Admin can update a pool's closing date
     *
     * @return void
     */
    public function testChangeClosingDate()
    {
        $this->assertTrue($this->communityAdminUser->can('changePoolClosingDate', $this->teamPool));

        $this->assertFalse($this->guestUser->can('changePoolClosingDate', $this->teamPool));
        $this->assertFalse($this->applicantUser->can('changePoolClosingDate', $this->teamPool));
        $this->assertFalse($this->adminUser->can('changePoolClosingDate', $this->teamPool));
        $this->assertFalse($this->processOperatorUser->can('changePoolClosingDate', $this->teamPool));
        $this->assertFalse($this->communityRecruiterUser->can('changePoolClosingDate', $this->teamPool));
        $this->assertFalse($this->communityRecruiterUser->can('changePoolClosingDate', $this->teamPool));

        // Cannot update other teams pool's closing dates
        $this->assertFalse($this->processOperatorUser->can('changePoolClosingDate', $this->unOwnedPool));
        $this->assertFalse($this->communityRecruiterUser->can('changePoolClosingDate', $this->unOwnedPool));
        $this->assertFalse($this->communityAdminUser->can('changePoolClosingDate', $this->unOwnedPool));
    }

    /**
     * Assert Community Admin can update a published pool
     *
     * @return void
     */
    public function testUpdatePublished()
    {
        $this->teamPool->published_at = null;
        $this->teamPool->save();

        // fails for unpublished
        $this->assertFalse($this->communityAdminUser->can('updatePublished', $this->teamPool));

        $this->teamPool->published_at = config('constants.past_date');
        $this->teamPool->save();
        $this->unOwnedPool->published_at = config('constants.past_date');
        $this->unOwnedPool->save();

        $this->assertTrue($this->communityAdminUser->can('updatePublished', $this->teamPool));

        $this->assertFalse($this->guestUser->can('updatePublished', $this->teamPool));
        $this->assertFalse($this->applicantUser->can('updatePublished', $this->teamPool));
        $this->assertFalse($this->adminUser->can('updatePublished', $this->teamPool));
        $this->assertFalse($this->processOperatorUser->can('updatePublished', $this->teamPool));
        $this->assertFalse($this->communityRecruiterUser->can('updatePublished', $this->teamPool));
        $this->assertFalse($this->communityTalentCoordinatorUser->can('updatePublished', $this->teamPool));

        // Cannot update other teams published pools
        $this->assertFalse($this->processOperatorUser->can('updatePublished', $this->unOwnedPool));
        $this->assertFalse($this->communityRecruiterUser->can('updatePublished', $this->unOwnedPool));
        $this->assertFalse($this->communityAdminUser->can('updatePublished', $this->unOwnedPool));
    }

    /**
     * Assert that only Community Admin can close a pool
     *
     * @return void
     */
    public function testClosePool()
    {
        $this->assertTrue($this->communityAdminUser->can('closePool', $this->teamPool));

        $this->assertFalse($this->guestUser->can('closePool', $this->teamPool));
        $this->assertFalse($this->applicantUser->can('closePool', $this->teamPool));
        $this->assertFalse($this->adminUser->can('closePool', $this->teamPool));
        $this->assertFalse($this->processOperatorUser->can('closePool', $this->teamPool));
        $this->assertFalse($this->communityRecruiterUser->can('closePool', $this->teamPool));
        $this->assertFalse($this->communityTalentCoordinatorUser->can('closePool', $this->teamPool));

        // Cannot close other team's pools
        $this->assertFalse($this->processOperatorUser->can('closePool', $this->unOwnedPool));
        $this->assertFalse($this->communityRecruiterUser->can('closePool', $this->unOwnedPool));
        $this->assertFalse($this->communityAdminUser->can('closePool', $this->unOwnedPool));
    }

    /**
     * Assert that community recruiter, community admin can delete a draft pool
     *
     * @return void
     */
    public function testDeleteDraft()
    {
        $this->teamPool->published_at = null;
        $this->teamPool->save();
        $this->unOwnedPool->published_at = null;
        $this->unOwnedPool->save();

        $this->assertTrue($this->communityRecruiterUser->can('deleteDraft', $this->teamPool));
        $this->assertTrue($this->communityAdminUser->can('deleteDraft', $this->teamPool));

        $this->assertFalse($this->guestUser->can('deleteDraft', $this->teamPool));
        $this->assertFalse($this->applicantUser->can('deleteDraft', $this->teamPool));
        $this->assertFalse($this->adminUser->can('deleteDraft', $this->teamPool));
        $this->assertFalse($this->processOperatorUser->can('deleteDraft', $this->teamPool));
        $this->assertFalse($this->communityTalentCoordinatorUser->can('deleteDraft', $this->teamPool));

        // Cannot delete other team's pools
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
        $this->assertFalse($this->adminUser->can('deleteDraft', $this->teamPool));
        $this->assertFalse($this->processOperatorUser->can('deleteDraft', $this->teamPool));
        $this->assertFalse($this->communityRecruiterUser->can('deleteDraft', $this->teamPool));
        $this->assertFalse($this->communityAdminUser->can('deleteDraft', $this->teamPool));
        $this->assertFalse($this->communityTalentCoordinatorUser->can('deleteDraft', $this->teamPool));
    }

    /**
     * Assert that only community recruiter, community admin can archive and un-archive a pool
     *
     * @return void
     */
    public function testArchiveAndUnarchive()
    {
        $this->assertTrue($this->communityRecruiterUser->can('archiveAndUnarchive', $this->teamPool));
        $this->assertTrue($this->communityAdminUser->can('archiveAndUnarchive', $this->teamPool));

        $this->assertFalse($this->guestUser->can('archiveAndUnarchive', $this->teamPool));
        $this->assertFalse($this->applicantUser->can('archiveAndUnarchive', $this->teamPool));
        $this->assertFalse($this->adminUser->can('archiveAndUnarchive', $this->teamPool));
        $this->assertFalse($this->processOperatorUser->can('archiveAndUnarchive', $this->teamPool));
        $this->assertFalse($this->communityTalentCoordinatorUser->can('archiveAndUnarchive', $this->teamPool));

        // Cannot archive other team's pools
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
        $this->assertTrue($this->adminUser->can('viewAssessmentPlan', $this->teamPool));
        $this->assertTrue($this->processOperatorUser->can('viewAssessmentPlan', $this->teamPool));
        $this->assertTrue($this->communityRecruiterUser->can('viewAssessmentPlan', $this->teamPool));
        $this->assertTrue($this->communityAdminUser->can('viewAssessmentPlan', $this->teamPool));

        $this->assertFalse($this->guestUser->can('viewAssessmentPlan', $this->teamPool));
        $this->assertFalse($this->applicantUser->can('viewAssessmentPlan', $this->teamPool));
        $this->assertFalse($this->communityTalentCoordinatorUser->can('viewAssessmentPlan', $this->teamPool));

        // Cannot view other team's assessment plans
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
        $this->assertTrue($this->processOperatorUser->can('viewTeamMembers', $this->teamPool));
        $this->assertTrue($this->communityRecruiterUser->can('viewTeamMembers', $this->teamPool));
        $this->assertTrue($this->communityAdminUser->can('viewTeamMembers', $this->teamPool));

        $this->assertFalse($this->guestUser->can('viewTeamMembers', $this->teamPool));
        $this->assertFalse($this->applicantUser->can('viewTeamMembers', $this->teamPool));
        $this->assertFalse($this->communityTalentCoordinatorUser->can('viewTeamMembers', $this->teamPool));

        // Cannot view other team's members
        $this->assertFalse($this->processOperatorUser->can('viewTeamMembers', $this->unOwnedPool));
        $this->assertFalse($this->communityRecruiterUser->can('viewTeamMembers', $this->unOwnedPool));
        $this->assertFalse($this->communityAdminUser->can('viewTeamMembers', $this->unOwnedPool));
    }
}
