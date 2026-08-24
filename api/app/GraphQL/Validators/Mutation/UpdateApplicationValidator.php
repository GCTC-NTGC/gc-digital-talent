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
        $applicationId = $this->arg('id');

        $application = PoolCandidate::query()
            ->select(['user_id', 'pool_id'])
            ->findOrFail($applicationId);

        $userId = $application->user_id;
        $poolId = $application->pool_id;

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
            'application.generalQuestionResponses.update.*.id' => [
                Rule::exists('general_question_responses', 'id')->where('pool_candidate_id', $applicationId),
            ],
            'application.generalQuestionResponses.delete.*' => [
                Rule::exists('general_question_responses', 'id')->where('pool_candidate_id', $applicationId),
            ],
            'application.generalQuestionResponses.create.*.generalQuestion.connect' => [
                Rule::exists('general_questions', 'id')->where('pool_id', $poolId),
            ],
            'application.screeningQuestionResponses.update.*.id' => [
                Rule::exists('screening_question_responses', 'id')->where('pool_candidate_id', $applicationId),
            ],
            'application.screeningQuestionResponses.delete.*' => [
                Rule::exists('screening_question_responses', 'id')->where('pool_candidate_id', $applicationId),
            ],
            'application.screeningQuestionResponses.create.*.screeningQuestion.connect' => [
                Rule::exists('screening_questions', 'id')->where('pool_id', $poolId),
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
            'application.generalQuestionResponses.update.*.id.exists' => ErrorCode::APPLICATION_INVALID_QUESTION_RESPONSE->name,
            'application.generalQuestionResponses.delete.*.exists' => ErrorCode::APPLICATION_INVALID_QUESTION_RESPONSE->name,
            'application.screeningQuestionResponses.update.*.id.exists' => ErrorCode::APPLICATION_INVALID_QUESTION_RESPONSE->name,
            'application.screeningQuestionResponses.delete.*.exists' => ErrorCode::APPLICATION_INVALID_QUESTION_RESPONSE->name,
        ];
    }
}
