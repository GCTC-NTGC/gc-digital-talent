<?php

namespace Database\Factories;

use App\Enums\AssessmentDecision;
use App\Enums\AssessmentDecisionLevel;
use App\Enums\AssessmentResultJustification;
use App\Enums\AssessmentResultType;
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
        $assessmentResultType = $this->faker->randomElement(array_column(AssessmentResultType::cases(), 'name'));
        $assessmentDecision = $this->faker->randomElement([...array_column(AssessmentDecision::cases(), 'name'), null]);
        $justifications = $assessmentResultType === AssessmentResultType::EDUCATION->name ?
            [$this->faker->randomElement(array_column(AssessmentResultJustification::educationJustifications(), 'name'))] :
            [$this->faker->randomElement(array_column(AssessmentResultJustification::skillJustifications(), 'name'))];

        return [
            'assessment_step_id' => AssessmentStep::factory(),
            'pool_candidate_id' => PoolCandidate::factory(),
            'assessment_result_type' => $assessmentResultType,
            'assessment_decision' => $assessmentDecision,
            'justifications' => $justifications,
            'other_justification_notes' => in_array(AssessmentResultJustification::FAILED_OTHER->name, $justifications) ?
                $this->faker->paragraph() : null,
            'assessment_decision_level' => $assessmentResultType === AssessmentResultType::SKILL->name &&
                $assessmentDecision === AssessmentDecision::SUCCESSFUL->name ?
                $this->faker->randomElement(array_column(AssessmentDecisionLevel::cases(), 'name')) : null,
            'skill_decision_notes' => $assessmentResultType === AssessmentResultType::SKILL->name &&
                $assessmentDecision === AssessmentDecision::SUCCESSFUL->name ?
                $this->faker->paragraph() : null,
            'assessment_notes' => $this->faker->paragraphs(3, true),
        ];
    }

    /**
     * Pick result type and constrain related fields
     */
    public function withResultType(AssessmentResultType $type)
    {
        return $this->state(function () use ($type) {
            if ($type === AssessmentResultType::EDUCATION) {
                $justifications = [$this->faker->randomElement(array_column(AssessmentResultJustification::educationJustifications(), 'name'))];

                return [
                    'assessment_result_type' => $type->name,
                    'justifications' => $justifications,
                    'other_justification_notes' => in_array(AssessmentResultJustification::FAILED_OTHER->name, $justifications) ?
                        $this->faker->paragraph() : null,
                    'assessment_decision_level' => null,
                    'skill_decision_notes' => null,
                ];
            }

            if ($type === AssessmentResultType::SKILL) {
                $justifications = [$this->faker->randomElement(array_column(AssessmentResultJustification::skillJustifications(), 'name'))];
                $assessmentDecision = $this->faker->randomElement(array_column(AssessmentDecision::cases(), 'name'));

                return [
                    'assessment_result_type' => $type->name,
                    'justifications' => $justifications,
                    'other_justification_notes' => in_array(AssessmentResultJustification::FAILED_OTHER->name, $justifications) ?
                        $this->faker->paragraph() : null,
                    'assessment_decision' => $assessmentDecision,
                    'assessment_decision_level' => $assessmentDecision === AssessmentDecision::SUCCESSFUL->name ?
                        $this->faker->randomElement(array_column(AssessmentDecisionLevel::cases(), 'name')) : null,
                    'skill_decision_notes' => $assessmentDecision === AssessmentDecision::SUCCESSFUL->name ?
                        $this->faker->paragraph() : null,
                ];
            }

            return [];
        });
    }
}
