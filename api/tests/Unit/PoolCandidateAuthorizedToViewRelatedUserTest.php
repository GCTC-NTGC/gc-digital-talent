<?php

namespace Tests\Unit;

use App\Models\Community;
use App\Models\CommunityInterest;
use App\Models\Department;
use App\Models\Pool;
use App\Models\PoolCandidate;
use App\Models\User;
use Database\Helpers\TeamHelpers;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Collection;
use ReflectionClass;
use Tests\TestCase;

use function PHPUnit\Framework\assertEqualsCanonicalizing;

// Exercises PoolCandidateBuilder::andAuthorizedToViewRelatedUser directly, bypassing
// the other scopes composed in whereAuthorizedToViewPoolCandidateAdminView() since it
// is a private method with its own distinct rules.
class PoolCandidateAuthorizedToViewRelatedUserTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);
    }

    private function authorizedToViewRelatedUserIds(User $user): Collection
    {
        $teamIdsByPermission = [
            'view-team-applicantProfile' => TeamHelpers::getTeamIdsForPermission($user, 'view-team-applicantProfile'),
            'view-team-communityTalent' => TeamHelpers::getTeamIdsForPermission($user, 'view-team-communityTalent'),
        ];

        $builder = PoolCandidate::query();
        $method = (new ReflectionClass($builder))->getMethod('andAuthorizedToViewRelatedUser');

        return $method->invoke($builder, $user, $teamIdsByPermission)->get()->pluck('id');
    }

    // process operators can see users who have a pool candidate in a pool they operate
    public function testProcessOperatorSeesUsersWithCandidateInTheirPool(): void
    {
        $poolA = Pool::factory()->published()->create();
        $poolB = Pool::factory()->published()->create();

        $candidateInPoolA = PoolCandidate::factory()
            ->for(User::factory()->asApplicant()->create())
            ->for($poolA)
            ->create();

        PoolCandidate::factory()
            ->for(User::factory()->asApplicant()->create())
            ->for($poolB)
            ->create();

        $processOperator = User::factory()->asProcessOperator($poolA->id)->create();

        $visibleIds = $this->authorizedToViewRelatedUserIds($processOperator);

        assertEqualsCanonicalizing([$candidateInPoolA->id], $visibleIds->toArray());
    }

    // department HR advisors can see users who have a pool candidate in a pool belonging to their department
    public function testDepartmentHRAdvisorSeesUsersWithCandidateInDepartmentPool(): void
    {
        $departmentA = Department::factory()->create();
        $departmentB = Department::factory()->create();
        $poolA = Pool::factory()->published()->create(['department_id' => $departmentA->id]);
        $poolB = Pool::factory()->published()->create(['department_id' => $departmentB->id]);

        $candidateInPoolA = PoolCandidate::factory()
            ->for(User::factory()->asApplicant()->create())
            ->for($poolA)
            ->create();

        PoolCandidate::factory()
            ->for(User::factory()->asApplicant()->create())
            ->for($poolB)
            ->create();

        $hrAdvisor = User::factory()->asDepartmentHRAdvisor($departmentA->id)->create();

        $visibleIds = $this->authorizedToViewRelatedUserIds($hrAdvisor);

        assertEqualsCanonicalizing([$candidateInPoolA->id], $visibleIds->toArray());
    }

    // community talent coordinators can see users who are verified government employees and have
    // consented to share a community interest profile with their community, regardless of pool
    public function testCommunityTalentCoordinatorSeesConsentedVerifiedGovEmployees(): void
    {
        $community = Community::factory()->create();
        $otherCommunity = Community::factory()->create();
        $otherDepartment = Department::factory()->create();
        $unrelatedPool = Pool::factory()->published()->create([
            'community_id' => $otherCommunity->id,
            'department_id' => $otherDepartment->id,
        ]);

        $consentedGovUser = User::factory()->asApplicant()->withGovEmployeeProfile()->create();
        $consentedCandidate = PoolCandidate::factory()->for($consentedGovUser)->for($unrelatedPool)->create();
        CommunityInterest::factory()
            ->for($consentedGovUser)
            ->for($community)
            ->consented()
            ->create();

        // not a verified gov employee, despite consenting -> should not be visible
        $nonGovUser = User::factory()->asApplicant()->create();
        PoolCandidate::factory()->for($nonGovUser)->for($unrelatedPool)->create();
        CommunityInterest::factory()
            ->for($nonGovUser)
            ->for($community)
            ->consented()
            ->create();

        // verified gov employee, but did not consent to share -> should not be visible
        $nonConsentedGovUser = User::factory()->asApplicant()->withGovEmployeeProfile()->create();
        PoolCandidate::factory()->for($nonConsentedGovUser)->for($unrelatedPool)->create();
        CommunityInterest::factory()
            ->for($nonConsentedGovUser)
            ->for($community)
            ->consented(false)
            ->create();

        $talentCoordinator = User::factory()->asCommunityTalentCoordinator($community->id)->create();

        $visibleIds = $this->authorizedToViewRelatedUserIds($talentCoordinator);

        assertEqualsCanonicalizing([$consentedCandidate->id], $visibleIds->toArray());
    }
}
