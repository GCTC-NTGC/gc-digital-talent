<?php

declare(strict_types=1);

namespace App\GraphQL\Validators\Mutation;

use App\Enums\AssessmentStepType;
use App\Enums\ErrorCode;
use Illuminate\Database\Query\Builder;
use Illuminate\Validation\Rule;
use Nuwave\Lighthouse\Validation\Validator;

final class UpdateAssessmentStepValidator extends Validator
{
    /**
     * Return the validation rules.
     *
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        return [
            'assessmentStep.type' => [
                Rule::notIn([AssessmentStepType::APPLICATION_SCREENING->name]),
            ],
            'assessmentStep.poolSkills.sync.*' => [
                Rule::exists('pool_skill', 'id')->where(fn (Builder $query) => $query
                    ->whereIn('pool_id', fn (Builder $subQuery) => $subQuery
                        ->select('pool_id')
                        ->from('assessment_steps')
                        ->where('id', $this->arg('id'))
                    )
                ),
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'assessmentStep.type.not_in' => ErrorCode::ASSESSMENT_STEP_INVALID_TYPE->name,
            'assessmentStep.poolSkills.sync.*.exists' => ErrorCode::POOL_SKILL_NOT_VALID->name,
        ];
    }
}
