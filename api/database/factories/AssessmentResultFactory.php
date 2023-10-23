<?php

namespace Database\Factories;

use App\Enums\AssessmentDecision;
use App\Enums\AssessmentResultJustification;
use App\Enums\AssessmentResultType;
use App\Enums\SkillDecisionLevel;
use App\Models\AssessmentResult;
use App\Models\AssessmentStep;
use App\Models\PoolCandidate;
use Illuminate\Database\Eloquent\Factories\Factory;

class AssessmentResultFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = AssessmentResult::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $educationJustifications = [
            AssessmentResultJustification::EDUCATION_ACCEPTED_INFORMATION->name,
            AssessmentResultJustification::EDUCATION_ACCEPTED_COMBINATION_EDUCATION_WORK_EXPERIENCE->name,
            AssessmentResultJustification::EDUCATION_ACCEPTED_WORK_EXPERIENCE_EQUIVALENCY->name,
            AssessmentResultJustification::EDUCATION_FAILED_NOT_RELEVANT->name,
            AssessmentResultJustification::EDUCATION_FAILED_REQUIREMENT_NOT_MET->name,
            AssessmentResultJustification::FAILED_NOT_ENOUGH_INFORMATION->name,
            AssessmentResultJustification::FAILED_OTHER->name,
        ];

        $skillJustifications = [
            AssessmentResultJustification::SKILL_ACCEPTED->name,
            AssessmentResultJustification::SKILL_FAILED_INSUFFICIENTLY_DEMONSTRATED->name,
            AssessmentResultJustification::FAILED_NOT_ENOUGH_INFORMATION->name,
            AssessmentResultJustification::FAILED_OTHER->name,
        ];

        $assessmentResultType = $this->faker->randomElement(array_column(AssessmentResultType::cases(), 'name'));
        $assessmentDecision = $this->faker->randomElement(array_column(AssessmentDecision::cases(), 'name'));
        $justifications = $assessmentResultType === AssessmentResultType::EDUCATION->name ?
            [$this->faker->randomElement($educationJustifications)] :
            [$this->faker->randomElement($skillJustifications)];

        return [
            'assessment_step_id' => AssessmentStep::factory(),
            'pool_candidate_id' => PoolCandidate::factory(),
            'assessment_result_type' => $assessmentResultType,
            'assessment_decision' => $assessmentDecision,
            'justifications' => $justifications,
            'other_justification_notes' => in_array(AssessmentResultJustification::FAILED_OTHER->name, $justifications) ?
                $this->faker->paragraph() : null,
            'skill_decision_level' => $assessmentResultType === AssessmentResultType::SKILL->name &&
                $assessmentDecision === AssessmentDecision::DEMONSTRATED->name ?
                $this->faker->randomElement(array_column(SkillDecisionLevel::cases(), 'name')) : null,
            'skill_decision_notes' => $assessmentResultType === AssessmentResultType::SKILL->name &&
                $assessmentDecision === AssessmentDecision::DEMONSTRATED->name ?
                $this->faker->paragraph() : null,
        ];
    }
}
