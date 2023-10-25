<?php

namespace App\GraphQL\Validators;

use App\Enums\AssessmentDecision;
use App\Enums\AssessmentResultType;
use App\Models\AssessmentResult;
use App\Rules\AssessmentResultJustificationsConsistent;
use Illuminate\Validation\Rule;
use Nuwave\Lighthouse\Validation\Validator;

final class UpdateAssessmentResultValidator extends Validator
{
    /**
     * Return the validation rules.
     *
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        $assessmentResultModel = AssessmentResult::find($this->arg('id')); // cannot access in constructor
        $assessmentResultInput = $this->arg('updateAssessmentResult');

        // new arguments take priority, otherwise fallback to model value
        $assessmentDecision = array_key_exists('assessmentDecision', $assessmentResultInput) ?
            $assessmentResultInput['assessmentDecision'] : $assessmentResultModel->assessment_decision;
        $assessmentResultType = array_key_exists('assessmentResultType', $assessmentResultInput) ?
            $assessmentResultInput['assessmentResultType'] : $assessmentResultModel->assessment_result_type;

        return [
            'updateAssessmentResult.justifications' => [
                new AssessmentResultJustificationsConsistent($assessmentResultType),
            ],
            'updateAssessmentResult.otherJustificationNotes' => [
                Rule::prohibitedIf(
                    $assessmentDecision !== AssessmentDecision::UNSUCCESSFUL->name
                ),
            ],
            'updateAssessmentResult.skillDecisionNotes' => [
                Rule::prohibitedIf(
                    $assessmentResultType !== AssessmentResultType::SKILL->name ||
                    $assessmentDecision !== AssessmentDecision::SUCCESSFUL->name
                ),
            ],
            'updateAssessmentResult.skillDecisionLevel' => [
                Rule::prohibitedIf(
                    (
                        $assessmentResultType !== null &&
                        $assessmentResultType !== AssessmentResultType::SKILL->name
                    ) ||
                    (
                        $assessmentResultType !== null &&
                        $assessmentResultType !== AssessmentDecision::SUCCESSFUL->name
                    )
                ),
            ],
        ];
    }

    /**
     * Return the validation messages
     */
    public function messages(): array
    {
        return [
            'updateAssessmentResult.otherJustificationNotes.prohibited' => 'CannotSetJustificationNotesForThisDecision',
            'updateAssessmentResult.skillDecisionNotes.prohibited' => 'CannotSetSkillDecisionNotesForThisTypeOrDecision',
            'updateAssessmentResult.skillDecisionLevel.prohibited' => 'CannotSetSkillDecisionLevelForThisTypeOrDecision',
        ];
    }
}
