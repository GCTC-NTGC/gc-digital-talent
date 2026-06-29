<?php

namespace Tests\Unit;

use App\Models\AssessmentStep;
use App\Models\Community;
use App\Models\Department;
use App\Models\Pool;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
use Tests\TestCase;

class AssessmentStepAuthorizationScopeTest extends TestCase
{
    use RefreshDatabase;

    protected $poolA;

    protected $poolB;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);

        // Setup Pool A with Assessment Steps
        $this->poolA = Pool::factory()->published()->create();

        // Setup Pool B with Assessment Steps
        $this->poolB = Pool::factory()->published()->create();
    }

    /**
     * Platform Admin should see all steps across all pools.
     * Permission: view-any-assessmentPlan
     */
    public function testScopeAuthorizedToViewAsPlatformAdmin(): void
    {
        Auth::shouldReceive('user')
            ->andReturn(User::factory()->asAdmin()->create());

        $viewableIds = AssessmentStep::whereAuthorizedToView()->pluck('id')->toArray();
        $allIds = AssessmentStep::pluck('id')->toArray();

        $this->assertEqualsCanonicalizing($allIds, $viewableIds);
    }

    /**
     * Process Operator should see steps for their pool,
     * but MUST NOT see steps from other pools.
     * Permission: view-team-assessmentPlan
     */
    public function testScopeAuthorizedToViewAsProcessOperatorBoundary(): void
    {
        // User is operator for Pool A only
        $operator = User::factory()->asProcessOperator($this->poolA->id)->create();
        Auth::shouldReceive('user')->andReturn($operator);

        $viewableIds = AssessmentStep::whereAuthorizedToView()->pluck('id')->toArray();

        $expectedIds = $this->poolA->assessmentSteps->pluck('id')->toArray();
        $forbiddenIds = $this->poolB->assessmentSteps->pluck('id')->toArray();

        // Affirmative: They see theirs
        foreach ($expectedIds as $id) {
            $this->assertContains($id, $viewableIds);
        }

        // Negative: They DO NOT see others (Boundary check)
        foreach ($forbiddenIds as $id) {
            $this->assertNotContains($id, $viewableIds, 'Process Operator leaked data from a pool they do not manage.');
        }
    }

    /**
     * Department HR Advisor should see steps for pools in their department,
     * but MUST NOT see steps for pools in other departments.
     * Permission: view-team-assessmentPlan
     */
    public function testScopeAuthorizedToViewAsDepartmentAdvisorBoundary(): void
    {
        $deptA = Department::factory()->create();
        $this->poolA->department_id = $deptA->id;
        $this->poolA->save();

        $deptB = Department::factory()->create();
        $this->poolB->department_id = $deptB->id;
        $this->poolB->save();

        // Advisor belongs to Dept A
        $advisor = User::factory()->asDepartmentHRAdvisor($deptA->id)->create();
        Auth::shouldReceive('user')->andReturn($advisor);

        $viewableIds = AssessmentStep::whereAuthorizedToView()->pluck('id')->toArray();

        $expectedId = $this->poolA->assessmentSteps->first()->id;
        $forbiddenId = $this->poolB->assessmentSteps->first()->id;

        $this->assertContains($expectedId, $viewableIds);
        $this->assertNotContains($forbiddenId, $viewableIds, 'HR Advisor leaked data from a different department.');
    }

    /**
     * Community Admin should see steps for pools in their community,
     * but MUST NOT see steps for pools in other communities.
     * Permission: view-team-assessmentPlan
     */
    public function testScopeAuthorizedToViewAsCommunityAdminBoundary(): void
    {
        $commA = Community::factory()->create();
        $this->poolA->community_id = $commA->id;
        $this->poolA->save();

        $commB = Community::factory()->create();
        $this->poolB->community_id = $commB->id;
        $this->poolB->save();

        $admin = User::factory()->asCommunityAdmin($commA->id)->create();
        Auth::shouldReceive('user')->andReturn($admin);

        $viewableIds = AssessmentStep::whereAuthorizedToView()->pluck('id')->toArray();

        $this->assertContains($this->poolA->assessmentSteps->first()->id, $viewableIds);
        $this->assertNotContains($this->poolB->assessmentSteps->first()->id, $viewableIds, 'Community Admin leaked data from another community.');
    }

    /**
     * Negative Case: Applicant role.
     * Applicants have NO view permissions for assessmentPlan in rolepermission.php.
     */
    public function testScopeAuthorizedToViewAsApplicant(): void
    {
        $applicant = User::factory()->asApplicant()->create();
        Auth::shouldReceive('user')->andReturn($applicant);

        $viewableIds = AssessmentStep::whereAuthorizedToView()->pluck('id')->toArray();

        $this->assertEmpty($viewableIds, 'Applicants should have no access to internal assessment steps.');
    }

    /**
     * Negative Case: Guest (Unauthenticated).
     */
    public function testScopeAuthorizedToViewAsGuest(): void
    {
        Auth::shouldReceive('user')->andReturn(null);

        $viewableIds = AssessmentStep::whereAuthorizedToView()->pluck('id')->toArray();

        $this->assertEmpty($viewableIds, 'Guests should see zero assessment steps.');
    }
}
