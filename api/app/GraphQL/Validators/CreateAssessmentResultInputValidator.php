<?php

namespace App\GraphQL\Validators;

use App\Enums\ApiError;
use App\Enums\AssessmentDecision;
use App\Enums\AssessmentResultType;
use App\Rules\AssessmentResultJustificationsConsistent;
use App\Rules\AssessmentResultPoolConsistent;
use Illuminate\Validation\Rule;
use Nuwave\Lighthouse\Validation\Validator;

final class CreateAssessmentResultInputValidator extends Validator
{
    /**
     * Return the validation rules.
     *
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {

        return [
            'assessmentStepId' => [
                new AssessmentResultPoolConsistent(
                    $this->arg('assessmentStepId'),
                    $this->arg('poolCandidateId'),
                    $this->arg('poolSkillId')
                ),
            ],
            'poolSkillId' => [
                Rule::requiredIf($this->arg('assessmentResultType') === AssessmentResultType::SKILL->name),
            ],
            'justifications' => [
                new AssessmentResultJustificationsConsistent($this->arg('assessmentResultType')),
            ],
            'assessmentDecisionLevel' => [
                Rule::prohibitedIf(
                    (
                        $this->arg('assessmentResultType') !== null &&
                        $this->arg('assessmentResultType') !== AssessmentResultType::SKILL->name
                    ) ||
                    (
                        $this->arg('assessmentDecision') !== null &&
                        $this->arg('assessmentDecision') !== AssessmentDecision::SUCCESSFUL->name
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
            'poolSkillId' => ApiError::ASSESSMENT_RESULT_MISSING_SKILL->localizedErrorMessage(),
            'assessmentDecisionLevel.prohibited' => ApiError::ASSESSMENT_RESULT_DECISION_LEVEL_PROHIBITED->localizedErrorMessage(),
        ];
    }
}
