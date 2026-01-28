<?php

namespace Tests\Feature;

use App\Enums\AssessmentDecision;
use App\Enums\AssessmentResultType;
use App\Enums\CandidateRemovalReason;
use App\Enums\DisqualificationReason;
use App\Enums\OverallAssessmentStatus;
use App\Enums\PlacementType;
use App\Enums\PoolCandidateStatus;
use App\Enums\PoolSkillType;
use App\Enums\SkillCategory;
use App\Models\AssessmentResult;
use App\Models\AssessmentStep;
use App\Models\Community;
use App\Models\Department;
use App\Models\Pool;
use App\Models\PoolCandidate;
use App\Models\PoolSkill;
use App\Models\Skill;
use App\Models\User;
use App\Models\UserSkill;
use App\Models\WorkExperience;
use Carbon\Carbon;
use Database\Seeders\RolePermissionSeeder;
use Database\Seeders\SkillFamilySeeder;
use Database\Seeders\SkillSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Tests\TestCase;
use Tests\UsesProtectedGraphqlEndpoint;

use function PHPUnit\Framework\assertEquals;

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

    protected $query = <<<'GRAPHQL'
        query poolCandidate($id: UUID!) {
            poolCandidate(id: $id) {
                assessmentStatus {
                    overallAssessmentStatus
                    assessmentStepStatuses {
                        step
                        decision
                    }
                }
            }
        }
    GRAPHQL;

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

        $this->poolSkill = $this->pool->poolSkills
            ->first(fn ($poolSkill) => $poolSkill->type === PoolSkillType::ESSENTIAL->name &&
                $poolSkill->skill->category === SkillCategory::TECHNICAL->name
            );

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
            'removed_at' => null,
            'final_decision_at' => null,
            'assessment_step_id' => $this->pool->assessmentSteps->first()?->id,
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
            ->draft()
            ->create([
                'community_id' => $this->community->id,
                'published_at' => config('constants.past_datetime'),
                'closing_date' => config('constants.far_future_datetime'),
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
            'removed_at' => null,
            'final_decision_at' => null,
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

    public function testOnlyEssentialSkillsMustPassToIncrementStep()
    {
        $pool = Pool::factory()
            ->published()
            ->create([
                'community_id' => $this->community->id,
            ]);

        $technicalSkills = Skill::where('category', SkillCategory::TECHNICAL->name)->limit(2)->get();
        $poolSkillOne = $pool->poolSkills
            ->first(fn ($poolSkill) => $poolSkill->type === PoolSkillType::ESSENTIAL->name &&
                $poolSkill->skill->category === SkillCategory::TECHNICAL->name
            );

        // Non-essential skills never need to be assessed
        $poolSkillTwo = PoolSkill::create([
            'pool_id' => $pool->id,
            'skill_id' => $technicalSkills[1]->id,
            'type' => PoolSkillType::NONESSENTIAL->name,
        ]);

        $stepOne = $pool->assessmentSteps->first();

        AssessmentStep::factory()
            ->afterCreating(function (AssessmentStep $step) use ($poolSkillOne, $poolSkillTwo) {
                $step->poolSkills()->sync([$poolSkillOne->id, $poolSkillTwo->id]);
            })->create([
                'pool_id' => $pool->id,
            ]);

        $user = User::factory()->create();

        $candidate = PoolCandidate::factory()->withSnapshot()->create([
            'user_id' => $user->id,
            'pool_id' => $pool->id,
            'submitted_at' => config('constants.past_date'),
            'expiry_date' => config('constants.far_future_date'),
            'removed_at' => null,
            'final_decision_at' => null,
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

        // Only the essential skill must be assessed so we can increment the step already
        $this->actingAs($this->adminUser, 'api')
            ->graphQL($this->query, ['id' => $candidate->id])
            ->assertJson([
                'data' => [
                    'poolCandidate' => [
                        'assessmentStatus' => [
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
            ->draft()
            ->create([
                'community_id' => $this->community->id,
                'published_at' => config('constants.past_datetime'),
                'closing_date' => config('constants.far_future_datetime'),
            ]);

        $technicalSkills = Skill::where('category', SkillCategory::TECHNICAL->name)->limit(2)->get();
        $poolSkillOne = PoolSkill::create([
            'pool_id' => $pool->id,
            'skill_id' => $technicalSkills[0]->id,
            'type' => PoolSkillType::NONESSENTIAL->name,
        ]);

        // Non-essential technical skills need not be assessed even if a user claims them
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
            'removed_at' => null,
            'final_decision_at' => null,
        ]);

        $assessmentStep = $pool->assessmentSteps->first();

        AssessmentResult::factory()
            ->withResultType(AssessmentResultType::EDUCATION)
            ->create([
                'assessment_step_id' => $assessmentStep->id,
                'pool_candidate_id' => $candidate->id,
                'assessment_decision' => AssessmentDecision::SUCCESSFUL->name,
            ]);

        // Non-essential skills don't need to be assessed, so we are already qualified
        $this->actingAs($this->adminUser, 'api')
            ->graphQL($this->query, ['id' => $candidate->id])
            ->assertJson([
                'data' => [
                    'poolCandidate' => [
                        'assessmentStatus' => [
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

        $result->assessment_decision = AssessmentDecision::UNSUCCESSFUL->name;
        $result->save();

        // Qualified since non-essential not considered in overall decision
        $this->actingAs($this->adminUser, 'api')
            ->graphQL($this->query, ['id' => $candidate->id])
            ->assertJson([
                'data' => [
                    'poolCandidate' => [
                        'assessmentStatus' => [
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
            ->draft()
            ->create([
                'community_id' => $this->community->id,
                'published_at' => config('constants.past_datetime'),
                'closing_date' => config('constants.far_future_datetime'),
            ]);

        $candidate = PoolCandidate::factory()->withSnapshot()->create([
            'pool_id' => $pool->id,
            'submitted_at' => config('constants.past_date'),
            'expiry_date' => config('constants.far_future_date'),
            'removed_at' => null,
            'final_decision_at' => null,
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
            ->draft()
            ->create([
                'community_id' => $this->community->id,
                'published_at' => config('constants.past_datetime'),
                'closing_date' => config('constants.far_future_datetime'),
            ]);

        $poolSkill = PoolSkill::create([
            'pool_id' => $pool->id,
            'skill_id' => Skill::factory()->create(['category' => SkillCategory::TECHNICAL->name])->id,
            'type' => PoolSkillType::ESSENTIAL->name,
        ]);

        // Add an essential behavioural that does not need to be assessed to pass the first step
        PoolSkill::create([
            'pool_id' => $pool->id,
            'skill_id' => Skill::factory()->create(['category' => SkillCategory::BEHAVIOURAL->name])->id,
            'type' => PoolSkillType::ESSENTIAL->name,
        ]);
        $stepOne = $pool->assessmentSteps->first();
        AssessmentStep::factory()
            ->afterCreating(function (AssessmentStep $step) use ($poolSkill) {
                $step->poolSkills()->sync([$poolSkill->id]);
            })->create([
                'pool_id' => $pool->id,
            ]);

        $candidate = PoolCandidate::factory()->withSnapshot()->create([
            'pool_id' => $pool->id,
            'submitted_at' => config('constants.past_date'),
            'expiry_date' => config('constants.far_future_date'),
            'removed_at' => null,
            'final_decision_at' => null,
            'assessment_step_id' => $stepOne->id,
        ]);

        // overall to assess, step statuses empty
        $this->actingAs($this->adminUser, 'api')
            ->graphQL($this->query, ['id' => $candidate->id])
            ->assertJson([
                'data' => [
                    'poolCandidate' => [
                        'assessmentStatus' => [
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
                        ],
                    ],
                ],
            ]);
    }

    /** Event ComputeCandidateAssessmentStatus can change the pool_candidate_status field
     * Assert it is changed when the initial status is NEW_APPLICATION and unchanged otherwise
     */
    public function testComputeCandidateAssessmentStatusUpdatesPoolCandidateStatus(): void
    {
        $step = $this->pool->assessmentSteps[0];
        $statuses = array_merge(
            PoolCandidateStatus::toAssessGroup(),
            PoolCandidateStatus::finalDecisionGroup(),
        );

        foreach ($statuses as $status) {
            $candidate = PoolCandidate::factory()->create([
                'pool_id' => $this->pool->id,
                'pool_candidate_status' => $status,
                'submitted_at' => config('constants.past_date'),
                'expiry_date' => config('constants.far_future_date'),
                'removed_at' => null,
                'final_decision_at' => null,
            ]);

            AssessmentResult::factory()
                ->withResultType(AssessmentResultType::EDUCATION)
                ->create([
                    'assessment_step_id' => $step->id,
                    'pool_candidate_id' => $candidate->id,
                    'assessment_decision' => AssessmentDecision::SUCCESSFUL->name,
                ]);

            $candidate->refresh();

            if ($status === PoolCandidateStatus::NEW_APPLICATION->name) {
                assertEquals($candidate->pool_candidate_status, PoolCandidateStatus::UNDER_ASSESSMENT->name);
            } else {
                assertEquals($candidate->pool_candidate_status, $status);
            }
        }
    }

    // step through the ROD mutations (qualify, revert, etc) and check what they set the current step to
    public function testRODMutationsAndTheirEffectOnCurrentStep(): void
    {
        // define mutations
        $qualifyCandidateMutation =
        /** @lang GraphQL */
        '
        mutation qualifyCandidate($id: UUID!, $poolCandidate: QualifyCandidateInput!) {
            qualifyCandidate(id: $id, poolCandidate: $poolCandidate) {
                id
                finalDecisionAt
                assessmentStep { sortOrder }
            }
          }
    ';
        $qualifyAndPlaceCandidateMutation =
        /** @lang GraphQL */
        '
        mutation qualifyAndPlaceCandidate($id: UUID!, $poolCandidate: QualifyAndPlaceCandidateInput!) {
            qualifyAndPlaceCandidate(id: $id, poolCandidate: $poolCandidate) {
                id
                finalDecisionAt
                assessmentStep { sortOrder }
            }
          }
    ';
        $revertPlaceCandidateMutation =
        /** @lang GraphQL */
        '
        mutation revertPlaceCandidate($id: UUID!) {
            revertPlaceCandidate(id: $id) {
                id
                status { value }
                placedAt
                placedDepartment {
                    id
                }
            }
        }
    ';
        $disqualifyCandidateMutation =
        /** @lang GraphQL */
        '
        mutation disqualifyCandidate($id: UUID!, $reason: DisqualificationReason!) {
            disqualifyCandidate(id: $id, reason: $reason) {
                id
                finalDecisionAt
                assessmentStep { sortOrder }
            }
          }
    ';
        $revertFinalDecisionMutation =
        /** @lang GraphQL */
        '
        mutation revertFinalDecision($id: UUID!) {
            revertFinalDecision(id: $id) {
                id
                finalDecisionAt
                assessmentStep { sortOrder }
            }
          }
    ';
        $removeCandidateMutation =
            /** @lang GraphQL */
            '
        mutation removeCandidate($id: UUID!, $removalReason: CandidateRemovalReason!, $removalReasonOther: String) {
            removeCandidate (
                id: $id,
                removalReason: $removalReason,
                removalReasonOther: $removalReasonOther
            ){
                id
                removedAt
                assessmentStep { sortOrder }
            }
        }
    ';
        $reinstateCandidateMutation =
            /** @lang GraphQL */
            '
        mutation reinstateCandidate($id: UUID!) {
            reinstateCandidate (id: $id){
                id
                removedAt
                assessmentStep { sortOrder }
            }
        }
    ';
        $communityAdminUser = User::factory()
            ->asApplicant()
            ->asCommunityAdmin($this->community->id)
            ->create();
        $candidate = PoolCandidate::factory()->create([
            'pool_id' => $this->pool->id,
            'pool_candidate_status' => PoolCandidateStatus::NEW_APPLICATION->name,
            'submitted_at' => config('constants.past_date'),
            'expiry_date' => config('constants.far_future_date'),
            'removed_at' => null,
            'final_decision_at' => null,
        ]);
        $department = Department::factory()->create();

        // reliable date to assert against
        Carbon::setTestNow('2000-01-01 00:00:00');

        // qualify - current step null
        $this->actingAs($communityAdminUser, 'api')
            ->graphQL(
                $qualifyCandidateMutation,
                [
                    'id' => $candidate->id,
                    'poolCandidate' => [
                        'expiryDate' => config('constants.far_future_date'),
                    ],
                ]
            )
            ->assertJsonFragment([
                'id' => $candidate->id,
                'finalDecisionAt' => '2000-01-01 00:00:00',
                'assessmentStep' => null,
            ]);

        // revert - current step set
        $this->actingAs($communityAdminUser, 'api')
            ->graphQL(
                $revertFinalDecisionMutation,
                [
                    'id' => $candidate->id,
                ]
            )
            ->assertJsonFragment([
                'id' => $candidate->id,
                'finalDecisionAt' => null,
                'assessmentStep' => null,
            ]);

        // disqualify - current step null
        $this->actingAs($communityAdminUser, 'api')
            ->graphQL(
                $disqualifyCandidateMutation,
                [
                    'id' => $candidate->id,
                    'reason' => DisqualificationReason::SCREENED_OUT_APPLICATION->name,
                ]
            )
            ->assertJsonFragment([
                'id' => $candidate->id,
                'finalDecisionAt' => '2000-01-01 00:00:00',
                'assessmentStep' => null,
            ]);

        // revert - current step set
        $this->actingAs($communityAdminUser, 'api')
            ->graphQL(
                $revertFinalDecisionMutation,
                [
                    'id' => $candidate->id,
                ]
            )
            ->assertJsonFragment([
                'id' => $candidate->id,
                'finalDecisionAt' => null,
                'assessmentStep' => null,
            ]);

        // qualify and place - current step set
        $this->actingAs($communityAdminUser, 'api')
            ->graphQL(
                $qualifyAndPlaceCandidateMutation,
                [
                    'id' => $candidate->id,
                    'poolCandidate' => [
                        'expiryDate' => config('constants.far_future_date'),
                        'placementType' => PlacementType::UNDER_CONSIDERATION->name,
                        'department' => ['connect' => $department->id],
                    ],
                ]
            )
            ->assertJsonFragment([
                'id' => $candidate->id,
                'finalDecisionAt' => '2000-01-01 00:00:00',
                'assessmentStep' => null,
            ]);

        // revert place - current step unchanged
        $this->actingAs($communityAdminUser, 'api')
            ->graphQL(
                $revertPlaceCandidateMutation,
                [
                    'id' => $candidate->id,
                ]
            )
            ->assertJsonFragment([
                'id' => $candidate->id,
            ]);

        // revert - current step
        $this->actingAs($communityAdminUser, 'api')
            ->graphQL(
                $revertFinalDecisionMutation,
                [
                    'id' => $candidate->id,
                ]
            )
            ->assertJsonFragment([
                'id' => $candidate->id,
                'finalDecisionAt' => null,
                'assessmentStep' => null,
            ]);

        // remove - current step null
        $this->actingAs($communityAdminUser, 'api')
            ->graphQL(
                $removeCandidateMutation,
                [
                    'id' => $candidate->id,
                    'removalReason' => CandidateRemovalReason::NOT_RESPONSIVE->name,
                ]
            )
            ->assertJsonFragment([
                'id' => $candidate->id,
                'removedAt' => '2000-01-01 00:00:00',
                'assessmentStep' => null,
            ]);

        // reinstate - current step set
        $this->actingAs($communityAdminUser, 'api')
            ->graphQL(
                $reinstateCandidateMutation,
                [
                    'id' => $candidate->id,
                ]
            )
            ->assertJsonFragment([
                'id' => $candidate->id,
                'removedAt' => null,
                'assessmentStep' => null,
            ]);
    }
}
