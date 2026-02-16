<?php

namespace Tests\Unit;

use App\Enums\ApplicationStatus;
use App\Enums\PlacementType;
use App\Facades\Notify;
use App\Models\Community;
use App\Models\Pool;
use App\Models\PoolCandidate;
use App\Models\Team;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class PoolCandidatePolicyTest extends TestCase
{
    use RefreshDatabase;
    use WithFaker;

    protected $guestUser;

    protected $applicantUser;

    protected $candidateUser;

    protected $adminUser;

    protected $processOperatorUser;

    protected $communityRecruiterUser;

    protected $communityAdminUser;

    protected $communityTalentCoordinatorUser;

    protected $basePool;

    protected $teamPool;

    protected $community;

    protected $otherCommunity;

    protected $poolCandidate;

    protected $unOwnedPoolCandidate;

    protected function setUp(): void
    {
        parent::setUp();
        Notify::spy(); // don't send any notifications
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

        $this->community = Community::factory()->create(['name' => ['en' => 'test-team EN', 'fr' => 'test-team FR']]);
        $this->otherCommunity = Community::factory()->create(['name' => ['en' => 'suspicious-team EN', 'fr' => 'suspicious-team FR']]);

        $this->adminUser = User::factory()
            ->asAdmin()
            ->create([
                'email' => 'platform-admin-user@test.com',
                'sub' => 'platform-admin-user@test.com',
            ]);

        $this->candidateUser = User::factory()
            ->asApplicant()
            ->create([
                'email' => 'candidate-user@test.com',
                'sub' => 'candidate-user@test.com',
            ]);

        $this->teamPool = Pool::factory()->create([
            'user_id' => $this->adminUser->id,
            'community_id' => $this->community->id,
        ]);

        $this->poolCandidate = PoolCandidate::factory()->create([
            'user_id' => $this->candidateUser->id,
            'pool_id' => $this->teamPool->id,
        ]);

        $noTeamUser = User::factory()->create();
        $noTeamPool = Pool::factory([
            'community_id' => $this->otherCommunity->id,
        ])->create();

        $this->unOwnedPoolCandidate = PoolCandidate::factory()->create([
            'pool_id' => $noTeamPool->id,
            'user_id' => $noTeamUser->id,
            'submitted_at' => config('constants.past_date'),
        ]);

        $this->processOperatorUser = User::factory()
            ->asProcessOperator($this->teamPool->id)
            ->create([
                'email' => 'process-operator-user@test.com',
            ]);

        $this->communityRecruiterUser = User::factory()
            ->asCommunityRecruiter($this->community->id)
            ->create([
                'email' => 'community-recruiter-user@test.com',
            ]);

        $this->communityAdminUser = User::factory()
            ->asCommunityAdmin($this->community->id)
            ->create([
                'email' => 'community-admin-user@test.com',
            ]);

        $this->communityTalentCoordinatorUser = User::factory()
            ->asCommunityTalentCoordinator($this->community->id)
            ->create([
                'email' => 'talent-coordinator@test.com',
            ]);
    }

    /**
     * Assert that no user may view any pool candidate
     *
     * @return void
     */
    public function testViewAny()
    {
        $this->assertFalse($this->guestUser->can('viewAny', PoolCandidate::class));
        $this->assertFalse($this->applicantUser->can('viewAny', PoolCandidate::class));
        $this->assertFalse($this->candidateUser->can('viewAny', PoolCandidate::class));
        $this->assertFalse($this->adminUser->can('viewAny', PoolCandidate::class));

        $this->assertFalse($this->processOperatorUser->can('viewAny', PoolCandidate::class));
        $this->assertFalse($this->communityRecruiterUser->can('viewAny', PoolCandidate::class));
        $this->assertFalse($this->communityAdminUser->can('viewAny', PoolCandidate::class));
        $this->assertFalse($this->communityTalentCoordinatorUser->can('viewAny', PoolCandidate::class));
    }

    /**
     * Assert that only owner can view draft pool candidates
     *
     * @return void
     */
    public function testViewDraft()
    {
        $this->poolCandidate->submitted_at = null;
        $this->poolCandidate->save();

        $this->assertTrue($this->candidateUser->can('view', $this->poolCandidate));

        $this->assertFalse($this->guestUser->can('view', $this->poolCandidate));
        $this->assertFalse($this->applicantUser->can('view', $this->poolCandidate));
        $this->assertFalse($this->adminUser->can('view', $this->poolCandidate));

        $this->assertFalse($this->processOperatorUser->can('view', $this->poolCandidate));
        $this->assertFalse($this->communityRecruiterUser->can('view', $this->poolCandidate));
        $this->assertFalse($this->communityAdminUser->can('view', $this->poolCandidate));
        $this->assertFalse($this->communityTalentCoordinatorUser->can('view', $this->poolCandidate));
    }

    /**
     * Assert that the following can view a submitted pool candidate:
     *
     * owner, platform admin, process operator, community recruiter, community admin
     *
     * @return void
     */
    public function testViewSubmitted()
    {
        $this->poolCandidate->submitted_at = config('constants.past_date');
        $this->poolCandidate->save();

        $this->assertTrue($this->candidateUser->can('view', $this->poolCandidate));
        $this->assertTrue($this->adminUser->can('view', $this->poolCandidate));
        $this->assertTrue($this->processOperatorUser->can('view', $this->poolCandidate));
        $this->assertTrue($this->communityRecruiterUser->can('view', $this->poolCandidate));
        $this->assertTrue($this->communityAdminUser->can('view', $this->poolCandidate));

        $this->assertFalse($this->guestUser->can('view', $this->poolCandidate));
        $this->assertFalse($this->applicantUser->can('view', $this->poolCandidate));
        $this->assertFalse($this->communityTalentCoordinatorUser->can('view', $this->poolCandidate));

        // Cannot view submitted applications not in their team's pool
        $this->assertFalse($this->processOperatorUser->can('view', $this->unOwnedPoolCandidate));
        $this->assertFalse($this->communityRecruiterUser->can('view', $this->unOwnedPoolCandidate));
        $this->assertFalse($this->communityAdminUser->can('view', $this->unOwnedPoolCandidate));
    }

    /**
     * Assert that only applicant can create a draft pool candidate
     *
     * @return void
     */
    public function testCreateDraft()
    {
        $this->assertTrue($this->candidateUser->can('createDraft', PoolCandidate::class));
        $this->assertTrue($this->applicantUser->can('createDraft', PoolCandidate::class));

        $this->assertFalse($this->guestUser->can('createDraft', PoolCandidate::class));
        $this->assertFalse($this->adminUser->can('createDraft', PoolCandidate::class));
        $this->assertFalse($this->processOperatorUser->can('createDraft', PoolCandidate::class));
        $this->assertFalse($this->communityRecruiterUser->can('createDraft', PoolCandidate::class));
        $this->assertFalse($this->communityAdminUser->can('createDraft', PoolCandidate::class));
        $this->assertFalse($this->communityTalentCoordinatorUser->can('createDraft', PoolCandidate::class));
    }

    /**
     * Assert that only admin can create a non-draft pool candidate
     *
     * @return void
     */
    public function testCreate()
    {
        $this->assertTrue($this->adminUser->can('create', PoolCandidate::class));

        $this->assertFalse($this->guestUser->can('create', PoolCandidate::class));
        $this->assertFalse($this->candidateUser->can('create', PoolCandidate::class));
        $this->assertFalse($this->applicantUser->can('create', PoolCandidate::class));

        $this->assertFalse($this->processOperatorUser->can('create', PoolCandidate::class));
        $this->assertFalse($this->communityRecruiterUser->can('create', PoolCandidate::class));
        $this->assertFalse($this->communityAdminUser->can('create', PoolCandidate::class));
        $this->assertFalse($this->communityTalentCoordinatorUser->can('create', PoolCandidate::class));
    }

    /**
     * Assert that no roles can update a pool candidate's status, expiry, and bookmark fields
     *
     * @return void
     */
    public function testUpdateStatusLegacy()
    {
        // Ensure candidate is not draft
        $this->poolCandidate->submitted_at = config('constants.past_date');
        $this->poolCandidate->save();

        $this->assertFalse($this->guestUser->can('updateStatusLegacy', $this->poolCandidate));
        $this->assertFalse($this->candidateUser->can('updateStatusLegacy', $this->poolCandidate));
        $this->assertFalse($this->applicantUser->can('updateStatusLegacy', $this->poolCandidate));
        $this->assertFalse($this->adminUser->can('updateStatusLegacy', $this->poolCandidate));
        $this->assertFalse($this->processOperatorUser->can('updateStatusLegacy', $this->poolCandidate));
        $this->assertFalse($this->communityRecruiterUser->can('updateStatusLegacy', $this->poolCandidate));
        $this->assertFalse($this->communityAdminUser->can('updateStatusLegacy', $this->poolCandidate));
        $this->assertFalse($this->communityTalentCoordinatorUser->can('updateStatusLegacy', $this->poolCandidate));
    }

    /**
     * Assert that only owner can update a draft pool candidate
     *
     * @return void
     */
    public function testUpdate()
    {
        // Ensure candidate is not draft
        $this->poolCandidate->submitted_at = config('constants.past_date');
        $this->poolCandidate->save();

        $this->assertFalse($this->guestUser->can('update', $this->poolCandidate));
        $this->assertFalse($this->candidateUser->can('update', $this->poolCandidate));
        $this->assertFalse($this->applicantUser->can('update', $this->poolCandidate));
        $this->assertFalse($this->adminUser->can('update', $this->poolCandidate));

        $this->assertFalse($this->processOperatorUser->can('update', $this->poolCandidate));
        $this->assertFalse($this->communityRecruiterUser->can('update', $this->poolCandidate));
        $this->assertFalse($this->communityAdminUser->can('update', $this->poolCandidate));
        $this->assertFalse($this->communityTalentCoordinatorUser->can('update', $this->poolCandidate));

        // make candidate draft
        $this->poolCandidate->submitted_at = null;
        $this->poolCandidate->save();

        $this->assertFalse($this->guestUser->can('update', $this->poolCandidate));
        $this->assertTrue($this->candidateUser->can('update', $this->poolCandidate));
        $this->assertFalse($this->applicantUser->can('update', $this->poolCandidate));
        $this->assertFalse($this->adminUser->can('update', $this->poolCandidate));

        $this->assertFalse($this->processOperatorUser->can('update', $this->poolCandidate));
        $this->assertFalse($this->communityRecruiterUser->can('update', $this->poolCandidate));
        $this->assertFalse($this->communityAdminUser->can('update', $this->poolCandidate));
        $this->assertFalse($this->communityTalentCoordinatorUser->can('update', $this->poolCandidate));
    }

    /**
     * Assert that only owner can submit a pool candidate
     *
     * @return void
     */
    public function testSubmit()
    {
        $this->assertTrue($this->candidateUser->can('submit', $this->poolCandidate));

        $this->assertFalse($this->guestUser->can('submit', $this->poolCandidate));
        $this->assertFalse($this->applicantUser->can('submit', $this->poolCandidate));
        $this->assertFalse($this->adminUser->can('submit', $this->poolCandidate));

        $this->assertFalse($this->processOperatorUser->can('submit', $this->poolCandidate));
        $this->assertFalse($this->communityRecruiterUser->can('submit', $this->poolCandidate));
        $this->assertFalse($this->communityAdminUser->can('submit', $this->poolCandidate));
        $this->assertFalse($this->communityTalentCoordinatorUser->can('submit', $this->poolCandidate));
    }

    /**
     * Assert that only owner can archive a pool candidate
     *
     * @return void
     */
    public function testArchive()
    {
        $this->assertTrue($this->candidateUser->can('archive', $this->poolCandidate));

        $this->assertFalse($this->guestUser->can('archive', $this->poolCandidate));
        $this->assertFalse($this->applicantUser->can('archive', $this->poolCandidate));
        $this->assertFalse($this->adminUser->can('archive', $this->poolCandidate));

        $this->assertFalse($this->processOperatorUser->can('archive', $this->poolCandidate));
        $this->assertFalse($this->communityRecruiterUser->can('archive', $this->poolCandidate));
        $this->assertFalse($this->communityAdminUser->can('archive', $this->poolCandidate));
        $this->assertFalse($this->communityTalentCoordinatorUser->can('archive', $this->poolCandidate));
    }

    /**
     * Assert that only owner can delete a pool candidate
     *
     * @return void
     */
    public function testDelete()
    {
        $this->assertTrue($this->candidateUser->can('delete', $this->poolCandidate));

        $this->assertFalse($this->guestUser->can('delete', $this->poolCandidate));
        $this->assertFalse($this->applicantUser->can('delete', $this->poolCandidate));
        $this->assertFalse($this->adminUser->can('delete', $this->poolCandidate));

        $this->assertFalse($this->processOperatorUser->can('delete', $this->poolCandidate));
        $this->assertFalse($this->communityRecruiterUser->can('delete', $this->poolCandidate));
        $this->assertFalse($this->communityAdminUser->can('delete', $this->poolCandidate));
        $this->assertFalse($this->communityTalentCoordinatorUser->can('delete', $this->poolCandidate));
    }

    /**
     * Assert that only owner can suspend a pool candidate
     *
     * @return void
     */
    public function testSuspend()
    {
        $this->assertTrue($this->candidateUser->can('suspend', $this->poolCandidate));

        $this->assertFalse($this->guestUser->can('suspend', $this->poolCandidate));
        $this->assertFalse($this->applicantUser->can('suspend', $this->poolCandidate));
        $this->assertFalse($this->adminUser->can('suspend', $this->poolCandidate));

        $this->assertFalse($this->processOperatorUser->can('suspend', $this->poolCandidate));
        $this->assertFalse($this->communityRecruiterUser->can('suspend', $this->poolCandidate));
        $this->assertFalse($this->communityAdminUser->can('suspend', $this->poolCandidate));
        $this->assertFalse($this->communityTalentCoordinatorUser->can('suspend', $this->poolCandidate));
    }

    /**
     * Assert that anyone can count pool candidates
     *
     * @return void
     */
    public function testCount()
    {
        $this->assertTrue($this->candidateUser->can('count', $this->poolCandidate));
        $this->assertTrue($this->guestUser->can('count', $this->poolCandidate));
        $this->assertTrue($this->applicantUser->can('count', $this->poolCandidate));
        $this->assertTrue($this->adminUser->can('count', $this->poolCandidate));

        $this->assertTrue($this->processOperatorUser->can('count', $this->poolCandidate));
        $this->assertTrue($this->communityRecruiterUser->can('count', $this->poolCandidate));
        $this->assertTrue($this->communityAdminUser->can('count', $this->poolCandidate));
        $this->assertTrue($this->communityTalentCoordinatorUser->can('count', $this->poolCandidate));
    }

    /**
     * Assert that the following can flag
     *
     * process operator, community recruiter, community admin
     *
     * @return void
     */
    public function testUpdateFlag()
    {
        $this->assertTrue($this->processOperatorUser->can('updateFlag', $this->poolCandidate));
        $this->assertTrue($this->communityRecruiterUser->can('updateFlag', $this->poolCandidate));
        $this->assertTrue($this->communityAdminUser->can('updateFlag', $this->poolCandidate));

        $this->assertFalse($this->candidateUser->can('updateFlag', $this->poolCandidate));
        $this->assertFalse($this->guestUser->can('updateFlag', $this->poolCandidate));
        $this->assertFalse($this->applicantUser->can('updateFlag', $this->poolCandidate));
        $this->assertFalse($this->adminUser->can('updateFlag', $this->poolCandidate));
        $this->assertFalse($this->communityTalentCoordinatorUser->can('updateFlag', $this->poolCandidate));

        // Cannot flag applications not in their team's pool
        $this->assertFalse($this->processOperatorUser->can('updateFlag', $this->unOwnedPoolCandidate));
        $this->assertFalse($this->communityRecruiterUser->can('updateFlag', $this->unOwnedPoolCandidate));
        $this->assertFalse($this->communityAdminUser->can('updateFlag', $this->unOwnedPoolCandidate));
    }

    /**
     * Assert that the following can view notes
     *
     * platform admin, process operator, community recruiter, community admin
     *
     * @return void
     */
    public function testViewNotes()
    {
        $this->assertTrue($this->processOperatorUser->can('viewNotes', $this->poolCandidate));
        $this->assertTrue($this->communityRecruiterUser->can('viewNotes', $this->poolCandidate));
        $this->assertTrue($this->communityAdminUser->can('viewNotes', $this->poolCandidate));
        $this->assertTrue($this->adminUser->can('viewNotes', $this->poolCandidate));

        $this->assertFalse($this->candidateUser->can('viewNotes', $this->poolCandidate));
        $this->assertFalse($this->guestUser->can('viewNotes', $this->poolCandidate));
        $this->assertFalse($this->applicantUser->can('viewNotes', $this->poolCandidate));
        $this->assertFalse($this->communityTalentCoordinatorUser->can('viewNotes', $this->poolCandidate));

        // Cannot view notes for applications not in their team's pool
        $this->assertFalse($this->processOperatorUser->can('viewNotes', $this->unOwnedPoolCandidate));
        $this->assertFalse($this->communityRecruiterUser->can('viewNotes', $this->unOwnedPoolCandidate));
        $this->assertFalse($this->communityAdminUser->can('viewNotes', $this->unOwnedPoolCandidate));
    }

    /**
     * Assert that the following can update notes
     *
     * process operator, community recruiter, community admin
     *
     * @return void
     */
    public function testUpdateNotes()
    {
        $this->assertTrue($this->processOperatorUser->can('updateNotes', $this->poolCandidate));
        $this->assertTrue($this->communityRecruiterUser->can('updateNotes', $this->poolCandidate));
        $this->assertTrue($this->communityAdminUser->can('updateNotes', $this->poolCandidate));

        $this->assertFalse($this->candidateUser->can('updateNotes', $this->poolCandidate));
        $this->assertFalse($this->guestUser->can('updateNotes', $this->poolCandidate));
        $this->assertFalse($this->applicantUser->can('updateNotes', $this->poolCandidate));
        $this->assertFalse($this->adminUser->can('updateNotes', $this->poolCandidate));
        $this->assertFalse($this->communityTalentCoordinatorUser->can('updateNotes', $this->poolCandidate));

        // Cannot update notes for applications not in their team's pool
        $this->assertFalse($this->processOperatorUser->can('updateNotes', $this->unOwnedPoolCandidate));
        $this->assertFalse($this->communityRecruiterUser->can('updateNotes', $this->unOwnedPoolCandidate));
        $this->assertFalse($this->communityAdminUser->can('updateNotes', $this->unOwnedPoolCandidate));
    }

    /**
     * Assert that the following can view assessments
     *
     * platform admin, process operator, community recruiter, community admin
     *
     * @return void
     */
    public function testViewAssessment()
    {
        $this->assertTrue($this->processOperatorUser->can('viewAssessment', $this->poolCandidate));
        $this->assertTrue($this->communityRecruiterUser->can('viewAssessment', $this->poolCandidate));
        $this->assertTrue($this->communityAdminUser->can('viewAssessment', $this->poolCandidate));
        $this->assertTrue($this->adminUser->can('viewAssessment', $this->poolCandidate));

        $this->assertFalse($this->candidateUser->can('viewAssessment', $this->poolCandidate));
        $this->assertFalse($this->guestUser->can('viewAssessment', $this->poolCandidate));
        $this->assertFalse($this->applicantUser->can('viewAssessment', $this->poolCandidate));
        $this->assertFalse($this->communityTalentCoordinatorUser->can('viewAssessment', $this->poolCandidate));

        // Cannot view assessments for applications not in their team's pool
        $this->assertFalse($this->processOperatorUser->can('viewAssessment', $this->unOwnedPoolCandidate));
        $this->assertFalse($this->communityRecruiterUser->can('viewAssessment', $this->unOwnedPoolCandidate));
        $this->assertFalse($this->communityAdminUser->can('viewAssessment', $this->unOwnedPoolCandidate));
    }

    /**
     * Assert that the following can update assessments
     *
     *  process operator, community recruiter, community admin
     *
     * @return void
     */
    public function testUpdateAssessment()
    {
        $this->assertTrue($this->processOperatorUser->can('updateAssessment', $this->poolCandidate));
        $this->assertTrue($this->communityRecruiterUser->can('updateAssessment', $this->poolCandidate));
        $this->assertTrue($this->communityAdminUser->can('updateAssessment', $this->poolCandidate));

        $this->assertFalse($this->candidateUser->can('updateAssessment', $this->poolCandidate));
        $this->assertFalse($this->guestUser->can('updateAssessment', $this->poolCandidate));
        $this->assertFalse($this->applicantUser->can('updateAssessment', $this->poolCandidate));
        $this->assertFalse($this->adminUser->can('updateAssessment', $this->poolCandidate));
        $this->assertFalse($this->communityTalentCoordinatorUser->can('updateAssessment', $this->poolCandidate));

        // Cannot update assessments for applications not in their team's pool
        $this->assertFalse($this->processOperatorUser->can('updateAssessment', $this->unOwnedPoolCandidate));
        $this->assertFalse($this->communityRecruiterUser->can('updateAssessment', $this->unOwnedPoolCandidate));
        $this->assertFalse($this->communityAdminUser->can('updateAssessment', $this->unOwnedPoolCandidate));
    }

    /**
     * Assert that the following can view decisions
     *
     * platform admin, process operator, community recruiter, community admin
     *
     * @return void
     */
    public function testViewDecision()
    {
        $this->assertTrue($this->processOperatorUser->can('viewDecision', $this->poolCandidate));
        $this->assertTrue($this->communityRecruiterUser->can('viewDecision', $this->poolCandidate));
        $this->assertTrue($this->communityAdminUser->can('viewDecision', $this->poolCandidate));
        $this->assertTrue($this->adminUser->can('viewDecision', $this->poolCandidate));

        $this->assertFalse($this->candidateUser->can('viewDecision', $this->poolCandidate));
        $this->assertFalse($this->guestUser->can('viewDecision', $this->poolCandidate));
        $this->assertFalse($this->applicantUser->can('viewDecision', $this->poolCandidate));
        $this->assertFalse($this->communityTalentCoordinatorUser->can('viewDecision', $this->poolCandidate));

        // Cannot view decisions for applications not in their team's pool
        $this->assertFalse($this->processOperatorUser->can('viewDecision', $this->unOwnedPoolCandidate));
        $this->assertFalse($this->communityRecruiterUser->can('viewDecision', $this->unOwnedPoolCandidate));
        $this->assertFalse($this->communityAdminUser->can('viewDecision', $this->unOwnedPoolCandidate));
    }

    /**
     * Assert that the following can update decisions
     *
     * process operator, community recruiter, community admin
     *
     * @return void
     */
    public function testUpdateDecision()
    {
        $this->assertTrue($this->processOperatorUser->can('updateDecision', $this->poolCandidate));
        $this->assertTrue($this->communityRecruiterUser->can('updateDecision', $this->poolCandidate));
        $this->assertTrue($this->communityAdminUser->can('updateDecision', $this->poolCandidate));

        $this->assertFalse($this->candidateUser->can('updateDecision', $this->poolCandidate));
        $this->assertFalse($this->guestUser->can('updateDecision', $this->poolCandidate));
        $this->assertFalse($this->applicantUser->can('updateDecision', $this->poolCandidate));
        $this->assertFalse($this->adminUser->can('updateDecision', $this->poolCandidate));
        $this->assertFalse($this->communityTalentCoordinatorUser->can('updateDecision', $this->poolCandidate));

        // Cannot update decisions for applications not in their team's pool
        $this->assertFalse($this->processOperatorUser->can('updateDecision', $this->unOwnedPoolCandidate));
        $this->assertFalse($this->communityRecruiterUser->can('updateDecision', $this->unOwnedPoolCandidate));
        $this->assertFalse($this->communityAdminUser->can('updateDecision', $this->unOwnedPoolCandidate));
    }

    /**
     * Assert that the following can view placement
     *
     * platform admin, process operator, community recruiter, community admin
     *
     * @return void
     */
    public function testViewPlacement()
    {
        $this->assertTrue($this->processOperatorUser->can('viewPlacement', $this->poolCandidate));
        $this->assertTrue($this->communityRecruiterUser->can('viewPlacement', $this->poolCandidate));
        $this->assertTrue($this->communityAdminUser->can('viewPlacement', $this->poolCandidate));
        $this->assertTrue($this->adminUser->can('viewPlacement', $this->poolCandidate));

        $this->assertFalse($this->candidateUser->can('viewPlacement', $this->poolCandidate));
        $this->assertFalse($this->guestUser->can('viewPlacement', $this->poolCandidate));
        $this->assertFalse($this->applicantUser->can('viewPlacement', $this->poolCandidate));
        $this->assertFalse($this->communityTalentCoordinatorUser->can('viewPlacement', $this->poolCandidate));

        // Cannot view placements for applications not in their team's pool
        $this->assertFalse($this->processOperatorUser->can('viewPlacement', $this->unOwnedPoolCandidate));
        $this->assertFalse($this->communityRecruiterUser->can('viewPlacement', $this->unOwnedPoolCandidate));
        $this->assertFalse($this->communityAdminUser->can('viewPlacement', $this->unOwnedPoolCandidate));
    }

    /**
     * Assert that the following can update placements
     *
     * community recruiter, community admin
     *
     * @return void
     */
    public function testUpdatePlacement()
    {
        $this->assertTrue($this->communityRecruiterUser->can('updatePlacement', $this->poolCandidate));
        $this->assertTrue($this->communityAdminUser->can('updatePlacement', $this->poolCandidate));

        $this->assertFalse($this->candidateUser->can('updatePlacement', $this->poolCandidate));
        $this->assertFalse($this->guestUser->can('updatePlacement', $this->poolCandidate));
        $this->assertFalse($this->applicantUser->can('updatePlacement', $this->poolCandidate));
        $this->assertFalse($this->adminUser->can('updatePlacement', $this->poolCandidate));
        $this->assertFalse($this->processOperatorUser->can('updatePlacement', $this->poolCandidate));
        $this->assertFalse($this->communityTalentCoordinatorUser->can('updatePlacement', $this->poolCandidate));

        // Cannot update placements for applications not in their team's pool
        $this->assertFalse($this->processOperatorUser->can('updatePlacement', $this->unOwnedPoolCandidate));
        $this->assertFalse($this->communityRecruiterUser->can('updatePlacement', $this->unOwnedPoolCandidate));
        $this->assertFalse($this->communityAdminUser->can('updatePlacement', $this->unOwnedPoolCandidate));
    }

    /**
     * Assert that the policy method references the correct subsequent method for a given input status
     * testing process operator, community recruiter, community admin
     *
     * @return void
     */
    public function testUpdateStatus()
    {
        // test all the statuses
        // grouped similar statuses to condense this blob

        $this->assertFalse($this->processOperatorUser->can(
            'updateStatus',
            [$this->poolCandidate, ['application_status' => ApplicationStatus::DRAFT->name]]));
        $this->assertFalse($this->communityRecruiterUser->can(
            'updateStatus',
            [$this->poolCandidate, ['application_status' => ApplicationStatus::DRAFT->name]]));
        $this->assertFalse($this->communityAdminUser->can(
            'updateStatus',
            [$this->poolCandidate, ['application_status' => ApplicationStatus::DRAFT->name]]));

        $placementTypes = PlacementType::cases();
        foreach ($placementTypes as $placementType) {
            $this->assertFalse($this->processOperatorUser->can(
                'updateStatus',
                [$this->poolCandidate, ['placement_type' => $placementType->name]]));
            $this->assertTrue($this->communityRecruiterUser->can(
                'updateStatus',
                [$this->poolCandidate, ['placement_type' => $placementType->name]]));
            $this->assertTrue($this->communityAdminUser->can(
                'updateStatus',
                [$this->poolCandidate, ['placement_type' => $placementType->name]]));
        }

        $this->assertTrue($this->processOperatorUser->can(
            'updateStatus',
            [$this->poolCandidate, ['application_status' => ApplicationStatus::TO_ASSESS->name]]));
        $this->assertTrue($this->communityRecruiterUser->can(
            'updateStatus',
            [$this->poolCandidate, ['application_status' => ApplicationStatus::TO_ASSESS->name]]));
        $this->assertTrue($this->communityAdminUser->can(
            'updateStatus',
            [$this->poolCandidate, ['application_status' => ApplicationStatus::TO_ASSESS->name]]));

        $removedDisqualifiedStatuses = [
            ApplicationStatus::REMOVED->name,
            ApplicationStatus::DISQUALIFIED->name,
        ];
        foreach ($removedDisqualifiedStatuses as $removedDisqualifiedStatus) {
            $this->assertTrue($this->processOperatorUser->can(
                'updateStatus',
                [$this->poolCandidate, ['application_status' => $removedDisqualifiedStatus]]));
            $this->assertTrue($this->communityRecruiterUser->can(
                'updateStatus',
                [$this->poolCandidate, ['application_status' => $removedDisqualifiedStatus]]));
            $this->assertTrue($this->communityAdminUser->can(
                'updateStatus',
                [$this->poolCandidate, ['application_status' => $removedDisqualifiedStatus]]));
        }

        $this->assertTrue($this->processOperatorUser->can(
            'updateStatus',
            [$this->poolCandidate, ['application_status' => ApplicationStatus::QUALIFIED->name]]));
        $this->assertTrue($this->communityRecruiterUser->can(
            'updateStatus',
            [$this->poolCandidate, ['application_status' => ApplicationStatus::QUALIFIED->name]]));
        $this->assertTrue($this->communityAdminUser->can(
            'updateStatus',
            [$this->poolCandidate, ['application_status' => ApplicationStatus::QUALIFIED->name]]));

    }

    /**
     * Assert that the policy method handles expiry date input
     * testing process operator, community recruiter, community admin
     *
     * @return void
     */
    public function testUpdatePoolCandidateStatusParentOnlyExpiry()
    {
        // test policy again with just an expiry date
        $this->assertTrue($this->processOperatorUser->can(
            'updateDecision',
            [$this->poolCandidate, ['expiry_date' => '2000-01-01']]));
        $this->assertTrue($this->communityRecruiterUser->can(
            'updateDecision',
            [$this->poolCandidate, ['expiry_date' => '2000-01-01']]));
        $this->assertTrue($this->communityAdminUser->can(
            'updateDecision',
            [$this->poolCandidate, ['expiry_date' => '2000-01-01']]));
        $this->assertFalse($this->adminUser->can(
            'updateDecision',
            [$this->poolCandidate, ['expiry_date' => '2000-01-01']]));
    }
}
