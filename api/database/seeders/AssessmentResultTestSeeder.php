<?php

namespace Database\Seeders;

use App\Enums\AssessmentDecision;
use App\Enums\AssessmentDecisionLevel;
use App\Enums\AssessmentResultJustification;
use App\Enums\AssessmentResultType;
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
            PoolCandidate::factory()->create([
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

        $securityAnalystPool = Pool::select('id')->where('name->en', 'IT-03 Published – Complex')->sole();
        $user1 = User::select('id')->where('first_name', 'Perfect')->sole();
        $poolCandidate1 = PoolCandidate::select('id')->where('user_id', $user1->id)->where('pool_id', $securityAnalystPool->id)->sole();
        $assessmentStep = AssessmentStep::factory()->create([
            'pool_id' => $securityAnalystPool->id,
        ]);
        $this->assessSkillsWithLevelAndJustification($poolCandidate1, $securityAnalystPool->poolSkills()->pluck('id')->toArray(), $assessmentStep, AssessmentDecisionLevel::ABOVE_REQUIRED->name, [AssessmentResultJustification::EDUCATION_ACCEPTED_INFORMATION->name], AssessmentDecision::SUCCESSFUL->name, AssessmentResultType::EDUCATION);

        $user2 = User::select('id')->where('first_name', 'Barely qualified')->sole();
        $poolCandidate2 = PoolCandidate::select('id')->where('user_id', $user2->id)->where('pool_id', $securityAnalystPool->id)->sole();
        $this->assessSkillsWithLevelAndJustification($poolCandidate2, $securityAnalystPool->poolSkills()->where('type', PoolSkillType::ESSENTIAL->name)->pluck('id')->toArray(), $assessmentStep, AssessmentDecisionLevel::AT_REQUIRED->name, [AssessmentResultJustification::EDUCATION_ACCEPTED_WORK_EXPERIENCE_EQUIVALENCY->name], AssessmentDecision::SUCCESSFUL->name, AssessmentResultType::SKILL);

        $user3 = User::select('id')->where('first_name', 'Try-hard')->sole();
        $poolCandidate3 = PoolCandidate::select('id')->where('user_id', $user3->id)->where('pool_id', $securityAnalystPool->id)->sole();
        $this->assessSkillsWithLevelAndJustification($poolCandidate3, $securityAnalystPool->poolSkills()->pluck('id')->toArray(), $assessmentStep, AssessmentDecisionLevel::ABOVE_REQUIRED->name, [AssessmentResultJustification::EDUCATION_ACCEPTED_WORK_EXPERIENCE_EQUIVALENCY->name], AssessmentDecision::SUCCESSFUL->name, AssessmentResultType::SKILL);

        $user4 = User::select('id')->where('first_name', 'Absent')->sole();
        $poolCandidate4 = PoolCandidate::select('id')->where('user_id', $user4->id)->where('pool_id', $securityAnalystPool->id)->sole();
        $this->assessSkillsWithLevelAndJustification($poolCandidate4, $securityAnalystPool->poolSkills()->where('type', PoolSkillType::ESSENTIAL->name)->pluck('id')->toArray(), $assessmentStep, AssessmentDecisionLevel::AT_REQUIRED->name, [AssessmentResultJustification::EDUCATION_ACCEPTED_WORK_EXPERIENCE_EQUIVALENCY->name], AssessmentDecision::HOLD->name, AssessmentResultType::SKILL);

        $user5 = User::select('id')->where('first_name', 'Screened-out')->sole();
        $poolCandidate5 = PoolCandidate::select('id')->where('user_id', $user5->id)->where('pool_id', $securityAnalystPool->id)->sole();
        $this->assessSkillsWithLevelAndJustification($poolCandidate5, $securityAnalystPool->poolSkills()->where('type', PoolSkillType::ESSENTIAL->name)->pluck('id')->toArray(), $assessmentStep, AssessmentDecisionLevel::AT_REQUIRED->name, [AssessmentResultJustification::EDUCATION_FAILED_NOT_RELEVANT->name, AssessmentResultJustification::EDUCATION_FAILED_REQUIREMENT_NOT_MET->name], AssessmentDecision::UNSUCCESSFUL->name, AssessmentResultType::EDUCATION);

        $user6 = User::select('id')->where('first_name', 'Failed')->sole();
        $poolCandidate6 = PoolCandidate::select('id')->where('user_id', $user6->id)->where('pool_id', $securityAnalystPool->id)->sole();
        $this->assessSkillsWithLevelAndJustification($poolCandidate6, $securityAnalystPool->poolSkills()->pluck('id')->toArray(), $assessmentStep, null, [AssessmentResultJustification::EDUCATION_FAILED_REQUIREMENT_NOT_MET->name], AssessmentDecision::UNSUCCESSFUL->name, AssessmentResultType::EDUCATION);

        $user7 = User::select('id')->where('first_name', 'Barely')->sole();
        $poolCandidate7 = PoolCandidate::select('id')->where('user_id', $user7->id)->where('pool_id', $securityAnalystPool->id)->sole();
        $this->assessSkillsWithLevelAndJustification($poolCandidate7, null, $assessmentStep, null, AssessmentResultJustification::EDUCATION_ACCEPTED_WORK_EXPERIENCE_EQUIVALENCY->name, AssessmentDecision::HOLD->name, assessmentResultType::EDUCATION);
        $this->assessSkillsWithLevelAndJustification($poolCandidate7, $securityAnalystPool->poolSkills()->pluck('id')->toArray(), $assessmentStep, null, [AssessmentResultJustification::SKILL_FAILED_INSUFFICIENTLY_DEMONSTRATED], AssessmentDecision::HOLD->name, assessmentResultType::SKILL);

        $user8 = User::select('id')->where('first_name', 'Unsuccessful')->sole();
        $poolCandidate8 = PoolCandidate::select('id')->where('user_id', $user8->id)->where('pool_id', $securityAnalystPool->id)->sole();
        // select first essential skill from pool skills
        $firstEssentialSkill = $securityAnalystPool->poolSkills()->where('type', PoolSkillType::ESSENTIAL->name)->first();
        $this->assessSkillsWithLevelAndJustification($poolCandidate8, [$firstEssentialSkill->id], $assessmentStep, null, [AssessmentResultJustification::SKILL_FAILED_INSUFFICIENTLY_DEMONSTRATED->name,
            AssessmentResultJustification::FAILED_NOT_ENOUGH_INFORMATION->name,
            AssessmentResultJustification::FAILED_OTHER->name],
            AssessmentDecision::UNSUCCESSFUL->name, AssessmentResultType::SKILL);

    }

    private function assessSkillsWithLevelAndJustification($poolCandidate, $poolSkills, $assessmentStep, $level, $justifications, $assessmentDecision, $assessmentResultType)
    {
        if ($assessmentResultType == null) {
            $assessmentResultType = AssessmentResultType::SKILL;
        } elseif ($assessmentResultType == AssessmentResultType::EDUCATION) {
            AssessmentResult::factory()->withResultType($assessmentResultType)->create([
                'assessment_step_id' => $assessmentStep->id,
                'pool_candidate_id' => $poolCandidate->id,
                'justifications' => json_encode($justifications),
                'assessment_decision' => $assessmentDecision,
            ]);
        } else {
            foreach ($poolSkills as $poolSkill) {
                AssessmentResult::factory()->withResultType($assessmentResultType)->create([
                    'assessment_step_id' => $assessmentStep->id,
                    'pool_candidate_id' => $poolCandidate->id,
                    'pool_skill_id' => $poolSkill,
                    'assessment_decision_level' => $level,
                    'justifications' => json_encode($justifications),
                    'assessment_decision' => $assessmentDecision,
                ]);
            }
        }
    }
}
