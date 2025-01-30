<?php

namespace Database\Seeders;

use App\Enums\AssessmentDecision;
use App\Enums\AssessmentDecisionLevel;
use App\Enums\AssessmentResultJustification;
use App\Enums\AssessmentResultType;
use App\Enums\AssessmentStepType;
use App\Enums\PoolSkillType;
use App\Models\AssessmentResult;
use App\Models\AssessmentStep;
use App\Models\Pool;
use App\Models\PoolCandidate;
use App\Models\User;
use Faker\Generator;
use Illuminate\Container\Container;
use Illuminate\Database\Seeder;

class AssessmentResultTestSeeder extends Seeder
{
    /**
     * The current Faker instance.
     *
     * @var \Faker\Generator
     */
    protected $faker;

    /**
     * Create a new seeder instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->faker = Container::getInstance()->make(Generator::class);
    }

    /**
     * Seeds initial user records into that database.
     * These users are only useful for testing locally.
     *
     * @return void
     */
    public function run()
    {
        $pool = Pool::select('id')->where('name->en', 'CMO Digital Careers')->sole();

        // specific pool
        $poolCandidate =
            PoolCandidate::where('pool_id', $pool->id)->first() ??
            PoolCandidate::factory()->createQuietly([
                'pool_id' => $pool->id,
            ]);
        $dcmPoolSkills = $pool->poolSkills()->pluck('id')->toArray();
        $dcmAssessment1 = AssessmentStep::factory()->create([
            'pool_id' => $pool->id,
        ]);
        $dcmAssessment2 = AssessmentStep::factory()->create([
            'pool_id' => $pool->id,
        ]);
        AssessmentResult::factory()->withResultType(AssessmentResultType::EDUCATION)->create([
            'assessment_step_id' => $dcmAssessment1->id,
            'pool_candidate_id' => $poolCandidate->id,
        ]);
        AssessmentResult::factory()->withResultType(AssessmentResultType::SKILL)->create([
            'assessment_step_id' => $dcmAssessment2->id,
            'pool_candidate_id' => $poolCandidate->id,
            'pool_skill_id' => $dcmPoolSkills[0],
        ]);
        AssessmentResult::factory()->withResultType(AssessmentResultType::SKILL)->create([
            'assessment_step_id' => $dcmAssessment2->id,
            'pool_candidate_id' => $poolCandidate->id,
            'pool_skill_id' => $dcmPoolSkills[1],
        ]);

        $publishedPool = Pool::select('id')->where('name->en', 'Published – Complex')->sole();
        $publishedPool->load('assessmentSteps.poolSkills');
        foreach ($publishedPool->assessmentSteps as $assessmentStep) {
            $user1 = User::select('id')->where('email', 'perfect@test.com')->sole();
            $poolCandidate1 = PoolCandidate::select('id')->where('user_id', $user1->id)->where('pool_id', $publishedPool->id)->sole();
            $this->assessSkillsWithLevelAndJustification(
                $poolCandidate1,
                $assessmentStep->poolSkills,
                $assessmentStep,
                AssessmentDecisionLevel::ABOVE_REQUIRED->name,
                [AssessmentResultJustification::EDUCATION_ACCEPTED_INFORMATION->name],
                AssessmentDecision::SUCCESSFUL->name,
                AssessmentResultType::EDUCATION);
            $this->assessSkillsWithLevelAndJustification(
                $poolCandidate1,
                $assessmentStep->poolSkills,
                $assessmentStep,
                AssessmentDecisionLevel::ABOVE_REQUIRED->name,
                null,
                AssessmentDecision::SUCCESSFUL->name,
                AssessmentResultType::SKILL);

            $user2 = User::select('id')->where('email', 'veteran@test.com')->sole();
            $poolCandidate2 = PoolCandidate::select('id')->where('user_id', $user2->id)->where('pool_id', $publishedPool->id)->sole();
            $this->assessSkillsWithLevelAndJustification(
                $poolCandidate2,
                $assessmentStep->poolSkills()->where('type', PoolSkillType::ESSENTIAL->name)->get(),
                $assessmentStep,
                AssessmentDecisionLevel::AT_REQUIRED->name,
                null,
                AssessmentDecision::SUCCESSFUL->name,
                AssessmentResultType::SKILL);

            $user3 = User::select('id')->where('email', 'assertive@test.com')->sole();
            $poolCandidate3 = PoolCandidate::select('id')->where('user_id', $user3->id)->where('pool_id', $publishedPool->id)->sole();
            $this->assessSkillsWithLevelAndJustification(
                $poolCandidate3,
                $assessmentStep->poolSkills,
                $assessmentStep,
                AssessmentDecisionLevel::ABOVE_REQUIRED->name,
                null,
                AssessmentDecision::SUCCESSFUL->name,
                AssessmentResultType::SKILL);

            $user4 = User::select('id')->where('email', 'absent@test.com')->sole();
            $poolCandidate4 = PoolCandidate::select('id')->where('user_id', $user4->id)->where('pool_id', $publishedPool->id)->sole();
            $this->assessSkillsWithLevelAndJustification(
                $poolCandidate4,
                $assessmentStep->poolSkills()->where('type', PoolSkillType::ESSENTIAL->name)->get(),
                $assessmentStep, AssessmentDecisionLevel::AT_REQUIRED->name,
                null,
                AssessmentDecision::HOLD->name,
                AssessmentResultType::SKILL);

            $user5 = User::select('id')->where('email', 'screened-out@test.com')->sole();
            $poolCandidate5 = PoolCandidate::select('id')->where('user_id', $user5->id)->where('pool_id', $publishedPool->id)->sole();
            $this->assessSkillsWithLevelAndJustification(
                $poolCandidate5,
                $assessmentStep->poolSkills()->where('type', PoolSkillType::ESSENTIAL->name)->get(),
                $assessmentStep,
                AssessmentDecisionLevel::AT_REQUIRED->name,
                [AssessmentResultJustification::EDUCATION_FAILED_NOT_RELEVANT->name,
                    AssessmentResultJustification::EDUCATION_FAILED_REQUIREMENT_NOT_MET->name],
                AssessmentDecision::UNSUCCESSFUL->name,
                AssessmentResultType::EDUCATION);

            $user6 = User::select('id')->where('email', 'failed@test.com')->sole();
            $poolCandidate6 = PoolCandidate::select('id')->where('user_id', $user6->id)->where('pool_id', $publishedPool->id)->sole();
            $this->assessSkillsWithLevelAndJustification(
                $poolCandidate6,
                $assessmentStep->poolSkills,
                $assessmentStep,
                null,
                [AssessmentResultJustification::EDUCATION_FAILED_REQUIREMENT_NOT_MET->name],
                AssessmentDecision::UNSUCCESSFUL->name,
                AssessmentResultType::EDUCATION);

            $user7 = User::select('id')->where('email', 'entry-level-holder@test.com')->sole();
            $poolCandidate7 = PoolCandidate::select('id')->where('user_id', $user7->id)->where('pool_id', $publishedPool->id)->sole();
            $this->assessSkillsWithLevelAndJustification(
                $poolCandidate7,
                null,
                $assessmentStep,
                null,
                [AssessmentResultJustification::EDUCATION_ACCEPTED_WORK_EXPERIENCE_EQUIVALENCY->name],
                AssessmentDecision::HOLD->name,
                assessmentResultType::EDUCATION);
            $this->assessSkillsWithLevelAndJustification(
                $poolCandidate7,
                $assessmentStep->poolSkills,
                $assessmentStep,
                null,
                null,
                AssessmentDecision::HOLD->name,
                assessmentResultType::SKILL);

            $user8 = User::select('id')->where('email', 'unsuccessful@test.com')->sole();
            $poolCandidate8 = PoolCandidate::select('id')->where('user_id', $user8->id)->where('pool_id', $publishedPool->id)->sole();
            // select first essential skill from pool skills
            $firstEssentialSkill = $assessmentStep->poolSkills()->where('type', PoolSkillType::ESSENTIAL->name)->get()->first();
            $this->assessSkillsWithLevelAndJustification(
                $poolCandidate8,
                [$firstEssentialSkill],
                $assessmentStep,
                null,
                [AssessmentResultJustification::SKILL_FAILED_INSUFFICIENTLY_DEMONSTRATED->name,
                    AssessmentResultJustification::FAILED_NOT_ENOUGH_INFORMATION->name,
                    AssessmentResultJustification::FAILED_OTHER->name],
                AssessmentDecision::UNSUCCESSFUL->name,
                AssessmentResultType::SKILL);
        }
    }

    private function assessSkillsWithLevelAndJustification($poolCandidate,
        $poolSkills,
        $assessmentStep,
        $level,
        $justifications,
        $assessmentDecision,
        $assessmentResultType)
    {
        // Only save education assessment for the first assessment step
        if ($assessmentResultType == AssessmentResultType::EDUCATION && $assessmentStep->type != AssessmentStepType::APPLICATION_SCREENING->name) {
            return;
        }

        $nullJustifications = $assessmentDecision === AssessmentDecision::HOLD->name || is_null($assessmentDecision);

        if ($assessmentResultType == null) {
            $assessmentResultType = AssessmentResultType::SKILL;
        } elseif ($assessmentResultType == AssessmentResultType::EDUCATION) {
            AssessmentResult::factory()->withResultType($assessmentResultType)->create([
                'assessment_step_id' => $assessmentStep->id,
                'pool_candidate_id' => $poolCandidate->id,
                'justifications' => $nullJustifications ? null : $justifications,
                'assessment_decision' => $assessmentDecision,
            ]);
        } else {
            foreach ($poolSkills as $poolSkill) {
                AssessmentResult::factory()->withResultType($assessmentResultType)->create([
                    'assessment_step_id' => $assessmentStep->id,
                    'pool_candidate_id' => $poolCandidate->id,
                    'pool_skill_id' => $poolSkill->id,
                    'assessment_decision_level' => $level,
                    'justifications' => $nullJustifications ? null : $justifications,
                    'assessment_decision' => $assessmentDecision,
                ]);
            }
        }
    }
}
