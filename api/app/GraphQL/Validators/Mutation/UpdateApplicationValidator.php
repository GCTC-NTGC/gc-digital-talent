<?php

namespace App\GraphQL\Validators\Mutation;

use App\Enums\ErrorCode;
use App\Models\AwardExperience;
use App\Models\CommunityExperience;
use App\Models\EducationExperience;
use App\Models\PersonalExperience;
use App\Models\PoolCandidate;
use App\Models\WorkExperience;
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
        $applicationId = $this->arg('id');

        $poolCandidate = PoolCandidate::query()->select('user_id')->findOrFail($applicationId);

        $userId = $poolCandidate->user_id;

        $userAwardExperienceIds = AwardExperience::where('user_id', $userId)
            ->select(['id'])
            ->get()
            ->pluck('id')
            ->toArray();
        $userCommunityExperienceIds = CommunityExperience::where('user_id', $userId)
            ->select(['id'])
            ->get()
            ->pluck('id')
            ->toArray();
        $userEducationExperienceIds = EducationExperience::where('user_id', $userId)
            ->select(['id'])
            ->get()
            ->pluck('id')
            ->toArray();
        $userPersonalExperienceIds = PersonalExperience::where('user_id', $userId)
            ->select(['id'])
            ->get()
            ->pluck('id')
            ->toArray();
        $userWorkExperienceIds = WorkExperience::where('user_id', $userId)
            ->select(['id'])
            ->get()
            ->pluck('id')
            ->toArray();

        return [
            'application.educationRequirementAwardExperiences.sync.*' => [
                'uuid',
                Rule::in($userAwardExperienceIds),
            ],
            'application.educationRequirementCommunityExperiences.sync.*' => [
                'uuid',
                Rule::in($userCommunityExperienceIds),
            ],
            'application.educationRequirementEducationExperiences.sync.*' => [
                'uuid',
                Rule::in($userEducationExperienceIds),
            ],
            'application.educationRequirementPersonalExperiences.sync.*' => [
                'uuid',
                Rule::in($userPersonalExperienceIds),
            ],
            'application.educationRequirementWorkExperiences.sync.*' => [
                'uuid',
                Rule::in($userWorkExperienceIds),
            ],
        ];
    }

    /**
     * Return the validation messages
     */
    public function messages(): array
    {
        return [
            'application.educationRequirementAwardExperiences.sync.*.in' => ErrorCode::APPLICATION_INVALID_EXPERIENCE_FOR_EDUCATION_REQUIREMENT->name,
            'application.educationRequirementCommunityExperiences.sync.*.in' => ErrorCode::APPLICATION_INVALID_EXPERIENCE_FOR_EDUCATION_REQUIREMENT->name,
            'application.educationRequirementEducationExperiences.sync.*.in' => ErrorCode::APPLICATION_INVALID_EXPERIENCE_FOR_EDUCATION_REQUIREMENT->name,
            'application.educationRequirementPersonalExperiences.sync.*.in' => ErrorCode::APPLICATION_INVALID_EXPERIENCE_FOR_EDUCATION_REQUIREMENT->name,
            'application.educationRequirementWorkExperiences.sync.*.in' => ErrorCode::APPLICATION_INVALID_EXPERIENCE_FOR_EDUCATION_REQUIREMENT->name,
        ];
    }
}
