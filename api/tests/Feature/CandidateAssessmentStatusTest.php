<?php

namespace Tests\Feature;

use App\Enums\AssessmentDecision;
use App\Enums\AssessmentResultType;
use App\Enums\OverallAssessmentStatus;
use App\Enums\PoolSkillType;
use App\Enums\SkillCategory;
use App\Models\AssessmentResult;
use App\Models\AssessmentStep;
use App\Models\Community;
use App\Models\Pool;
use App\Models\PoolCandidate;
use App\Models\PoolSkill;
use App\Models\Skill;
use App\Models\User;
use App\Models\UserSkill;
use App\Models\WorkExperience;
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

    protected $community;

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

        $this->community = Community::factory()->create();

        $this->pool = Pool::factory()
            ->published()
            ->create([
                'community_id' => $this->community->id,
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
            ->asCommunityRecruiter($this->community->id)
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
                'community_id' => $this->community->id,
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

    public function testOutOfOrderAssessmentsDoNotIncrementStep()
    {
        $steps = $this->pool->assessmentSteps;

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
                            'currentStep' => 1,
                            'overallAssessmentStatus' => OverallAssessmentStatus::TO_ASSESS->name,
                            'assessmentStepStatuses' => [
                                [
                                    'step' => $steps[1]->id,
                                    'decision' => AssessmentDecision::SUCCESSFUL->name,
                                ],
                            ],
                        ],
                    ],
                ],
            ]);
    }

    public function testAllSkillsMustPassToIncrementStep()
    {

        $pool = Pool::factory()
            ->published()
            ->create([
                'community_id' => $this->community->id,
            ]);

        $technicalSkills = Skill::where('category', SkillCategory::TECHNICAL->name)->limit(3)->get();
        $poolSkillOne = PoolSkill::create([
            'pool_id' => $pool->id,
            'skill_id' => $technicalSkills[0]->id,
            'type' => PoolSkillType::ESSENTIAL->name,
        ]);

        // Non-essential skills must also be assessed if a user claims them
        $poolSkillTwo = PoolSkill::create([
            'pool_id' => $pool->id,
            'skill_id' => $technicalSkills[1]->id,
            'type' => PoolSkillType::NONESSENTIAL->name,
        ]);
        $poolSkillThree = PoolSkill::create([
            'pool_id' => $pool->id,
            'skill_id' => $technicalSkills[2]->id,
            'type' => PoolSkillType::NONESSENTIAL->name,
        ]);

        $stepOne = $pool->assessmentSteps->first();

        $stepTwo = AssessmentStep::factory()
            ->afterCreating(function (AssessmentStep $step) use ($poolSkillOne, $poolSkillTwo) {
                $step->poolSkills()->sync([$poolSkillOne->id, $poolSkillTwo->id]);
            })->create([
                'pool_id' => $pool->id,
            ]);

        $user = User::factory()->create();
        UserSkill::factory()->create([
            'user_id' => $user->id,
            'skill_id' => $poolSkillTwo->skill_id,
        ]);
        // Skill is not considered claimed unless it has an attached experience
        $userSkill = UserSkill::factory()->create([
            'user_id' => $user->id,
            'skill_id' => $poolSkillThree->skill_id,
        ]);
        $experience = WorkExperience::factory()->create([
            'user_id' => $user->id,
        ]);
        $experience->userSkills()->sync([
            $userSkill->id => ['details' => 'first skill'],
        ]);

        $candidate = PoolCandidate::factory()->withSnapshot()->create([
            'user_id' => $user->id,
            'pool_id' => $pool->id,
            'submitted_at' => config('constants.past_date'),
            'expiry_date' => config('constants.far_future_date'),
        ]);

        AssessmentResult::factory()
            ->withResultType(AssessmentResultType::EDUCATION)
            ->create([
                'assessment_step_id' => $stepOne->id,
                'pool_candidate_id' => $candidate->id,
                'assessment_decision' => AssessmentDecision::SUCCESSFUL->name,
            ]);

        AssessmentResult::factory()
            ->withResultType(AssessmentResultType::SKILL)
            ->create([
                'assessment_step_id' => $stepOne->id,
                'pool_candidate_id' => $candidate->id,
                'assessment_decision' => AssessmentDecision::SUCCESSFUL->name,
                'pool_skill_id' => $poolSkillOne->id,
            ]);

        // Only one skill assessed so keep on step one with "to assess"
        $this->actingAs($this->adminUser, 'api')
            ->graphQL($this->query, ['id' => $candidate->id])
            ->assertJson([
                'data' => [
                    'poolCandidate' => [
                        'assessmentStatus' => [
                            'currentStep' => 1,
                            'overallAssessmentStatus' => OverallAssessmentStatus::TO_ASSESS->name,
                            'assessmentStepStatuses' => [
                                [
                                    'step' => $stepOne->id,
                                    'decision' => null,
                                ],
                            ],
                        ],
                    ],
                ],
            ]);

        AssessmentResult::factory()
            ->withResultType(AssessmentResultType::SKILL)
            ->create([
                'assessment_step_id' => $stepOne->id,
                'pool_candidate_id' => $candidate->id,
                'assessment_decision' => AssessmentDecision::SUCCESSFUL->name,
                'pool_skill_id' => $poolSkillThree->id,
            ]);
        //
        // Both claimed skills are now assessed so we can increment the step
        $this->actingAs($this->adminUser, 'api')
            ->graphQL($this->query, ['id' => $candidate->id])
            ->assertJson([
                'data' => [
                    'poolCandidate' => [
                        'assessmentStatus' => [
                            'currentStep' => 2,
                            'overallAssessmentStatus' => OverallAssessmentStatus::TO_ASSESS->name,
                            'assessmentStepStatuses' => [
                                [
                                    'step' => $stepOne->id,
                                    'decision' => AssessmentDecision::SUCCESSFUL->name,
                                ],
                            ],
                        ],
                    ],
                ],
            ]);
    }

    public function testNonEssentialAssessmentDisqualifiedPasses()
    {

        $pool = Pool::factory()
            ->published()
            ->create([
                'community_id' => $this->community->id,
            ]);

        $technicalSkills = Skill::where('category', SkillCategory::TECHNICAL->name)->limit(2)->get();
        $poolSkillOne = PoolSkill::create([
            'pool_id' => $pool->id,
            'skill_id' => $technicalSkills[0]->id,
            'type' => PoolSkillType::NONESSENTIAL->name,
        ]);

        // Non-essential technical skills must also be assessed if a user claims them
        $poolSkillTwo = PoolSkill::create([
            'pool_id' => $pool->id,
            'skill_id' => $technicalSkills[1]->id,
            'type' => PoolSkillType::NONESSENTIAL->name,
        ]);

        // Skill is not considered claimed unless it has an attached experience
        $user = User::factory()->create();
        $userSkill = UserSkill::factory()->create([
            'user_id' => $user->id,
            'skill_id' => $poolSkillTwo->skill_id,
        ]);
        WorkExperience::factory()->afterCreating(function (WorkExperience $experience) use ($userSkill) {
            $experience->userSkills()->sync([
                $userSkill->id => ['details' => 'first skill'],
            ]);
        })->create([
            'user_id' => $user->id,
        ]);

        $candidate = PoolCandidate::factory()->withSnapshot()->create([
            'user_id' => $user->id,
            'pool_id' => $pool->id,
            'submitted_at' => config('constants.past_date'),
            'expiry_date' => config('constants.far_future_date'),
        ]);

        $assessmentStep = $pool->assessmentSteps->first();

        AssessmentResult::factory()
            ->withResultType(AssessmentResultType::EDUCATION)
            ->create([
                'assessment_step_id' => $assessmentStep->id,
                'pool_candidate_id' => $candidate->id,
                'assessment_decision' => AssessmentDecision::SUCCESSFUL->name,
            ]);

        AssessmentResult::factory()
            ->withResultType(AssessmentResultType::SKILL)
            ->create([
                'assessment_step_id' => $assessmentStep->id,
                'pool_candidate_id' => $candidate->id,
                'assessment_decision' => AssessmentDecision::SUCCESSFUL->name,
                'pool_skill_id' => $poolSkillOne->id,
            ]);

        $this->actingAs($this->adminUser, 'api')
            ->graphQL($this->query, ['id' => $candidate->id])
            ->assertJson([
                'data' => [
                    'poolCandidate' => [
                        'assessmentStatus' => [
                            'currentStep' => 1,
                            'overallAssessmentStatus' => OverallAssessmentStatus::TO_ASSESS->name,
                            'assessmentStepStatuses' => [
                                [
                                    'step' => $assessmentStep->id,
                                    'decision' => null,
                                ],
                            ],
                        ],
                    ],
                ],
            ]);

        $result = AssessmentResult::factory()
            ->withResultType(AssessmentResultType::SKILL)
            ->create([
                'assessment_step_id' => $assessmentStep->id,
                'pool_candidate_id' => $candidate->id,
                'assessment_decision' => null,
                'pool_skill_id' => $poolSkillTwo->id,
            ]);

        // Should be same result as above when assessed but contains not sure
        $this->actingAs($this->adminUser, 'api')
            ->graphQL($this->query, ['id' => $candidate->id])
            ->assertJson([
                'data' => [
                    'poolCandidate' => [
                        'assessmentStatus' => [
                            'currentStep' => 1,
                            'overallAssessmentStatus' => OverallAssessmentStatus::TO_ASSESS->name,
                            'assessmentStepStatuses' => [
                                [
                                    'step' => $assessmentStep->id,
                                    'decision' => null,
                                ],
                            ],
                        ],
                    ],
                ],
            ]);

        $result->assessment_decision = AssessmentDecision::UNSUCCESSFUL->name;
        $result->save();

        // Qualified since non-essential not considered in overall decision
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
                                    'step' => $assessmentStep->id,
                                    'decision' => AssessmentDecision::SUCCESSFUL->name,
                                ],
                            ],
                        ],
                    ],
                ],
            ]);

    }

    public function testStepWithNoSkillsAlwaysPasses()
    {

        $pool = Pool::factory()
            ->published()
            ->create([
                'community_id' => $this->community->id,
            ]);

        $candidate = PoolCandidate::factory()->withSnapshot()->create([
            'pool_id' => $pool->id,
            'submitted_at' => config('constants.past_date'),
            'expiry_date' => config('constants.far_future_date'),
        ]);

        $stepOne = $pool->assessmentSteps->first();

        $stepTwo = AssessmentStep::factory()->create(['pool_id' => $pool->id]);

        AssessmentResult::factory()
            ->withResultType(AssessmentResultType::EDUCATION)
            ->create([
                'assessment_step_id' => $stepOne->id,
                'pool_candidate_id' => $candidate->id,
                'assessment_decision' => AssessmentDecision::SUCCESSFUL->name,
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

    public function testApplicationScreeningStepEducationResult()
    {
        // pool with two steps, both steps associated with one technical pool skill
        $pool = Pool::factory()
            ->published()
            ->create([
                'community_id' => $this->community->id,
            ]);
        $poolSkill = PoolSkill::create([
            'pool_id' => $pool->id,
            'skill_id' => Skill::factory()->create(['category' => SkillCategory::TECHNICAL->name])->id,
            'type' => PoolSkillType::ESSENTIAL->name,
        ]);
        $stepOne = $pool->assessmentSteps->first();
        $stepTwo = AssessmentStep::factory()
            ->afterCreating(function (AssessmentStep $step) use ($poolSkill) {
                $step->poolSkills()->sync([$poolSkill->id]);
            })->create([
                'pool_id' => $pool->id,
            ]);

        $candidate = PoolCandidate::factory()->withSnapshot()->create([
            'pool_id' => $pool->id,
            'submitted_at' => config('constants.past_date'),
            'expiry_date' => config('constants.far_future_date'),
        ]);

        // overall to assess, step statuses empty
        $this->actingAs($this->adminUser, 'api')
            ->graphQL($this->query, ['id' => $candidate->id])
            ->assertJson([
                'data' => [
                    'poolCandidate' => [
                        'assessmentStatus' => [
                            'currentStep' => 1,
                            'overallAssessmentStatus' => OverallAssessmentStatus::TO_ASSESS->name,
                            'assessmentStepStatuses' => [],
                        ],
                    ],
                ],
            ]);

        AssessmentResult::factory()
            ->withResultType(AssessmentResultType::SKILL)
            ->create([
                'assessment_step_id' => $stepOne->id,
                'pool_candidate_id' => $candidate->id,
                'pool_skill_id' => $poolSkill->id,
                'assessment_decision' => AssessmentDecision::SUCCESSFUL->name,
            ]);

        // application screening skill completed but still step one due to missing education result
        $this->actingAs($this->adminUser, 'api')
            ->graphQL($this->query, ['id' => $candidate->id])
            ->assertJson([
                'data' => [
                    'poolCandidate' => [
                        'assessmentStatus' => [
                            'currentStep' => 1,
                            'overallAssessmentStatus' => OverallAssessmentStatus::TO_ASSESS->name,
                            'assessmentStepStatuses' => [
                                [
                                    'step' => $stepOne->id,
                                    'decision' => null,
                                ],
                            ],
                        ],
                    ],
                ],
            ]);

        AssessmentResult::factory()
            ->withResultType(AssessmentResultType::EDUCATION)
            ->create([
                'assessment_step_id' => $stepOne->id,
                'pool_candidate_id' => $candidate->id,
                'assessment_decision' => AssessmentDecision::SUCCESSFUL->name,
            ]);

        // currentStep now 2 with education result added and step one SUCCESSFUL
        $this->actingAs($this->adminUser, 'api')
            ->graphQL($this->query, ['id' => $candidate->id])
            ->assertJson([
                'data' => [
                    'poolCandidate' => [
                        'assessmentStatus' => [
                            'currentStep' => 2,
                            'overallAssessmentStatus' => OverallAssessmentStatus::TO_ASSESS->name,
                            'assessmentStepStatuses' => [
                                [
                                    'step' => $stepOne->id,
                                    'decision' => AssessmentDecision::SUCCESSFUL->name,
                                ],
                            ],
                        ],
                    ],
                ],
            ]);
    }

    /**
     * This regression test ensures that if all skills are assessed as Successful,
     * except for a single skill in the final step which is Unsuccessful,
     * then the overall status is Disqualified.
     */
    public function testUnsuccessfulEssentialInFinalStepMeansDisqualified(): void
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
                                    'step' => $steps[0]->id,
                                    'decision' => AssessmentDecision::SUCCESSFUL->name,
                                ],
                                [
                                    'step' => $steps[1]->id,
                                    'decision' => AssessmentDecision::UNSUCCESSFUL->name,
                                ],
                            ],
                            'overallAssessmentStatus' => OverallAssessmentStatus::DISQUALIFIED->name,
                            'currentStep' => 2,
                        ],
                    ],
                ],
            ]);
    }
}
