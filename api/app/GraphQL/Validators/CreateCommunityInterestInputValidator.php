<?php

namespace App\GraphQL\Validators;

use App\Enums\ErrorCode;
use App\Enums\FinanceChiefDuty;
use App\Enums\FinanceChiefRole;
use App\Models\Community;
use Illuminate\Validation\Rule;
use Nuwave\Lighthouse\Validation\Validator;

final class CreateCommunityInterestInputValidator extends Validator
{
    /**
     * Return the validation rules.
     *
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        $communityId = $this->arg('community.connect');
        $community = Community::with(['workStreams'])->find($communityId);
        $workStreamIds = $community?->workStreams->pluck('id')->toArray() ?? [];

        return [
            'userId' => ['uuid', 'required', 'exists:users,id'],
            'community.connect' => ['uuid', 'required', 'exists:communities,id', Rule::unique('community_interests', 'community_id')->where(function ($query) {
                return $query->where('user_id', $this->arg('userId'));
            })],
            'workStreams.sync.*' => ['uuid', 'exists:work_streams,id', Rule::in($workStreamIds)],
            'jobInterest' => ['nullable', 'boolean'],
            'trainingInterest' => ['nullable', 'boolean'],
            'additionalInformation' => ['nullable', 'string'],
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
                        Rule::requiredIf(in_array(FinanceChiefRole::OTHER->name, $this->arg('financeOtherRoles') ?? [])),
                    ],
                    ['prohibited']
                ),
            ],
            'consentToShareProfile' => ['accepted'],
        ];
    }

    public function messages(): array
    {
        return [
            'community.connect.exists' => ErrorCode::COMMUNITY_NOT_FOUND->name,
            'community.connect.unique' => ErrorCode::COMMUNITY_INTEREST_EXISTS->name,
            'workStreams.sync.*.in' => ErrorCode::WORK_STREAM_NOT_IN_COMMUNITY->name,
            'workStreams.sync.*.exists' => ErrorCode::WORK_STREAM_NOT_FOUND->name,
        ];
    }
}
