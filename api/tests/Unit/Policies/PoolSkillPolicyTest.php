<?php

namespace Tests\Unit\Policies;

use App\Models\Community;
use App\Models\Department;
use App\Models\Pool;
use App\Models\PoolSkill;
use App\Models\User;
use App\Policies\PoolSkillPolicy;
use PHPUnit\Framework\Attributes\DataProvider;

class PoolSkillPolicyTest extends PolicyTestCase
{
    protected PoolSkillPolicy $policy;

    protected Pool $pool;

    protected PoolSkill $poolSkill;

    protected function setUp(): void
    {
        parent::setUp();
        $this->policy = new PoolSkillPolicy();
        $this->pool = Pool::factory()
            ->for(Community::factory()->create())
            ->for(Department::factory()->create())
            ->withPoolSkills(1, 0)
            ->create();
        $this->poolSkill = $this->pool->poolSkills->first();
    }

    // --- update() / delete() ---

    #[DataProvider('allTeamRolesProvider')]
    public function testTeamRolesCanUpdateAndDeletePoolSkill(string $factoryMethod): void
    {
        $user = $this->createContextualUser($factoryMethod, $this->pool);

        $this->assertTrue($this->ensureBool($this->policy->update($user, $this->poolSkill)));
        $this->assertTrue($this->ensureBool($this->policy->delete($user, $this->poolSkill)));
    }

    public function testApplicantCannotUpdateOrDeletePoolSkill(): void
    {
        $applicant = User::factory()->asApplicant()->create();

        $this->assertFalse($this->ensureBool($this->policy->update($applicant, $this->poolSkill)));
        $this->assertFalse($this->ensureBool($this->policy->delete($applicant, $this->poolSkill)));
    }

    #[DataProvider('allTeamRolesProvider')]
    public function testTeamRolesDeniedUpdateAndDeleteOnDifferentPool(string $factoryMethod): void
    {
        $otherPool = Pool::factory()
            ->for(Community::factory()->create())
            ->for(Department::factory()->create())
            ->create();
        $user = $this->createContextualUser($factoryMethod, $otherPool);

        $this->assertFalse($this->ensureBool($this->policy->update($user, $this->poolSkill)));
        $this->assertFalse($this->ensureBool($this->policy->delete($user, $this->poolSkill)));
    }

    // --- viewAssessmentSteps() ---

    public function testPlatformAdminCanViewAssessmentSteps(): void
    {
        $admin = User::factory()->asAdmin()->create();
        $this->assertTrue($this->ensureBool($this->policy->viewAssessmentSteps($admin, $this->poolSkill)));
    }

    #[DataProvider('allTeamRolesProvider')]
    public function testTeamRolesCanViewAssessmentSteps(string $factoryMethod): void
    {
        $user = $this->createContextualUser($factoryMethod, $this->pool);
        $this->assertTrue($this->ensureBool($this->policy->viewAssessmentSteps($user, $this->poolSkill)));
    }

    public function testApplicantCannotViewAssessmentSteps(): void
    {
        $applicant = User::factory()->asApplicant()->create();
        $this->assertFalse($this->ensureBool($this->policy->viewAssessmentSteps($applicant, $this->poolSkill)));
    }

    #[DataProvider('allTeamRolesProvider')]
    public function testTeamRolesDeniedViewAssessmentStepsOnDifferentPool(string $factoryMethod): void
    {
        $otherPool = Pool::factory()
            ->for(Community::factory()->create())
            ->for(Department::factory()->create())
            ->create();
        $user = $this->createContextualUser($factoryMethod, $otherPool);

        $this->assertFalse($this->ensureBool($this->policy->viewAssessmentSteps($user, $this->poolSkill)));
    }
}
