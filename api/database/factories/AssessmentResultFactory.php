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
            'justifications' => $this->nullJustifications($assessmentDecision) ? null : $justifications,
            'assessment_decision_level' => $assessmentResultType === AssessmentResultType::SKILL->name &&
                $assessmentDecision === AssessmentDecision::SUCCESSFUL->name ?
                $this->faker->randomElement(array_column(AssessmentDecisionLevel::cases(), 'name')) : null,
            'skill_decision_notes' => $assessmentResultType === AssessmentResultType::SKILL->name &&
                $assessmentDecision === AssessmentDecision::SUCCESSFUL->name ?
                $this->faker->paragraph() : null,
        ];
    }

    /**
     * Pick result type and constrain related fields
     */
    public function withResultType(AssessmentResultType $type)
    {
        return $this->state(function () use ($type) {
            if ($type === AssessmentResultType::EDUCATION) {
                $assessmentDecision = $this->faker->boolean(60) ?
                    AssessmentDecision::SUCCESSFUL->name : $this->faker->randomElement(array_column(AssessmentDecision::cases(), 'name'));
                $justifications = [];
                if ($assessmentDecision === AssessmentDecision::SUCCESSFUL->name) {
                    $justifications = $this->faker->randomElements(array_column(AssessmentResultJustification::educationJustificationsSuccess(), 'name'), null);
                }
                if ($assessmentDecision === AssessmentDecision::UNSUCCESSFUL->name) {
                    $justifications = $this->faker->randomElement(array_column(AssessmentResultJustification::educationJustificationsFailure(), 'name'), null);
                }

                return [
                    'assessment_result_type' => $type->name,
                    'justifications' => $this->nullJustifications($assessmentDecision) ? null : $justifications,
                    'assessment_decision' => $assessmentDecision,
                    'assessment_decision_level' => null,
                    'skill_decision_notes' => null,
                ];
            }

            if ($type === AssessmentResultType::SKILL) {
                $assessmentDecision = $this->faker->boolean(60) ?
                    AssessmentDecision::SUCCESSFUL->name : $this->faker->randomElement(array_column(AssessmentDecision::cases(), 'name'));
                $justifications = $this->faker->randomElements(array_column(AssessmentResultJustification::skillJustifications(), 'name'), null);

                return [
                    'assessment_result_type' => $type->name,
                    'justifications' => $assessmentDecision === AssessmentDecision::UNSUCCESSFUL->name ? $justifications : null,
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

    private function nullJustifications($decision): bool
    {
        return $decision === AssessmentDecision::HOLD->name || is_null($decision);
    }
}
