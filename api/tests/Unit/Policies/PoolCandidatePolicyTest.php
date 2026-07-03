<?php

namespace Tests\Unit\Policies;

use App\Enums\ApplicationStatus;
use App\Enums\PlacementType;
use App\Models\Community;
use App\Models\Department;
use App\Models\Pool;
use App\Models\PoolCandidate;
use App\Models\User;
use App\Policies\PoolCandidatePolicy;
use PHPUnit\Framework\Attributes\DataProvider;

class PoolCandidatePolicyTest extends PolicyTestCase
{
    protected PoolCandidatePolicy $policy;

    protected Pool $primaryPool;

    protected PoolCandidate $submittedCandidate;

    protected function setUp(): void
    {
        parent::setUp();
        $this->policy = new PoolCandidatePolicy();
        $this->primaryPool = Pool::factory()
            ->for(Community::factory()->create())
            ->for(Department::factory()->create())
            ->create();
        $this->submittedCandidate = PoolCandidate::factory()
            ->for($this->primaryPool)
            ->create(['submitted_at' => now()]);
    }

    // --- viewAny() / count() ---

    public function testViewAnyAlwaysReturnsFalse(): void
    {
        $this->assertFalse($this->policy->viewAny());
    }

    public function testCountAlwaysReturnsTrue(): void
    {
        $this->assertTrue($this->policy->count());
    }

    // --- createDraft() / create() ---

    public function testApplicantCanCreateDraftApplication(): void
    {
        $applicant = User::factory()->asApplicant()->create();
        $this->assertTrue($this->ensureBool($this->policy->createDraft($applicant)));
    }

    public function testPlatformAdminCanCreateApplicationDirectly(): void
    {
        $admin = User::factory()->asAdmin()->create();
        $this->assertTrue($this->ensureBool($this->policy->create($admin)));
    }

    // --- Own-resource methods ---

    public function testOwnerCanViewTheirOwnApplication(): void
    {
        $owner = User::factory()->asApplicant()->create();
        $candidate = PoolCandidate::factory()->for($owner)->for($this->primaryPool)->create();

        $this->assertTrue($this->ensureBool($this->policy->view($owner, $candidate)));
    }

    public function testOwnerCanManageDraftApplication(): void
    {
        $owner = User::factory()->asApplicant()->create();
        $draft = PoolCandidate::factory()->for($owner)->for($this->primaryPool)->create(['submitted_at' => null]);

        $this->assertTrue($this->ensureBool($this->policy->update($owner, $draft)));
        $this->assertTrue($this->ensureBool($this->policy->submit($owner, $draft)));
        $this->assertTrue($this->ensureBool($this->policy->delete($owner, $draft)));
    }

    public function testOwnerCannotChangeSubmittedApplication(): void
    {
        $owner = User::factory()->asApplicant()->create();
        $submitted = PoolCandidate::factory()->for($owner)->for($this->primaryPool)->create(['submitted_at' => config('constants.past_date')]);

        $this->assertFalse($this->ensureBool($this->policy->update($owner, $submitted)));
        $this->assertFalse($this->ensureBool($this->policy->delete($owner, $submitted)));
    }

    public function testOwnerCanArchiveAndSuspendSubmittedApplication(): void
    {
        $owner = User::factory()->asApplicant()->create();
        $submitted = PoolCandidate::factory()->for($owner)->for($this->primaryPool)->create(['submitted_at' => now()]);

        $this->assertTrue($this->ensureBool($this->policy->archive($owner, $submitted)));
        $this->assertTrue($this->ensureBool($this->policy->suspend($owner, $submitted)));
    }

    public function testOwnerCanViewTheirOwnApplicationStatus(): void
    {
        $owner = User::factory()->asApplicant()->create();
        $candidate = PoolCandidate::factory()->for($owner)->for($this->primaryPool)->create();

        $this->assertTrue($this->ensureBool($this->policy->viewApplicationStatus($owner, $candidate)));
    }

    public function testNonOwnerCannotModifyOrSubmitApplication(): void
    {
        $otherUser = User::factory()->asApplicant()->create();

        $this->assertFalse($this->ensureBool($this->policy->update($otherUser, $this->submittedCandidate)));
        $this->assertFalse($this->ensureBool($this->policy->submit($otherUser, $this->submittedCandidate)));
        $this->assertFalse($this->ensureBool($this->policy->delete($otherUser, $this->submittedCandidate)));
        $this->assertFalse($this->ensureBool($this->policy->archive($otherUser, $this->submittedCandidate)));
        $this->assertFalse($this->ensureBool($this->policy->suspend($otherUser, $this->submittedCandidate)));
    }

    // --- Platform admin global view access ---

    public function testPlatformAdminCanViewAllApplicationSubResources(): void
    {
        $admin = User::factory()->asAdmin()->create();

        $this->assertTrue($this->ensureBool($this->policy->view($admin, $this->submittedCandidate)));
        $this->assertTrue($this->ensureBool($this->policy->viewApplicationStatus($admin, $this->submittedCandidate)));
        $this->assertTrue($this->ensureBool($this->policy->viewApplicationAssessment($admin, $this->submittedCandidate)));
        $this->assertTrue($this->ensureBool($this->policy->viewAssessment($admin, $this->submittedCandidate)));
        $this->assertTrue($this->ensureBool($this->policy->viewDecision($admin, $this->submittedCandidate)));
        $this->assertTrue($this->ensureBool($this->policy->viewPlacement($admin, $this->submittedCandidate)));
    }

    public function testPlatformAdminCannotUpdateApplicationSubResources(): void
    {
        // Platform admin has view-any-* but not update-any-* for application sub-resources
        $admin = User::factory()->asAdmin()->create();

        $this->assertFalse($this->ensureBool($this->policy->updateFlag($admin, $this->submittedCandidate)));
        $this->assertFalse($this->ensureBool($this->policy->updateNotes($admin, $this->submittedCandidate)));
        $this->assertFalse($this->ensureBool($this->policy->updateAssessment($admin, $this->submittedCandidate)));
        $this->assertFalse($this->ensureBool($this->policy->updateDecision($admin, $this->submittedCandidate)));
        $this->assertFalse($this->ensureBool($this->policy->updatePlacement($admin, $this->submittedCandidate)));
        $this->assertFalse($this->ensureBool($this->policy->updateReferrals($admin, $this->submittedCandidate)));
    }

    // --- Team-based view access ---

    #[DataProvider('allTeamRolesProvider')]
    public function testAllTeamRolesCanViewSubmittedApplicationAndStatus(string $factoryMethod): void
    {
        $user = $this->createContextualUser($factoryMethod, $this->primaryPool);

        $this->assertTrue($this->ensureBool($this->policy->view($user, $this->submittedCandidate)));
        $this->assertTrue($this->ensureBool($this->policy->viewApplicationStatus($user, $this->submittedCandidate)));
    }

    #[DataProvider('allTeamRolesProvider')]
    public function testAllTeamRolesCanViewAndUpdateAssessment(string $factoryMethod): void
    {
        $user = $this->createContextualUser($factoryMethod, $this->primaryPool);

        $this->assertTrue($this->ensureBool($this->policy->viewApplicationAssessment($user, $this->submittedCandidate)));
        $this->assertTrue($this->ensureBool($this->policy->updateFlag($user, $this->submittedCandidate)));
        $this->assertTrue($this->ensureBool($this->policy->updateNotes($user, $this->submittedCandidate)));
        $this->assertTrue($this->ensureBool($this->policy->viewAssessment($user, $this->submittedCandidate)));
        $this->assertTrue($this->ensureBool($this->policy->updateAssessment($user, $this->submittedCandidate)));
    }

    #[DataProvider('allTeamRolesProvider')]
    public function testAllTeamRolesCanViewAndUpdateDecision(string $factoryMethod): void
    {
        $user = $this->createContextualUser($factoryMethod, $this->primaryPool);

        $this->assertTrue($this->ensureBool($this->policy->viewDecision($user, $this->submittedCandidate)));
        $this->assertTrue($this->ensureBool($this->policy->updateDecision($user, $this->submittedCandidate)));
        $this->assertTrue($this->ensureBool($this->policy->updateReferrals($user, $this->submittedCandidate)));
    }

    #[DataProvider('allTeamRolesProvider')]
    public function testAllTeamRolesCanViewPlacement(string $factoryMethod): void
    {
        $user = $this->createContextualUser($factoryMethod, $this->primaryPool);
        $this->assertTrue($this->ensureBool($this->policy->viewPlacement($user, $this->submittedCandidate)));
    }

    // --- updatePlacement: process_operator lacks update-team-applicationPlacement ---

    public static function rolesWithPlacementUpdateProvider(): array
    {
        return [
            'community recruiter' => ['asCommunityRecruiter'],
            'community admin' => ['asCommunityAdmin'],
            'department admin' => ['asDepartmentAdmin'],
            'department HR advisor' => ['asDepartmentHRAdvisor'],
        ];
    }

    #[DataProvider('rolesWithPlacementUpdateProvider')]
    public function testRolesWithPlacementPermissionCanUpdatePlacement(string $factoryMethod): void
    {
        $user = $this->createContextualUser($factoryMethod, $this->primaryPool);
        $this->assertTrue($this->ensureBool($this->policy->updatePlacement($user, $this->submittedCandidate)));
    }

    public function testProcessOperatorCannotUpdatePlacement(): void
    {
        $user = $this->createContextualUser('asProcessOperator', $this->primaryPool);
        $this->assertFalse($this->ensureBool($this->policy->updatePlacement($user, $this->submittedCandidate)));
    }

    // --- updateStatusLegacy ---
    // update-team-applicationStatus and update-any-applicationStatus are not assigned to any role;
    // setting status back to DRAFT is not a valid operation.

    #[DataProvider('allTeamRolesProvider')]
    public function testNoRoleCanUpdateStatusLegacy(string $factoryMethod): void
    {
        $user = $this->createContextualUser($factoryMethod, $this->primaryPool);
        $this->assertFalse($this->ensureBool($this->policy->updateStatusLegacy($user, $this->submittedCandidate)));
    }

    // --- updateStatus dispatcher ---

    public function testUpdateStatusDispatchesToUpdatePlacementWhenPlacementTypeProvided(): void
    {
        $recruiter = $this->createContextualUser('asCommunityRecruiter', $this->primaryPool);
        $args = ['placement_type' => PlacementType::PLACED_ACTING->name];

        $this->assertTrue($this->ensureBool($this->policy->updateStatus($recruiter, $this->submittedCandidate, $args)));
    }

    public function testUpdateStatusDispatchesToUpdateDecisionForNonDraftStatus(): void
    {
        $operator = $this->createContextualUser('asProcessOperator', $this->primaryPool);
        $args = ['application_status' => ApplicationStatus::QUALIFIED->name];

        $this->assertTrue($this->ensureBool($this->policy->updateStatus($operator, $this->submittedCandidate, $args)));
    }

    public function testUpdateStatusDispatchesToUpdateDecisionForExpiryDate(): void
    {
        $operator = $this->createContextualUser('asProcessOperator', $this->primaryPool);
        $args = ['expiry_date' => now()->addYear()->toDateString()];

        $this->assertTrue($this->ensureBool($this->policy->updateStatus($operator, $this->submittedCandidate, $args)));
    }

    public function testUpdateStatusReturnsFalseForEmptyArgs(): void
    {
        $operator = $this->createContextualUser('asProcessOperator', $this->primaryPool);
        $this->assertFalse($this->ensureBool($this->policy->updateStatus($operator, $this->submittedCandidate, [])));
    }

    // --- Denied on different pool ---

    #[DataProvider('allTeamRolesProvider')]
    public function testTeamRolesDeniedAllAccessOnDifferentPool(string $factoryMethod): void
    {
        $otherPool = Pool::factory()
            ->for(Community::factory()->create())
            ->for(Department::factory()->create())
            ->create();
        $user = $this->createContextualUser($factoryMethod, $otherPool);

        $this->assertFalse($this->ensureBool($this->policy->view($user, $this->submittedCandidate)));
        $this->assertFalse($this->ensureBool($this->policy->viewApplicationStatus($user, $this->submittedCandidate)));
        $this->assertFalse($this->ensureBool($this->policy->viewApplicationAssessment($user, $this->submittedCandidate)));
        $this->assertFalse($this->ensureBool($this->policy->viewAssessment($user, $this->submittedCandidate)));
        $this->assertFalse($this->ensureBool($this->policy->viewDecision($user, $this->submittedCandidate)));
        $this->assertFalse($this->ensureBool($this->policy->viewPlacement($user, $this->submittedCandidate)));
        $this->assertFalse($this->ensureBool($this->policy->updateFlag($user, $this->submittedCandidate)));
        $this->assertFalse($this->ensureBool($this->policy->updateNotes($user, $this->submittedCandidate)));
        $this->assertFalse($this->ensureBool($this->policy->updateAssessment($user, $this->submittedCandidate)));
        $this->assertFalse($this->ensureBool($this->policy->updateDecision($user, $this->submittedCandidate)));
        $this->assertFalse($this->ensureBool($this->policy->updatePlacement($user, $this->submittedCandidate)));
        $this->assertFalse($this->ensureBool($this->policy->updateReferrals($user, $this->submittedCandidate)));
    }

    // --- createSpecialApplication() ---

    #[DataProvider('allTeamRolesProvider')]
    public function testTeamRolesCannotCreateSpecialApplication(string $factoryMethod): void
    {
        $user = $this->createContextualUser($factoryMethod, $this->primaryPool);
        $this->assertFalse($this->ensureBool($this->policy->createSpecialApplication($user)));
    }

    public function testPlatformAdminCanCreateSpecialApplication(): void
    {
        $admin = User::factory()->asAdmin()->create();
        $this->assertTrue($this->ensureBool($this->policy->createSpecialApplication($admin)));
    }
}
