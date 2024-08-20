<?php

namespace Tests\Unit;

use App\Facades\Notify;
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

    protected $poolOperatorUser;

    protected $requestResponderUser;

    protected $communityManagerUser;

    protected $adminUser;

    protected $team;

    protected $basePool;

    protected $teamPool;

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

        $this->team = Team::factory()->create(['name' => 'test-team']);
        $this->poolOperatorUser = User::factory()
            ->asPoolOperator($this->team->name)
            ->create([
                'email' => 'pool-operator-user@test.com',
                'sub' => 'pool-operator-user@test.com',
            ]);

        $this->requestResponderUser = User::factory()
            ->asRequestResponder()
            ->create([
                'email' => 'request-responder-user@test.com',
                'sub' => 'request-responder-user@test.com',
            ]);

        $this->communityManagerUser = User::factory()
            ->asCommunityManager()
            ->create([
                'email' => 'community-manager-user@test.com',
                'sub' => 'community-manager-user@test.com',
            ]);

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
            'user_id' => $this->poolOperatorUser->id,
            'team_id' => $this->team->id,
        ]);

        $this->poolCandidate = PoolCandidate::factory()->create([
            'user_id' => $this->candidateUser->id,
            'pool_id' => $this->teamPool->id,
        ]);

        $noTeamUser = User::factory()->create();
        $noUsersTeam = Team::factory()->create();
        $noTeamPool = Pool::factory(['team_id' => $noUsersTeam->id])->create();

        $this->unOwnedPoolCandidate = PoolCandidate::factory()->create([
            'pool_id' => $noTeamPool->id,
            'user_id' => $noTeamUser->id,
            'submitted_at' => config('constants.past_date'),
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
        $this->assertFalse($this->poolOperatorUser->can('viewAny', PoolCandidate::class));
        $this->assertFalse($this->requestResponderUser->can('viewAny', PoolCandidate::class));
        $this->assertFalse($this->communityManagerUser->can('viewAny', PoolCandidate::class));
        $this->assertFalse($this->adminUser->can('viewAny', PoolCandidate::class));
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
        $this->assertFalse($this->poolOperatorUser->can('view', $this->poolCandidate));
        $this->assertFalse($this->requestResponderUser->can('view', $this->poolCandidate));
        $this->assertFalse($this->communityManagerUser->can('view', $this->poolCandidate));
        $this->assertFalse($this->adminUser->can('view', $this->poolCandidate));
    }

    /**
     * Assert that the following can view a submitted pool candidate:
     *
     * owner, pool operator, request responder, platform admin
     *
     * @return void
     */
    public function testViewSubmitted()
    {
        $this->poolCandidate->submitted_at = config('constants.past_date');
        $this->poolCandidate->save();

        $this->assertTrue($this->candidateUser->can('view', $this->poolCandidate));
        $this->assertTrue($this->poolOperatorUser->can('view', $this->poolCandidate));
        $this->assertTrue($this->requestResponderUser->can('view', $this->poolCandidate));
        $this->assertTrue($this->adminUser->can('view', $this->poolCandidate));

        $this->assertFalse($this->communityManagerUser->can('view', $this->poolCandidate));
        $this->assertFalse($this->guestUser->can('view', $this->poolCandidate));
        $this->assertFalse($this->applicantUser->can('view', $this->poolCandidate));
        // Pool operator cannot view submitted applications not in their teams pool
        $this->assertFalse($this->poolOperatorUser->can('view', $this->unOwnedPoolCandidate));
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
        $this->assertFalse($this->poolOperatorUser->can('createDraft', PoolCandidate::class));
        $this->assertFalse($this->requestResponderUser->can('createDraft', PoolCandidate::class));
        $this->assertFalse($this->communityManagerUser->can('createDraft', PoolCandidate::class));
        $this->assertFalse($this->adminUser->can('createDraft', PoolCandidate::class));
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
        $this->assertFalse($this->poolOperatorUser->can('create', PoolCandidate::class));
        $this->assertFalse($this->requestResponderUser->can('create', PoolCandidate::class));
        $this->assertFalse($this->communityManagerUser->can('create', PoolCandidate::class));
    }

    /**
     * Assert that a pool operator or request responder can update a pool candidate's status, expiry, and bookmark fields
     *
     * @return void
     */
    public function testUpdateStatus()
    {
        // Ensure candidate is not draft
        $this->poolCandidate->submitted_at = config('constants.past_date');
        $this->poolCandidate->save();

        $this->assertTrue($this->poolOperatorUser->can('updateStatus', $this->poolCandidate));
        $this->assertTrue($this->requestResponderUser->can('updateStatus', $this->poolCandidate));

        $this->assertFalse($this->guestUser->can('updateStatus', $this->poolCandidate));
        $this->assertFalse($this->candidateUser->can('updateStatus', $this->poolCandidate));
        $this->assertFalse($this->applicantUser->can('updateStatus', $this->poolCandidate));
        $this->assertFalse($this->communityManagerUser->can('updateStatus', $this->poolCandidate));
        $this->assertFalse($this->adminUser->can('updateStatus', $this->poolCandidate));
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

        $this->assertFalse($this->poolOperatorUser->can('update', $this->poolCandidate));

        $this->assertFalse($this->guestUser->can('update', $this->poolCandidate));
        $this->assertFalse($this->candidateUser->can('update', $this->poolCandidate));
        $this->assertFalse($this->applicantUser->can('update', $this->poolCandidate));
        $this->assertFalse($this->requestResponderUser->can('update', $this->poolCandidate));
        $this->assertFalse($this->communityManagerUser->can('update', $this->poolCandidate));
        $this->assertFalse($this->adminUser->can('update', $this->poolCandidate));

        // make candidate draft
        $this->poolCandidate->submitted_at = null;
        $this->poolCandidate->save();

        $this->assertFalse($this->poolOperatorUser->can('update', $this->poolCandidate));
        $this->assertFalse($this->guestUser->can('update', $this->poolCandidate));
        $this->assertTrue($this->candidateUser->can('update', $this->poolCandidate));
        $this->assertFalse($this->applicantUser->can('update', $this->poolCandidate));
        $this->assertFalse($this->requestResponderUser->can('update', $this->poolCandidate));
        $this->assertFalse($this->communityManagerUser->can('update', $this->poolCandidate));
        $this->assertFalse($this->adminUser->can('update', $this->poolCandidate));
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
        $this->assertFalse($this->poolOperatorUser->can('submit', $this->poolCandidate));
        $this->assertFalse($this->requestResponderUser->can('submit', $this->poolCandidate));
        $this->assertFalse($this->communityManagerUser->can('submit', $this->poolCandidate));
        $this->assertFalse($this->adminUser->can('submit', $this->poolCandidate));
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
        $this->assertFalse($this->poolOperatorUser->can('archive', $this->poolCandidate));
        $this->assertFalse($this->requestResponderUser->can('archive', $this->poolCandidate));
        $this->assertFalse($this->communityManagerUser->can('archive', $this->poolCandidate));
        $this->assertFalse($this->adminUser->can('archive', $this->poolCandidate));
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
        $this->assertFalse($this->poolOperatorUser->can('delete', $this->poolCandidate));
        $this->assertFalse($this->requestResponderUser->can('delete', $this->poolCandidate));
        $this->assertFalse($this->communityManagerUser->can('delete', $this->poolCandidate));
        $this->assertFalse($this->adminUser->can('delete', $this->poolCandidate));
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
        $this->assertFalse($this->poolOperatorUser->can('suspend', $this->poolCandidate));
        $this->assertFalse($this->requestResponderUser->can('suspend', $this->poolCandidate));
        $this->assertFalse($this->communityManagerUser->can('suspend', $this->poolCandidate));
        $this->assertFalse($this->adminUser->can('suspend', $this->poolCandidate));
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
        $this->assertTrue($this->poolOperatorUser->can('count', $this->poolCandidate));
        $this->assertTrue($this->requestResponderUser->can('count', $this->poolCandidate));
        $this->assertTrue($this->communityManagerUser->can('count', $this->poolCandidate));
        $this->assertTrue($this->adminUser->can('count', $this->poolCandidate));
    }
}
