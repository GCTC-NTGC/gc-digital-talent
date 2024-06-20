<?php

namespace Tests\Feature;

use App\Enums\AssessmentDecision;
use App\Enums\AssessmentFinalDecision;
use App\Enums\AssessmentResultType;
use App\Enums\PoolSkillType;
use App\Enums\SkillCategory;
use App\Models\AssessmentResult;
use App\Models\Pool;
use App\Models\PoolCandidate;
use App\Models\PoolSkill;
use App\Models\Skill;
use App\Models\Team;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Database\Seeders\SkillFamilySeeder;
use Database\Seeders\SkillSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Tests\TestCase;
use Tests\UsesProtectedGraphqlEndpoint;

class CandidateAssessmentStatusTest extends TestCase
{
    use MakesGraphQLRequests;
    use RefreshDatabase;
    use RefreshesSchemaCache;
    use UsesProtectedGraphqlEndpoint;

    protected $pool;

    protected $poolSkill;

    protected $adminUser;

    protected $candidate;

    protected $queryVars;

    protected $query = /** GraphQL */
        '
        query poolCandidate($id: UUID!) {
            poolCandidate(id: $id) {
                assessmentStatus {
                    currentStep
                    finalDecision
                    stepDecisions {
                        step
                        decision
                    }
                }
            }
        }
    ';

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed([
            SkillFamilySeeder::class,
            SkillSeeder::class,
            RolePermissionSeeder::class,
        ]);

        $team = Team::factory()->create([
            'name' => 'assessment-status',
        ]);

        $this->pool = Pool::factory()
            ->withPoolSkills(1, 0)
            ->withAssessments()
            ->published()
            ->create([
                'team_id' => $team->id,
            ]);

        $this->poolSkill = $this->pool->poolSkills
            ->where('type', PoolSkillType::ESSENTIAL->name)
            ->first();

        $this->adminUser = User::factory()
            ->asApplicant()
            ->asPoolOperator('assessment-status')
            ->asRequestResponder()
            ->asAdmin()
            ->create();

        $this->candidate = PoolCandidate::factory()->create([
            'pool_id' => $this->pool->id,
            'submitted_at' => config('constants.past_date'),
            'expiry_date' => config('constants.far_future_date'),
        ]);

        $this->queryVars = [
            'id' => $this->candidate->id,
        ];
    }

    public function testDefaultAssessmentStatus(): void
    {
        $this->actingAs($this->adminUser, 'api')
            ->graphQL($this->query, $this->queryVars)
            ->assertJson([
                'data' => [
                    'poolCandidate' => [
                        'assessmentStatus' => [
                            'stepDecisions' => [],
                            'finalDecision' => AssessmentFinalDecision::TO_ASSESS->name,
                            'currentStep' => 1,
                        ],
                    ],
                ],
            ]);
    }

    public function testSuccessPassesFirstStep(): void
    {
        $stepOne = $this->pool->assessmentSteps->where('sort_order', 1)->first();

        AssessmentResult::factory()
            ->withResultType(AssessmentResultType::EDUCATION)
            ->create([
                'assessment_step_id' => $stepOne->id,
                'pool_candidate_id' => $this->candidate->id,
                'assessment_decision' => AssessmentDecision::SUCCESSFUL->name,
                'pool_skill_id' => $this->poolSkill->id,
            ]);

        $this->actingAs($this->adminUser, 'api')
            ->graphQL($this->query, $this->queryVars)
            ->assertJson([
                'data' => [
                    'poolCandidate' => [
                        'assessmentStatus' => [
                            'stepDecisions' => [
                                [
                                    'step' => $stepOne->id,
                                    'decision' => AssessmentDecision::SUCCESSFUL->name,
                                ],
                            ],
                            'finalDecision' => AssessmentFinalDecision::TO_ASSESS->name,
                            'currentStep' => 2,
                        ],
                    ],
                ],
            ]);
    }

    public function testHoldPassesFirstStep(): void
    {
        $stepOne = $this->pool->assessmentSteps->where('sort_order', 1)->first();

        AssessmentResult::factory()
            ->withResultType(AssessmentResultType::EDUCATION)
            ->create([
                'assessment_step_id' => $stepOne->id,
                'pool_candidate_id' => $this->candidate->id,
                'assessment_decision' => AssessmentDecision::HOLD->name,
                'pool_skill_id' => $this->poolSkill->id,
            ]);

        $this->actingAs($this->adminUser, 'api')
            ->graphQL($this->query, $this->queryVars)
            ->assertJson([
                'data' => [
                    'poolCandidate' => [
                        'assessmentStatus' => [
                            'stepDecisions' => [
                                [
                                    'step' => $stepOne->id,
                                    'decision' => AssessmentDecision::HOLD->name,
                                ],
                            ],
                            'finalDecision' => AssessmentFinalDecision::TO_ASSESS->name,
                            'currentStep' => 2,
                        ],
                    ],
                ],
            ]);
    }

    public function testUnsuccessfulEducationDisqualifies(): void
    {
        $stepOne = $this->pool->assessmentSteps->where('sort_order', 1)->first();

        AssessmentResult::factory()
            ->withResultType(AssessmentResultType::EDUCATION)
            ->create([
                'assessment_step_id' => $stepOne->id,
                'pool_candidate_id' => $this->candidate->id,
                'assessment_decision' => AssessmentDecision::UNSUCCESSFUL->name,
                'pool_skill_id' => $this->poolSkill->id,
            ]);

        $this->actingAs($this->adminUser, 'api')
            ->graphQL($this->query, $this->queryVars)
            ->assertJson([
                'data' => [
                    'poolCandidate' => [
                        'assessmentStatus' => [
                            'stepDecisions' => [
                                [
                                    'step' => $stepOne->id,
                                    'decision' => AssessmentDecision::UNSUCCESSFUL->name,
                                ],
                            ],
                            'finalDecision' => AssessmentFinalDecision::DISQUALIFIED->name,
                            'currentStep' => 1,
                        ],
                    ],
                ],
            ]);
    }

    public function testUnsuccessfulEssentialSkillDisqualifies(): void
    {
        $technicalSkill = Skill::factory()->create([
            'category' => SkillCategory::TECHNICAL->name,
        ]);
        $testPoolSkill = PoolSkill::create([
            'pool_id' => $this->pool->id,
            'skill_id' => $technicalSkill->id,
            'type' => PoolSkillType::ESSENTIAL->name,
        ]);
        $stepOne = $this->pool->assessmentSteps->where('sort_order', 1)->first();

        AssessmentResult::factory()
            ->withResultType(AssessmentResultType::SKILL)
            ->create([
                'assessment_step_id' => $stepOne->id,
                'pool_candidate_id' => $this->candidate->id,
                'assessment_decision' => AssessmentDecision::UNSUCCESSFUL->name,
                'pool_skill_id' => $testPoolSkill->id,
            ]);

        $this->actingAs($this->adminUser, 'api')
            ->graphQL($this->query, $this->queryVars)
            ->assertJson([
                'data' => [
                    'poolCandidate' => [
                        'assessmentStatus' => [
                            'stepDecisions' => [
                                [
                                    'step' => $stepOne->id,
                                    'decision' => AssessmentDecision::UNSUCCESSFUL->name,
                                ],
                            ],
                            'finalDecision' => AssessmentFinalDecision::DISQUALIFIED->name,
                            'currentStep' => 1,
                        ],
                    ],
                ],
            ]);
    }

    public function testFinalStepHoldStillNeedsAssessment(): void
    {

        $steps = $this->pool->assessmentSteps;

        AssessmentResult::factory()
            ->withResultType(AssessmentResultType::EDUCATION)
            ->create([
                'assessment_step_id' => $steps[0]->id,
                'pool_candidate_id' => $this->candidate->id,
                'assessment_decision' => AssessmentDecision::SUCCESSFUL->name,
                'pool_skill_id' => $this->poolSkill->id,
            ]);

        AssessmentResult::factory()
            ->withResultType(AssessmentResultType::EDUCATION)
            ->create([
                'assessment_step_id' => $steps[1]->id,
                'pool_candidate_id' => $this->candidate->id,
                'assessment_decision' => AssessmentDecision::HOLD->name,
                'pool_skill_id' => $this->poolSkill->id,
            ]);

        $this->actingAs($this->adminUser, 'api')
            ->graphQL($this->query, $this->queryVars)
            ->assertJson([
                'data' => [
                    'poolCandidate' => [
                        'assessmentStatus' => [
                            'stepDecisions' => [
                                [
                                    'step' => $steps[0]->id,
                                    'decision' => AssessmentDecision::SUCCESSFUL->name,
                                ],
                                [
                                    'step' => $steps[1]->id,
                                    'decision' => AssessmentDecision::HOLD->name,
                                ],
                            ],
                            'finalDecision' => AssessmentFinalDecision::TO_ASSESS->name,
                            'currentStep' => 2,
                        ],
                    ],
                ],
            ]);
    }

    public function testSucceedsAllQualifies(): void
    {
        $steps = $this->pool->assessmentSteps;

        AssessmentResult::factory()
            ->withResultType(AssessmentResultType::EDUCATION)
            ->create([
                'assessment_step_id' => $steps[0]->id,
                'pool_candidate_id' => $this->candidate->id,
                'assessment_decision' => AssessmentDecision::SUCCESSFUL->name,
                'pool_skill_id' => $this->poolSkill->id,
            ]);

        AssessmentResult::factory()
            ->withResultType(AssessmentResultType::SKILL)
            ->create([
                'assessment_step_id' => $steps[1]->id,
                'pool_candidate_id' => $this->candidate->id,
                'assessment_decision' => AssessmentDecision::SUCCESSFUL->name,
                'pool_skill_id' => $this->poolSkill->id,
            ]);

        $this->actingAs($this->adminUser, 'api')
            ->graphQL($this->query, $this->queryVars)
            ->assertJson([
                'data' => [
                    'poolCandidate' => [
                        'assessmentStatus' => [
                            'stepDecisions' => [
                                [
                                    'step' => $steps[0]->id,
                                    'decision' => AssessmentDecision::SUCCESSFUL->name,
                                ],
                                [
                                    'step' => $steps[1]->id,
                                    'decision' => AssessmentDecision::SUCCESSFUL->name,
                                ],
                            ],
                            'finalDecision' => AssessmentFinalDecision::QUALIFIED->name,
                            'currentStep' => null,
                        ],
                    ],
                ],
            ]);
    }

    public function testFailedEssentialSkillMissingEducation()
    {
        $steps = $this->pool->assessmentSteps;

        AssessmentResult::factory()
            ->withResultType(AssessmentResultType::SKILL)
            ->create([
                'assessment_step_id' => $steps[0]->id,
                'pool_candidate_id' => $this->candidate->id,
                'assessment_decision' => AssessmentDecision::UNSUCCESSFUL->name,
                'pool_skill_id' => $this->poolSkill->id,
            ]);

        $this->actingAs($this->adminUser, 'api')
            ->graphQL($this->query, $this->queryVars)
            ->assertJson([
                'data' => [
                    'poolCandidate' => [
                        'assessmentStatus' => [
                            'currentStep' => 1,
                            'finalDecision' => AssessmentFinalDecision::DISQUALIFIED->name,
                            'stepDecisions' => [
                                [
                                    'step' => $steps[0]->id,
                                    'decision' => AssessmentDecision::UNSUCCESSFUL->name,
                                ],
                            ],
                        ],
                    ],
                ],
            ]);

    }
}
