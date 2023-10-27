<?php

namespace App\GraphQL\Validators;

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
            'justifications' => [
                new AssessmentResultJustificationsConsistent($this->arg('assessmentResultType')),
            ],
            'otherJustificationNotes' => [
                Rule::prohibitedIf(
                    $this->arg('assessmentDecision') !== null &&
                    $this->arg('assessmentDecision') !== AssessmentDecision::UNSUCCESSFUL->name
                ),
            ],
            'skillDecisionNotes' => [
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
            'otherJustificationNotes.prohibited' => 'CannotSetJustificationNotesForThisDecision',
            'skillDecisionNotes.prohibited' => 'CannotSetSkillDecisionNotesForThisTypeOrDecision',
            'assessmentDecisionLevel.prohibited' => 'CannotSetAssessmentDecisionLevelForThisTypeOrDecision',
        ];
    }
}
