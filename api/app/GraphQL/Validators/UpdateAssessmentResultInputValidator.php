<?php

namespace App\GraphQL\Validators;

use App\Enums\AssessmentDecision;
use App\Enums\AssessmentResultType;
use App\Enums\ErrorCode;
use App\Models\AssessmentResult;
use App\Rules\AssessmentResultJustificationsConsistent;
use Illuminate\Validation\Rule;
use Nuwave\Lighthouse\Validation\Validator;

final class UpdateAssessmentResultInputValidator extends Validator
{
    /**
     * Return the validation rules.
     *
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        $assessmentResultModel = AssessmentResult::find($this->arg('id')); // cannot access in constructor

        // new arguments take priority, otherwise fallback to model value
        $assessmentDecision = $this->arg('assessmentDecision') ?? $assessmentResultModel->assessment_decision;
        $assessmentResultType = $this->arg('assessmentResultType') ?? $assessmentResultModel->assessment_result_type;

        return [
            'justifications' => [
                new AssessmentResultJustificationsConsistent($assessmentResultType),
            ],
            'assessmentDecisionLevel' => [
                Rule::prohibitedIf(
                    (
                        $assessmentResultType !== null &&
                        $assessmentResultType !== AssessmentResultType::SKILL->name
                    ) ||
                    (
                        $assessmentDecision !== null &&
                        $assessmentDecision !== AssessmentDecision::SUCCESSFUL->name
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
            'assessmentDecisionLevel.prohibited' => ErrorCode::CANNOT_SET_ASSESSMENT_DECISION_LEVEL_FOR_THIS_TYPE_OR_DECISION->name,
        ];
    }
}
