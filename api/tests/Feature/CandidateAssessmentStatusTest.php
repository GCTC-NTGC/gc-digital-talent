<?php

namespace Tests\Feature;

use App\Enums\AssessmentDecision;
use App\Enums\AssessmentResultType;
use App\Enums\OverallAssessmentStatus;
use App\Enums\PoolSkillType;
use App\Enums\SkillCategory;
use App\Models\AssessmentResult;
use App\Models\AssessmentStep;
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

    protected $team;

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
                    overallAssessmentStatus
                    assessmentStepStatuses {
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

        $this->team = Team::factory()->create([
            'name' => 'assessment-status',
        ]);

        $this->pool = Pool::factory()
            ->published()
            ->create([
                'team_id' => $this->team->id,
            ]);

        $technicalSkill = Skill::where('category', SkillCategory::TECHNICAL->name)->first();
        $this->poolSkill = PoolSkill::create([
            'pool_id' => $this->pool->id,
            'skill_id' => $technicalSkill->id,
            'type' => PoolSkillType::ESSENTIAL->name,
        ]);

        AssessmentStep::factory()
            ->afterCreating(function (AssessmentStep $step) {
                $step->poolSkills()->sync([$this->poolSkill->id]);
            })->create([
                'pool_id' => $this->pool->id,
            ]);

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
                            'assessmentStepStatuses' => [],
                            'overallAssessmentStatus' => OverallAssessmentStatus::TO_ASSESS->name,
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
            ]);

        AssessmentResult::factory()
            ->withResultType(AssessmentResultType::SKILL)
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
                            'assessmentStepStatuses' => [
                                [
                                    'step' => $stepOne->id,
                                    'decision' => AssessmentDecision::SUCCESSFUL->name,
                                ],
                            ],
                            'overallAssessmentStatus' => OverallAssessmentStatus::TO_ASSESS->name,
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
                            'assessmentStepStatuses' => [
                                [
                                    'step' => $stepOne->id,
                                    'decision' => AssessmentDecision::HOLD->name,
                                ],
                            ],
                            'overallAssessmentStatus' => OverallAssessmentStatus::TO_ASSESS->name,
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
                            'assessmentStepStatuses' => [
                                [
                                    'step' => $stepOne->id,
                                    'decision' => AssessmentDecision::UNSUCCESSFUL->name,
                                ],
                            ],
                            'overallAssessmentStatus' => OverallAssessmentStatus::DISQUALIFIED->name,
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
                            'assessmentStepStatuses' => [
                                [
                                    'step' => $stepOne->id,
                                    'decision' => AssessmentDecision::UNSUCCESSFUL->name,
                                ],
                            ],
                            'overallAssessmentStatus' => OverallAssessmentStatus::DISQUALIFIED->name,
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
            ->withResultType(AssessmentResultType::SKILL)
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
                            'assessmentStepStatuses' => [
                                [
                                    'step' => $steps[0]->id,
                                    'decision' => AssessmentDecision::SUCCESSFUL->name,
                                ],
                                [
                                    'step' => $steps[1]->id,
                                    'decision' => AssessmentDecision::HOLD->name,
                                ],
                            ],
                            'overallAssessmentStatus' => OverallAssessmentStatus::TO_ASSESS->name,
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
                            'assessmentStepStatuses' => [
                                [
                                    'step' => $steps[0]->id,
                                    'decision' => AssessmentDecision::SUCCESSFUL->name,
                                ],
                                [
                                    'step' => $steps[1]->id,
                                    'decision' => AssessmentDecision::SUCCESSFUL->name,
                                ],
                            ],
                            'overallAssessmentStatus' => OverallAssessmentStatus::QUALIFIED->name,
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
                            'overallAssessmentStatus' => OverallAssessmentStatus::DISQUALIFIED->name,
                            'assessmentStepStatuses' => [
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

    public function testNoEssentialSkillOrEducationIsSuccess()
    {

        $pool = Pool::factory()
            ->published()
            ->create([
                'team_id' => $this->team->id,
            ]);

        $technicalSkill = Skill::where('category', SkillCategory::TECHNICAL->name)->first();
        $poolSkill = PoolSkill::create([
            'pool_id' => $pool->id,
            'skill_id' => $technicalSkill->id,
            'type' => PoolSkillType::NONESSENTIAL->name,
        ]);

        $candidate = PoolCandidate::factory()->create([
            'pool_id' => $pool->id,
            'submitted_at' => config('constants.past_date'),
            'expiry_date' => config('constants.far_future_date'),
        ]);

        $stepOne = $pool->assessmentSteps->first();

        $stepTwo = AssessmentStep::factory()
            ->afterCreating(function (AssessmentStep $step) use ($poolSkill) {
                $step->poolSkills()->sync([$poolSkill->id]);
            })->create([
                'pool_id' => $pool->id,
            ]);

        AssessmentResult::factory()
            ->withResultType(AssessmentResultType::EDUCATION)
            ->create([
                'assessment_step_id' => $stepOne->id,
                'pool_candidate_id' => $candidate->id,
                'assessment_decision' => AssessmentDecision::SUCCESSFUL->name,
                'pool_skill_id' => $poolSkill->id,
            ]);

        $this->actingAs($this->adminUser, 'api')
            ->graphQL($this->query, ['id' => $candidate->id])
            ->assertJson([
                'data' => [
                    'poolCandidate' => [
                        'assessmentStatus' => [
                            'currentStep' => null,
                            'overallAssessmentStatus' => OverallAssessmentStatus::QUALIFIED->name,
                            'assessmentStepStatuses' => [
                                [
                                    'step' => $stepOne->id,
                                    'decision' => AssessmentDecision::SUCCESSFUL->name,
                                ],
                                [
                                    'step' => $stepTwo->id,
                                    'decision' => AssessmentDecision::SUCCESSFUL->name,
                                ],
                            ],
                        ],
                    ],
                ],
            ]);

    }
}
