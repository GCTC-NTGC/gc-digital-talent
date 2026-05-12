<?php

namespace Tests\Unit\Policies;

use App\Models\AssessmentResult;
use App\Models\AssessmentStep;
use App\Models\Community;
use App\Models\Department;
use App\Models\Pool;
use App\Models\User;
use App\Policies\AssessmentResultPolicy;
use PHPUnit\Framework\Attributes\DataProvider;

class AssessmentResultPolicyTest extends PolicyTestCase
{
    protected AssessmentResultPolicy $policy;

    protected Pool $primaryPool;

    protected AssessmentStep $step;

    protected AssessmentResult $result;

    protected function setUp(): void
    {
        parent::setUp();
        $this->policy = new AssessmentResultPolicy();
        $this->primaryPool = Pool::factory()->create();
        $this->step = AssessmentStep::factory()->for($this->primaryPool)->create();
        $this->result = AssessmentResult::factory()->for($this->step)->create();
    }

    public static function globalRoleProvider(): array
    {
        return [
            'platform admin can view globally' => ['asAdmin', true],
            'guest cannot view globally' => ['asGuest', false],
        ];
    }

    #[DataProvider('globalRoleProvider')]
    public function testGlobalRoleViewAccess(string $factoryMethod, bool $expected): void
    {
        $user = User::factory()->{$factoryMethod}()->create();
        $this->assertEquals($expected, $this->ensureBool($this->policy->view($user, $this->result)));
    }

    public static function authorizedTeamRoleProvider(): array
    {
        return [
            'process operator on team' => ['asProcessOperator'],
            'community recruiter on team' => ['asCommunityRecruiter'],
            'community admin on team' => ['asCommunityAdmin'],
            'department admin on team' => ['asDepartmentAdmin'],
            'department hr advisor on team' => ['asDepartmentHRAdvisor'],
        ];
    }

    #[DataProvider('authorizedTeamRoleProvider')]
    public function testAuthorizedTeamRolesCanAccessResources(string $factoryMethod): void
    {
        $user = $this->createContextualUser($factoryMethod, $this->primaryPool);

        $this->assertTrue($this->ensureBool($this->policy->view($user, $this->result)));
        $this->assertTrue($this->ensureBool($this->policy->create($user, ['assessment_step_id' => $this->step->id])));
        $this->assertTrue($this->ensureBool($this->policy->update($user, $this->result)));
    }

    public function testCreateReturnsFalseWhenStepIdMissing(): void
    {
        $user = $this->createContextualUser('asProcessOperator', $this->primaryPool);
        $this->assertFalse($this->ensureBool($this->policy->create($user, [])));
    }

    #[DataProvider('authorizedTeamRoleProvider')]
    public function testTeamRolesAreDeniedAccessOnDifferentTeams(string $factoryMethod): void
    {
        $otherPool = Pool::factory()
            ->for(Community::factory()->create())
            ->for(Department::factory()->create())
            ->create();
        $user = $this->createContextualUser($factoryMethod, $otherPool);

        $this->assertFalse($this->ensureBool($this->policy->view($user, $this->result)));
        $this->assertFalse($this->ensureBool($this->policy->create($user, ['assessment_step_id' => $this->step->id])));
        $this->assertFalse($this->ensureBool($this->policy->update($user, $this->result)));
    }
}
