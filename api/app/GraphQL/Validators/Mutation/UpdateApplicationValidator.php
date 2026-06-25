<?php

namespace App\GraphQL\Validators\Mutation;

use App\Enums\ErrorCode;
use App\Models\PoolCandidate;
use Illuminate\Validation\Rule;
use Nuwave\Lighthouse\Validation\Validator;

final class UpdateApplicationValidator extends Validator
{
    /**
     * Return the validation rules.
     *
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        $userId = PoolCandidate::query()
            ->select('user_id')
            ->findOrFail($this->arg('id'))
            ->user_id;

        return [
            'application.educationRequirementAwardExperiences.sync.*' => [
                'uuid',
                Rule::exists('award_experiences', 'id')->where('user_id', $userId),
            ],
            'application.educationRequirementCommunityExperiences.sync.*' => [
                'uuid',
                Rule::exists('community_experiences', 'id')->where('user_id', $userId),
            ],
            'application.educationRequirementEducationExperiences.sync.*' => [
                'uuid',
                Rule::exists('education_experiences', 'id')->where('user_id', $userId),
            ],
            'application.educationRequirementPersonalExperiences.sync.*' => [
                'uuid',
                Rule::exists('personal_experiences', 'id')->where('user_id', $userId),
            ],
            'application.educationRequirementWorkExperiences.sync.*' => [
                'uuid',
                Rule::exists('work_experiences', 'id')->where('user_id', $userId),
            ],
        ];
    }

    /**
     * Return the validation messages
     */
    public function messages(): array
    {
        return [
            'application.educationRequirementAwardExperiences.sync.*.exists' => ErrorCode::APPLICATION_INVALID_EXPERIENCE_FOR_EDUCATION_REQUIREMENT->name,
            'application.educationRequirementCommunityExperiences.sync.*.exists' => ErrorCode::APPLICATION_INVALID_EXPERIENCE_FOR_EDUCATION_REQUIREMENT->name,
            'application.educationRequirementEducationExperiences.sync.*.exists' => ErrorCode::APPLICATION_INVALID_EXPERIENCE_FOR_EDUCATION_REQUIREMENT->name,
            'application.educationRequirementPersonalExperiences.sync.*.exists' => ErrorCode::APPLICATION_INVALID_EXPERIENCE_FOR_EDUCATION_REQUIREMENT->name,
            'application.educationRequirementWorkExperiences.sync.*.exists' => ErrorCode::APPLICATION_INVALID_EXPERIENCE_FOR_EDUCATION_REQUIREMENT->name,
        ];
    }
}
