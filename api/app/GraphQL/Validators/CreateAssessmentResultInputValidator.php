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

                Rule::unique('assessment_results', 'assessment_step_id')
                    ->where(function ($query) {
                        return $query
                            ->where('pool_candidate_id', $this->arg('poolCandidateId'))
                            ->where('assessment_result_type', $this->arg('assessmentResultType'))
                            ->when($this->arg('poolSkillId'),
                                fn ($query) => $query->where('pool_skill_id', $this->arg('poolSkillId')),
                                fn ($query) => $query->whereNull('pool_skill_id')
                            );
                    }),
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
            'poolSkillId' => 'SkillAssessmentResultMissingSkill',
            'assessmentDecisionLevel.prohibited' => 'CannotSetAssessmentDecisionLevelForThisTypeOrDecision',
            'assessmentStepId.unique' => 'AssessmentResultAlreadyExists',
        ];
    }
}
