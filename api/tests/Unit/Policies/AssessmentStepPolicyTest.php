<?php

namespace Tests\Unit\Policies;

use App\Models\AssessmentStep;
use App\Models\Community;
use App\Models\Department;
use App\Models\Pool;
use App\Models\User;
use App\Policies\AssessmentStepPolicy;
use PHPUnit\Framework\Attributes\DataProvider;

class AssessmentStepPolicyTest extends PolicyTestCase
{
    protected AssessmentStepPolicy $policy;

    protected Pool $primaryPool;

    protected AssessmentStep $step;

    protected function setUp(): void
    {
        parent::setUp();
        $this->policy = new AssessmentStepPolicy();
        $this->primaryPool = Pool::factory()
            ->for(Community::factory()->create())
            ->for(Department::factory()->create())
            ->create();
        $this->step = AssessmentStep::factory()->for($this->primaryPool)->create();
    }

    // --- create() ---

    public function testCreateReturnsDenyWhenPoolIdMissing(): void
    {
        $user = $this->createContextualUser('asProcessOperator', $this->primaryPool);
        $this->assertFalse($this->ensureBool($this->policy->create($user, [])));
    }

    public function testCreateReturnsDenyWhenPoolNotFound(): void
    {
        $user = $this->createContextualUser('asProcessOperator', $this->primaryPool);
        $this->assertFalse($this->ensureBool($this->policy->create($user, ['pool_id' => '00000000-0000-0000-0000-000000000000'])));
    }

    #[DataProvider('allTeamRolesProvider')]
    public function testTeamRolesCanCreateAssessmentStepOnDraftPool(string $factoryMethod): void
    {
        $user = $this->createContextualUser($factoryMethod, $this->primaryPool);
        $this->assertTrue($this->ensureBool($this->policy->create($user, ['pool_id' => $this->primaryPool->id])));
    }

    public function testCreateReturnsDenyForPublishedPool(): void
    {
        $publishedPool = Pool::factory()
            ->for(Community::factory()->create())
            ->for(Department::factory()->create())
            ->published()
            ->create();
        $user = User::factory()->asProcessOperator($publishedPool->id)->create();

        $this->assertFalse($this->ensureBool($this->policy->create($user, ['pool_id' => $publishedPool->id])));
    }

    #[DataProvider('allTeamRolesProvider')]
    public function testTeamRolesDeniedCreateOnDifferentPool(string $factoryMethod): void
    {
        $otherPool = Pool::factory()
            ->for(Community::factory()->create())
            ->for(Department::factory()->create())
            ->create();
        $user = $this->createContextualUser($factoryMethod, $otherPool);

        $this->assertFalse($this->ensureBool($this->policy->create($user, ['pool_id' => $this->primaryPool->id])));
    }

    // --- update() ---

    #[DataProvider('allTeamRolesProvider')]
    public function testTeamRolesCanUpdateAssessmentStepOnDraftPool(string $factoryMethod): void
    {
        $user = $this->createContextualUser($factoryMethod, $this->primaryPool);
        $this->assertTrue($this->ensureBool($this->policy->update($user, $this->step)));
    }

    public function testUpdateReturnsFalseForPublishedPool(): void
    {
        $publishedPool = Pool::factory()
            ->for(Community::factory()->create())
            ->for(Department::factory()->create())
            ->published()
            ->create();
        $publishedStep = AssessmentStep::factory()->for($publishedPool)->create();
        $user = User::factory()->asProcessOperator($publishedPool->id)->create();

        $this->assertFalse($this->ensureBool($this->policy->update($user, $publishedStep)));
    }

    #[DataProvider('allTeamRolesProvider')]
    public function testTeamRolesDeniedUpdateOnDifferentPool(string $factoryMethod): void
    {
        $otherPool = Pool::factory()
            ->for(Community::factory()->create())
            ->for(Department::factory()->create())
            ->create();
        $user = $this->createContextualUser($factoryMethod, $otherPool);

        $this->assertFalse($this->ensureBool($this->policy->update($user, $this->step)));
    }

    // --- view() ---

    public function testPlatformAdminCanViewAssessmentStep(): void
    {
        $admin = User::factory()->asAdmin()->create();
        $this->assertTrue($this->ensureBool($this->policy->view($admin, $this->step)));
    }

    #[DataProvider('allTeamRolesProvider')]
    public function testTeamRolesCanViewAssessmentStep(string $factoryMethod): void
    {
        $user = $this->createContextualUser($factoryMethod, $this->primaryPool);
        $this->assertTrue($this->ensureBool($this->policy->view($user, $this->step)));
    }

    public function testApplicantCannotViewAssessmentStep(): void
    {
        $applicant = User::factory()->asApplicant()->create();
        $this->assertFalse($this->ensureBool($this->policy->view($applicant, $this->step)));
    }

    #[DataProvider('allTeamRolesProvider')]
    public function testTeamRolesDeniedViewOnDifferentPool(string $factoryMethod): void
    {
        $otherPool = Pool::factory()
            ->for(Community::factory()->create())
            ->for(Department::factory()->create())
            ->create();
        $user = $this->createContextualUser($factoryMethod, $otherPool);

        $this->assertFalse($this->ensureBool($this->policy->view($user, $this->step)));
    }

    // --- viewAssessmentResults() ---

    public function testPlatformAdminCanViewAssessmentResults(): void
    {
        $admin = User::factory()->asAdmin()->create();
        $this->assertTrue($this->ensureBool($this->policy->viewAssessmentResults($admin, $this->step)));
    }

    #[DataProvider('allTeamRolesProvider')]
    public function testTeamRolesCanViewAssessmentResults(string $factoryMethod): void
    {
        $user = $this->createContextualUser($factoryMethod, $this->primaryPool);
        $this->assertTrue($this->ensureBool($this->policy->viewAssessmentResults($user, $this->step)));
    }

    #[DataProvider('allTeamRolesProvider')]
    public function testTeamRolesDeniedViewAssessmentResultsOnDifferentPool(string $factoryMethod): void
    {
        $otherPool = Pool::factory()
            ->for(Community::factory()->create())
            ->for(Department::factory()->create())
            ->create();
        $user = $this->createContextualUser($factoryMethod, $otherPool);

        $this->assertFalse($this->ensureBool($this->policy->viewAssessmentResults($user, $this->step)));
    }
}
