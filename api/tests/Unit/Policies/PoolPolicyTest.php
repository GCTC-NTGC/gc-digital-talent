<?php

namespace Tests\Unit\Policies;

use App\Models\Community;
use App\Models\Department;
use App\Models\Pool;
use App\Models\User;
use App\Policies\PoolPolicy;
use PHPUnit\Framework\Attributes\DataProvider;

class PoolPolicyTest extends PolicyTestCase
{
    protected PoolPolicy $policy;

    protected Pool $primaryPool;

    protected Pool $unrelatedPool;

    protected function setUp(): void
    {
        parent::setUp();
        $this->policy = new PoolPolicy();
        $this->primaryPool = Pool::factory()
            ->for(Community::factory()->create())
            ->for(Department::factory()->create())
            ->create();
        $this->unrelatedPool = Pool::factory()
            ->for(Community::factory()->create())
            ->for(Department::factory()->create())
            ->create();
    }

    // --- viewAny() ---

    public function testPlatformAdminCanViewAnyPool(): void
    {
        $admin = User::factory()->asAdmin()->create();
        $this->assertTrue($this->ensureBool($this->policy->viewAny($admin)));
    }

    public function testApplicantCannotViewAnyPool(): void
    {
        $applicant = User::factory()->asApplicant()->create();
        $this->assertFalse($this->ensureBool($this->policy->viewAny($applicant)));
    }

    // --- viewAnyPublished() ---

    public function testViewAnyPublishedAlwaysReturnsTrue(): void
    {
        $this->assertTrue($this->ensureBool($this->policy->viewAnyPublished(null)));
        $this->assertTrue($this->ensureBool($this->policy->viewAnyPublished(User::factory()->asGuest()->create())));
    }

    // --- view() ---

    public function testPublishedPoolIsVisibleToEveryone(): void
    {
        $publishedPool = Pool::factory()->published()->create();

        $this->assertTrue($this->ensureBool($this->policy->view(null, $publishedPool)));
        $this->assertTrue($this->ensureBool($this->policy->view(User::factory()->asGuest()->create(), $publishedPool)));
    }

    public function testUnauthenticatedUserCannotViewDraftPool(): void
    {
        $this->assertFalse($this->ensureBool($this->policy->view(null, $this->primaryPool)));
    }

    public function testPlatformAdminCanViewDraftPool(): void
    {
        $admin = User::factory()->asAdmin()->create();
        $this->assertTrue($this->ensureBool($this->policy->view($admin, $this->primaryPool)));
    }

    #[DataProvider('allTeamRolesProvider')]
    public function testTeamRolesCanViewDraftPool(string $factoryMethod): void
    {
        $user = $this->createContextualUser($factoryMethod, $this->primaryPool);
        $this->assertTrue($this->ensureBool($this->policy->view($user, $this->primaryPool)));
    }

    public function testApplicantCannotViewDraftPool(): void
    {
        $applicant = User::factory()->asApplicant()->create();
        $this->assertFalse($this->ensureBool($this->policy->view($applicant, $this->primaryPool)));
    }

    #[DataProvider('allTeamRolesProvider')]
    public function testTeamRolesDeniedViewDraftPoolOnDifferentPool(string $factoryMethod): void
    {
        $otherPool = Pool::factory()
            ->for(Community::factory()->create())
            ->for(Department::factory()->create())
            ->create();
        $user = $this->createContextualUser($factoryMethod, $otherPool);

        $this->assertFalse($this->ensureBool($this->policy->view($user, $this->primaryPool)));
    }

    // --- create() ---

    public function testCreateReturnsFalseWhenDepartmentIdMissing(): void
    {
        $recruiter = $this->createContextualUser('asCommunityRecruiter', $this->primaryPool);
        $this->assertFalse($this->ensureBool($this->policy->create($recruiter, [])));
    }

    public static function communityRolesCanCreateProvider(): array
    {
        return [
            'community recruiter' => ['asCommunityRecruiter'],
            'community admin' => ['asCommunityAdmin'],
        ];
    }

    #[DataProvider('communityRolesCanCreateProvider')]
    public function testCommunityRolesCanCreatePoolViaCommunityTeam(string $factoryMethod): void
    {
        $user = $this->createContextualUser($factoryMethod, $this->primaryPool);
        $request = [
            'community_id' => $this->primaryPool->community_id,
            'department' => ['connect' => $this->primaryPool->department_id],
        ];

        $this->assertTrue($this->ensureBool($this->policy->create($user, $request)));
    }

    public static function departmentRolesCanCreateProvider(): array
    {
        return [
            'department admin' => ['asDepartmentAdmin'],
            'department HR advisor' => ['asDepartmentHRAdvisor'],
        ];
    }

    #[DataProvider('departmentRolesCanCreateProvider')]
    public function testDepartmentRolesCanCreatePoolViaDepartmentTeam(string $factoryMethod): void
    {
        $user = $this->createContextualUser($factoryMethod, $this->primaryPool);
        $request = ['department' => ['connect' => $this->primaryPool->department_id]];

        $this->assertTrue($this->ensureBool($this->policy->create($user, $request)));
    }

    public function testProcessOperatorCannotCreatePool(): void
    {
        $user = $this->createContextualUser('asProcessOperator', $this->primaryPool);
        $request = [
            'community_id' => $this->primaryPool->community_id,
            'department' => ['connect' => $this->primaryPool->department_id],
        ];

        $this->assertFalse($this->ensureBool($this->policy->create($user, $request)));
    }

    public function testApplicantCannotCreatePool(): void
    {
        $applicant = User::factory()->asApplicant()->create();
        $request = [
            'community_id' => $this->primaryPool->community_id,
            'department' => ['connect' => $this->primaryPool->department_id],
        ];

        $this->assertFalse($this->ensureBool($this->policy->create($applicant, $request)));
    }

    #[DataProvider('communityRolesCanCreateProvider')]
    public function testCommunityRolesDeniedCreatePoolForDifferentCommunity(string $factoryMethod): void
    {
        $otherPool = Pool::factory()
            ->for(Community::factory()->create())
            ->for(Department::factory()->create())
            ->create();

        $user = $this->createContextualUser($factoryMethod, $otherPool);

        $request = [
            'community_id' => $this->primaryPool->community_id,
            'department' => ['connect' => $this->primaryPool->department_id],
        ];

        $this->assertFalse($this->ensureBool($this->policy->create($user, $request)));
    }

    #[DataProvider('departmentRolesCanCreateProvider')]
    public function testDepartmentRolesDeniedCreatePoolForDifferentDepartment(string $factoryMethod): void
    {
        $otherPool = Pool::factory()
            ->for(Community::factory()->create())
            ->for(Department::factory()->create())
            ->create();

        $user = $this->createContextualUser($factoryMethod, $otherPool);

        $request = [
            'department' => ['connect' => $this->primaryPool->department_id],
        ];

        $this->assertFalse($this->ensureBool($this->policy->create($user, $request)));
    }

    // --- duplicate() ---

    public static function rolesWithCreatePermissionProvider(): array
    {
        return [
            'community recruiter' => ['asCommunityRecruiter'],
            'community admin' => ['asCommunityAdmin'],
            'department admin' => ['asDepartmentAdmin'],
            'department HR advisor' => ['asDepartmentHRAdvisor'],
        ];
    }

    #[DataProvider('rolesWithCreatePermissionProvider')]
    public function testRolesWithCreatePermissionCanDuplicatePool(string $factoryMethod): void
    {
        $user = $this->createContextualUser($factoryMethod, $this->primaryPool);
        $this->assertTrue($this->ensureBool($this->policy->duplicate($user, ['id' => $this->primaryPool->id])));
    }

    public function testProcessOperatorCannotDuplicatePool(): void
    {
        $user = $this->createContextualUser('asProcessOperator', $this->primaryPool);
        $this->assertFalse($this->ensureBool($this->policy->duplicate($user, ['id' => $this->primaryPool->id])));
    }

    public function testApplicantCannotDuplicatePool(): void
    {
        $applicant = User::factory()->asApplicant()->create();
        $this->assertFalse($this->ensureBool($this->policy->duplicate($applicant, ['id' => $this->primaryPool->id])));
    }

    // --- updateDraft() ---

    #[DataProvider('allTeamRolesProvider')]
    public function testTeamRolesCanUpdateDraftPool(string $factoryMethod): void
    {
        $user = $this->createContextualUser($factoryMethod, $this->primaryPool);
        $this->assertTrue($this->ensureBool($this->policy->updateDraft($user, $this->primaryPool)));
    }

    // --- viewPoolNotes() ---

    #[DataProvider('allTeamRolesProvider')]
    public function testTeamRolesCanViewPoolNotes(string $factoryMethod): void
    {
        $user = $this->createContextualUser($factoryMethod, $this->primaryPool);
        $this->assertTrue($this->ensureBool($this->policy->viewPoolNotes($user, $this->primaryPool)));
        $this->assertFalse($this->ensureBool($this->policy->viewPoolNotes($user, $this->unrelatedPool)));
    }

    public function testUpdateDraftReturnsFalseForPublishedPool(): void
    {
        $publishedPool = Pool::factory()
            ->for(Community::factory()->create())
            ->for(Department::factory()->create())
            ->published()
            ->create();
        $user = $this->createContextualUser('asCommunityAdmin', $publishedPool);

        $this->assertFalse($this->ensureBool($this->policy->updateDraft($user, $publishedPool)));
    }

    public function testApplicantCannotUpdateDraftPool(): void
    {
        $applicant = User::factory()->asApplicant()->create();
        $this->assertFalse($this->ensureBool($this->policy->updateDraft($applicant, $this->primaryPool)));
    }

    #[DataProvider('allTeamRolesProvider')]
    public function testTeamRolesDeniedUpdateDraftOnDifferentPool(string $factoryMethod): void
    {
        $otherPool = Pool::factory()
            ->for(Community::factory()->create())
            ->for(Department::factory()->create())
            ->create();
        $user = $this->createContextualUser($factoryMethod, $otherPool);

        $this->assertFalse($this->ensureBool($this->policy->updateDraft($user, $this->primaryPool)));
    }

    // --- updatePublished() ---

    public function testCommunityAdminCanUpdatePublishedPool(): void
    {
        $publishedPool = Pool::factory()
            ->for(Community::factory()->create())
            ->for(Department::factory()->create())
            ->published()
            ->create();
        $user = $this->createContextualUser('asCommunityAdmin', $publishedPool);

        $this->assertTrue($this->ensureBool($this->policy->updatePublished($user, $publishedPool)));
    }

    public function testUpdatePublishedReturnsFalseForDraftPool(): void
    {
        $user = $this->createContextualUser('asCommunityAdmin', $this->primaryPool);
        $this->assertFalse($this->ensureBool($this->policy->updatePublished($user, $this->primaryPool)));
    }

    public function testProcessOperatorCannotUpdatePublishedPool(): void
    {
        $publishedPool = Pool::factory()
            ->for(Community::factory()->create())
            ->for(Department::factory()->create())
            ->published()
            ->create();
        $user = $this->createContextualUser('asProcessOperator', $publishedPool);

        $this->assertFalse($this->ensureBool($this->policy->updatePublished($user, $publishedPool)));
    }

    // --- publish() ---

    public function testPublishReturnsDenyForAlreadyPublishedPool(): void
    {
        $publishedPool = Pool::factory()
            ->for(Community::factory()->create())
            ->for(Department::factory()->create())
            ->published()
            ->create();
        $user = $this->createContextualUser('asCommunityAdmin', $publishedPool);

        $this->assertFalse($this->ensureBool($this->policy->publish($user, $publishedPool)));
    }

    public static function rolesWithPublishPermissionProvider(): array
    {
        return [
            'community admin' => ['asCommunityAdmin'],
            'department admin' => ['asDepartmentAdmin'],
            'department HR advisor' => ['asDepartmentHRAdvisor'],
        ];
    }

    #[DataProvider('rolesWithPublishPermissionProvider')]
    public function testRolesWithPublishPermissionCanPublishDraftPool(string $factoryMethod): void
    {
        $user = $this->createContextualUser($factoryMethod, $this->primaryPool);
        $this->assertTrue($this->ensureBool($this->policy->publish($user, $this->primaryPool)));
    }

    public function testCommunityRecruiterCannotPublishPool(): void
    {
        $user = $this->createContextualUser('asCommunityRecruiter', $this->primaryPool);
        $this->assertFalse($this->ensureBool($this->policy->publish($user, $this->primaryPool)));
    }

    public function testProcessOperatorCannotPublishPool(): void
    {
        $user = $this->createContextualUser('asProcessOperator', $this->primaryPool);
        $this->assertFalse($this->ensureBool($this->policy->publish($user, $this->primaryPool)));
    }

    // --- changePoolClosingDate() / closePool() ---

    public function testCommunityAdminCanChangeClosingDateAndClosePool(): void
    {
        $publishedPool = Pool::factory()
            ->for(Community::factory()->create())
            ->for(Department::factory()->create())
            ->published()
            ->create();
        $user = $this->createContextualUser('asCommunityAdmin', $publishedPool);

        $this->assertTrue($this->ensureBool($this->policy->changePoolClosingDate($user, $publishedPool)));
        $this->assertTrue($this->ensureBool($this->policy->closePool($user, $publishedPool)));
    }

    public function testProcessOperatorCannotChangeClosingDateOrClosePool(): void
    {
        $publishedPool = Pool::factory()
            ->for(Community::factory()->create())
            ->for(Department::factory()->create())
            ->published()
            ->create();
        $user = $this->createContextualUser('asProcessOperator', $publishedPool);

        $this->assertFalse($this->ensureBool($this->policy->changePoolClosingDate($user, $publishedPool)));
        $this->assertFalse($this->ensureBool($this->policy->closePool($user, $publishedPool)));
    }

    // --- deleteDraft() ---

    public static function rolesWithDeletePermissionProvider(): array
    {
        return [
            'community recruiter' => ['asCommunityRecruiter'],
            'community admin' => ['asCommunityAdmin'],
            'department admin' => ['asDepartmentAdmin'],
            'department HR advisor' => ['asDepartmentHRAdvisor'],
        ];
    }

    #[DataProvider('rolesWithDeletePermissionProvider')]
    public function testRolesWithDeletePermissionCanDeleteDraftPool(string $factoryMethod): void
    {
        $user = $this->createContextualUser($factoryMethod, $this->primaryPool);
        $this->assertTrue($this->ensureBool($this->policy->deleteDraft($user, $this->primaryPool)));
    }

    public function testProcessOperatorCannotDeleteDraftPool(): void
    {
        $user = $this->createContextualUser('asProcessOperator', $this->primaryPool);
        $this->assertFalse($this->ensureBool($this->policy->deleteDraft($user, $this->primaryPool)));
    }

    public function testDeleteDraftReturnsDenyForPublishedPool(): void
    {
        $publishedPool = Pool::factory()
            ->for(Community::factory()->create())
            ->for(Department::factory()->create())
            ->published()
            ->create();
        $user = $this->createContextualUser('asCommunityAdmin', $publishedPool);

        $this->assertFalse($this->ensureBool($this->policy->deleteDraft($user, $publishedPool)));
    }

    // --- archiveAndUnarchive() ---

    public static function rolesWithArchivePermissionProvider(): array
    {
        return [
            'community recruiter' => ['asCommunityRecruiter'],
            'community admin' => ['asCommunityAdmin'],
            'department admin' => ['asDepartmentAdmin'],
            'department HR advisor' => ['asDepartmentHRAdvisor'],
        ];
    }

    #[DataProvider('rolesWithArchivePermissionProvider')]
    public function testRolesWithArchivePermissionCanArchivePool(string $factoryMethod): void
    {
        $user = $this->createContextualUser($factoryMethod, $this->primaryPool);
        $this->assertTrue($this->ensureBool($this->policy->archiveAndUnarchive($user, $this->primaryPool)));
    }

    public function testProcessOperatorCannotArchivePool(): void
    {
        $user = $this->createContextualUser('asProcessOperator', $this->primaryPool);
        $this->assertFalse($this->ensureBool($this->policy->archiveAndUnarchive($user, $this->primaryPool)));
    }

    #[DataProvider('rolesWithArchivePermissionProvider')]
    public function testTeamRolesDeniedArchiveOnDifferentPool(string $factoryMethod): void
    {
        $otherPool = Pool::factory()
            ->for(Community::factory()->create())
            ->for(Department::factory()->create())
            ->create();
        $user = $this->createContextualUser($factoryMethod, $otherPool);

        $this->assertFalse($this->ensureBool($this->policy->archiveAndUnarchive($user, $this->primaryPool)));
    }

    // --- viewAssessmentPlan() ---

    public function testPlatformAdminCanViewAssessmentPlan(): void
    {
        $admin = User::factory()->asAdmin()->create();
        $this->assertTrue($this->ensureBool($this->policy->viewAssessmentPlan($admin, $this->primaryPool)));
    }

    #[DataProvider('allTeamRolesProvider')]
    public function testTeamRolesCanViewAssessmentPlan(string $factoryMethod): void
    {
        $user = $this->createContextualUser($factoryMethod, $this->primaryPool);
        $this->assertTrue($this->ensureBool($this->policy->viewAssessmentPlan($user, $this->primaryPool)));
    }

    public function testApplicantCannotViewAssessmentPlan(): void
    {
        $applicant = User::factory()->asApplicant()->create();
        $this->assertFalse($this->ensureBool($this->policy->viewAssessmentPlan($applicant, $this->primaryPool)));
    }

    #[DataProvider('allTeamRolesProvider')]
    public function testTeamRolesDeniedViewAssessmentPlanOnDifferentPool(string $factoryMethod): void
    {
        $otherPool = Pool::factory()
            ->for(Community::factory()->create())
            ->for(Department::factory()->create())
            ->create();
        $user = $this->createContextualUser($factoryMethod, $otherPool);

        $this->assertFalse($this->ensureBool($this->policy->viewAssessmentPlan($user, $this->primaryPool)));
    }

    // --- viewTeamMembers() ---

    public function testPlatformAdminCanViewTeamMembers(): void
    {
        $admin = User::factory()->asAdmin()->create();
        $this->assertTrue($this->ensureBool($this->policy->viewTeamMembers($admin, $this->primaryPool)));
    }

    #[DataProvider('allTeamRolesProvider')]
    public function testTeamRolesCanViewTeamMembers(string $factoryMethod): void
    {
        $user = $this->createContextualUser($factoryMethod, $this->primaryPool);
        $this->assertTrue($this->ensureBool($this->policy->viewTeamMembers($user, $this->primaryPool)));
    }

    public function testApplicantCannotViewTeamMembers(): void
    {
        $applicant = User::factory()->asApplicant()->create();
        $this->assertFalse($this->ensureBool($this->policy->viewTeamMembers($applicant, $this->primaryPool)));
    }

    #[DataProvider('allTeamRolesProvider')]
    public function testTeamRolesDeniedViewTeamMembersOnDifferentPool(string $factoryMethod): void
    {
        $otherPool = Pool::factory()
            ->for(Community::factory()->create())
            ->for(Department::factory()->create())
            ->create();
        $user = $this->createContextualUser($factoryMethod, $otherPool);

        $this->assertFalse($this->ensureBool($this->policy->viewTeamMembers($user, $this->primaryPool)));
    }
}
