<?php

namespace App\GraphQL\Validators;

use App\Rules\AssessmentStepComplete;
use App\Rules\PoolSkillIsAssessed;
use Nuwave\Lighthouse\Validation\Validator;

final class AssessmentPlanIsCompleteValidator extends Validator
{
    /**
     * Return the validation rules.
     *
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        return [
            'assessment_steps.*.id' => [
                'uuid',
                'exists:assessment_steps,id',
                new AssessmentStepComplete,
            ],
            'pool_skills.*.id' => [
                'uuid',
                'exists:pool_skill,id',
                new PoolSkillIsAssessed,
            ],
        ];
    }

    public function messages(): array
    {
        return [];
    }
}
