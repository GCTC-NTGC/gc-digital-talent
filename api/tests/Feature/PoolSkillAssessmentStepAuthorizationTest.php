<?php

namespace Tests\Feature;

use App\Models\Department;
use App\Models\Pool;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Tests\TestCase;
use Tests\UsesProtectedGraphqlEndpoint;

class PoolSkillAssessmentStepAuthorizationTest extends TestCase
{
    use MakesGraphQLRequests;
    use RefreshDatabase;
    use RefreshesSchemaCache;
    use UsesProtectedGraphqlEndpoint;

    protected $deptA;

    protected $deptB;

    protected $poolA;

    protected $poolB;

    protected string $query = <<<'GRAPHQL'
        query GetPoolSkillSteps($id: UUID!) {
            pool(id: $id) {
                id
                poolSkills {
                    id
                    assessmentSteps {
                        id
                    }
                }
            }
        }
    GRAPHQL;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);

        $this->deptA = Department::factory()->create();
        $this->poolA = Pool::factory()->published()->create([
            'department_id' => $this->deptA->id,
        ]);

        $this->deptB = Department::factory()->create();
        $this->poolB = Pool::factory()->published()->create([
            'department_id' => $this->deptB->id,
        ]);
    }

    public function testDepartmentAdvisorNestedStepBoundaries(): void
    {
        $advisorA = User::factory()
            ->asDepartmentHRAdvisor($this->deptA->id)
            ->create();

        $skillA = $this->poolA->poolSkills->first();
        $stepIdA = $skillA->assessmentSteps->first()->id;

        $skillB = $this->poolB->poolSkills->first();
        $stepIdB = $skillB->assessmentSteps->first()->id;

        $this->actingAs($advisorA, 'api')
            ->graphQL($this->query, ['id' => $this->poolA->id])
            ->assertJsonFragment(['id' => $stepIdA]);

        $this->actingAs($advisorA, 'api')
            ->graphQL($this->query, ['id' => $this->poolB->id])
            ->assertJsonMissing(['id' => $stepIdB])
            ->assertJson([
                'data' => [
                    'pool' => [
                        'poolSkills' => [
                            [
                                'id' => $skillB->id,
                                'assessmentSteps' => [],
                            ],
                        ],
                    ],
                ],
            ]);
    }

    public function testPlatformAdminCanViewDeeplyNestedSteps(): void
    {
        $admin = User::factory()->asAdmin()->create();
        $stepIdB = $this->poolB->poolSkills->first()->assessmentSteps->first()->id;

        $this->actingAs($admin, 'api')
            ->graphQL($this->query, ['id' => $this->poolB->id])
            ->assertJsonFragment(['id' => $stepIdB]);
    }

    public function testApplicantCannotViewNestedSteps(): void
    {
        $applicant = User::factory()->asApplicant()->create();
        $skillIdA = $this->poolA->poolSkills->first()->id;

        $this->actingAs($applicant, 'api')
            ->graphQL($this->query, ['id' => $this->poolA->id])
            ->assertJson([
                'data' => [
                    'pool' => [
                        'poolSkills' => [
                            [
                                'id' => $skillIdA,
                                'assessmentSteps' => [],
                            ],
                        ],
                    ],
                ],
            ]);
    }
}
