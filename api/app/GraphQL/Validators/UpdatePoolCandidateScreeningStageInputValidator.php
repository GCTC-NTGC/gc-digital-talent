<?php

namespace App\GraphQL\Validators;

use App\Enums\ErrorCode;
use App\Enums\ScreeningStage;
use App\Models\PoolCandidate;
use Illuminate\Validation\Rule;
use Nuwave\Lighthouse\Validation\Validator;

final class UpdatePoolCandidateScreeningStageInputValidator extends Validator
{
    /**
     * Return the validation rules.
     *
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {

        $poolCandidate = PoolCandidate::find($this->arg('id'));

        return [
            'screeningStage' => [
                'required',
                Rule::in(array_column(ScreeningStage::cases(), 'name')),
            ],
            'assessmentStep.connect' => [
                'nullable',
                Rule::prohibitedIf($this->arg('screeningStage') !== ScreeningStage::UNDER_ASSESSMENT->name),
                Rule::exists('assessment_steps', 'id')
                    ->where(function ($query) use ($poolCandidate) {
                        $query->where('pool_id', $poolCandidate->pool_id);
                    }),
            ],
        ];
    }

    /**
     * Return the messages
     */
    public function messages(): array
    {
        return [
            'screeningStage' => [
                'required' => ErrorCode::SCREENING_STAGE_REQUIRED->name,
                'in' => ErrorCode::SCREENING_STAGE_EXISTS->name,
            ],
            'assessmentStep.connect' => [
                'prohibited' => ErrorCode::SCREENING_STAGE_NOT_UNDER_ASSESSMENT->name,
                'exists' => ErrorCode::ASSESSMENT_STEP_CANDIDATE_SAME_POOL->name,
            ],
        ];
    }
}
