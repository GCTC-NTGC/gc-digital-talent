<?php

namespace App\GraphQL\Validators;

use App\Enums\CommunityInterestAdditionalDuty;
use App\Enums\DevelopmentProgramParticipationStatus;
use App\Enums\ErrorCode;
use App\Enums\FinanceChiefRole;
use App\Models\Community;
use App\Models\CommunityInterest;
use App\Models\User;
use Illuminate\Validation\Rule;
use Nuwave\Lighthouse\Validation\Validator;

final class UpdateCommunityInterestWithDevelopmentProgramsInputValidator extends Validator
{
    /**
     * Return the validation rules.
     *
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        $communityInterestId = $this->arg('id');
        $communityInterest = CommunityInterest::findOrFail($communityInterestId);
        $userId = $communityInterest->user_id;

        $user = User::with('educationExperiences')->findOrFail($userId);
        $userEducationExperienceIds = $user->educationExperiences->pluck('id')->toArray() ?? [];

        $communityId = $communityInterest->community_id;
        $community = Community::with(['workStreams', 'communityDevelopmentPrograms'])->find($communityId);
        $workStreamIds = $community?->workStreams->pluck('id')->toArray() ?? [];

        return [
            // Community interest id
            'id' => ['uuid', 'required'],

            // Community interest block
            'communityInterest' => ['array', 'required'],
            'communityInterest.workStreams.sync.*' => ['uuid', 'exists:work_streams,id', Rule::in($workStreamIds)],
            'communityInterest.jobInterest' => ['nullable', 'boolean'],
            'communityInterest.trainingInterest' => ['nullable', 'boolean'],
            'communityInterest.additionalInformation' => ['nullable', 'string'],
            'communityInterest.financeIsChief' => [
                'nullable',
                Rule::when($community?->key === 'finance',
                    ['boolean'],
                    ['prohibited']
                ),
            ],
            'communityInterest.procurementIsSDO' => [
                'nullable',
                Rule::when($community?->key === 'procurement',
                    ['boolean'],
                    ['prohibited']
                ),
            ],
            'communityInterest.communityInterestAdditionalDuties' => [
                'nullable',
                Rule::when(
                    ($community?->key === 'finance' || $community?->key === 'procurement'),
                    ['array', 'distinct'],
                    ['prohibited']
                ),
            ],
            'communityInterest.communityInterestAdditionalDuties.*' => [Rule::in(array_column(CommunityInterestAdditionalDuty::cases(), 'name'))],
            'communityInterest.financeOtherRoles' => [
                'nullable',
                Rule::when($community?->key === 'finance',
                    ['array', 'distinct'],
                    ['prohibited']
                ),
            ],
            'communityInterest.financeOtherRoles.*' => [Rule::in(array_column(FinanceChiefRole::cases(), 'name'))],
            'communityInterest.financeOtherRolesOther' => [
                'nullable',
                Rule::when($community?->key === 'finance',
                    [
                        'string',
                        Rule::requiredIf(in_array(FinanceChiefRole::OTHER->name, $this->arg('communityInterest.financeOtherRoles') ?? [])),
                    ],
                    ['prohibited']
                ),
            ],
            'communityInterest.consentToShareProfile' => ['accepted'],

            // Development programs block
            'developmentPrograms' => ['array', 'nullable'],
            'developmentPrograms.*.developmentProgramId' => ['uuid', 'required', 'exists:development_programs,id'],
            'developmentPrograms.*.educationExperienceId' => [
                'uuid',
                'nullable',
                'exists:education_experiences,id',
                Rule::in($userEducationExperienceIds),
            ],
            'developmentPrograms.*.participationStatus' => ['nullable', Rule::in(array_column(DevelopmentProgramParticipationStatus::cases(), 'name'))],
            'developmentPrograms.*.completionDate' => ['nullable'],
        ];
    }

    public function messages(): array
    {
        return [
            'communityInterest.workStreams.sync.*.in' => ErrorCode::WORK_STREAM_NOT_IN_COMMUNITY->name,
            'communityInterest.workStreams.sync.*.exists' => ErrorCode::WORK_STREAM_NOT_FOUND->name,
            'developmentPrograms.*.developmentProgramId.exists' => ErrorCode::DEVELOPMENT_PROGRAM_NOT_FOUND->name,
            'developmentPrograms.*.educationExperienceId.in' => ErrorCode::DEVELOPMENT_PROGRAM_MUST_CONNECT_OWN_EDUCATION_EXPERIENCE->name,
        ];
    }
}
