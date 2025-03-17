<?php

namespace App\GraphQL\Validators;

use App\Enums\FinanceChiefDuty;
use App\Enums\FinanceChiefRole;
use App\Models\CommunityInterest;
use Database\Helpers\ApiErrorEnums;
use Illuminate\Validation\Rule;
use Nuwave\Lighthouse\Validation\Validator;

final class UpdateCommunityInterestInputValidator extends Validator
{
    /**
     * Return the validation rules.
     *
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        $communityInterestId = $this->arg('id');
        $communityInterest = CommunityInterest::with(['community', 'community.workStreams', 'community.developmentPrograms'])->find($communityInterestId);
        $community = $communityInterest?->community;
        $workStreamIds = $community?->workStreams->pluck('id')->toArray() ?? [];
        $developmentProgramIds = $community?->developmentPrograms->pluck('id')->toArray() ?? [];

        return [
            'workStreams.sync.*' => ['uuid', 'exists:work_streams,id', Rule::in($workStreamIds)],
            'jobInterest' => ['nullable', 'boolean'],
            'trainingInterest' => ['nullable', 'boolean'],
            'additionalInformation' => ['nullable', 'string'],
            'interestInDevelopmentPrograms.create.*.developmentProgramId' => ['uuid', Rule::in($developmentProgramIds)],
            'financeIsChief' => [
                'nullable',
                Rule::when($community?->key === 'finance',
                    ['boolean'],
                    ['prohibited']
                ),
            ],
            'financeAdditionalDuties' => [
                'nullable',
                Rule::when($community?->key === 'finance',
                    ['array', 'distinct'],
                    ['prohibited']
                ),
            ],
            'financeAdditionalDuties.*' => [Rule::in(array_column(FinanceChiefDuty::cases(), 'name'))],
            'financeOtherRoles' => [
                'nullable',
                Rule::when($community?->key === 'finance',
                    ['array', 'distinct'],
                    ['prohibited']
                ),
            ],
            'financeOtherRoles.*' => [Rule::in(array_column(FinanceChiefRole::cases(), 'name'))],
            'financeOtherRolesOther' => [
                'nullable',
                Rule::when($community?->key === 'finance',
                    [
                        'string',
                        Rule::requiredIf(in_array(FinanceChiefRole::OTHER->name, $this->arg('financeOtherRoles', []))),
                    ],
                    ['prohibited']
                ),
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'community.connect.exists' => ApiErrorEnums::COMMUNITY_NOT_FOUND,
            'workStreams.sync.*.in' => ApiErrorEnums::WORK_STREAM_NOT_IN_COMMUNITY,
            'workStreams.sync.*.exists' => ApiErrorEnums::WORK_STREAM_NOT_FOUND,
            'interestInDevelopmentPrograms.create.*.developmentProgramId.in' => ApiErrorEnums::DEVELOPMENT_PROGRAM_NOT_VALID_FOR_COMMUNITY,
        ];
    }
}
