<?php

namespace App\GraphQL\Validators\Mutation;

use App\GraphQL\Validators\PoolIsCompleteValidator;
use App\Rules\AssessmentStepComplete;
use App\Rules\PoolSkillIsAssessed;
use Nuwave\Lighthouse\Validation\Validator;

final class PublishPoolValidator extends Validator
{
    /**
     * Return the validation rules.
     *
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        $completenessRules = (new PoolIsCompleteValidator)->rules();
        // requirements for a pool to be promoted from "complete" to "published"
        $publishingRules = [
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

        return array_merge($completenessRules, $publishingRules);
    }

    public function messages(): array
    {
        $completenessMessages = (new PoolIsCompleteValidator)->messages();
        $publishingMessages = []; // messages for a pool to be promoted from "complete" to "published"

        return array_merge($completenessMessages, $publishingMessages);
    }
}
