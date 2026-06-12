<?php

namespace App\GraphQL\Validators;

use App\Enums\ErrorCode;
use Illuminate\Validation\Rule;
use Nuwave\Lighthouse\Validation\Validator;

final class UpdateTalentNominationEventInputValidator extends Validator
{
    /**
     * Return the validation rules.
     *
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        $communityId = $this->arg('community.connect');

        return [
            'community.connect' => ['sometimes', 'uuid', 'required', 'exists:communities,id'],
            'community.disconnect' => ['missing'],
            'communityDevelopmentPrograms.sync' => ['sometimes', 'required', 'list'],
            'communityDevelopmentPrograms.sync.*.id' => [
                'required',
                'uuid',
                Rule::exists('community_development_program', 'id')
                    ->where(function ($query) use ($communityId) {
                        $query->where('community_id', $communityId);
                    }),
            ],
            'name' => ['sometimes', 'required', 'localized_string'],
            'description' => ['nullable', 'localized_string'],
            'learnMoreUrl' => ['nullable', 'localized_string'],
            'learnMoreUrl.en' => ['nullable', 'url'],
            'learnMoreUrl.fr' => ['nullable', 'url'],
            'openDate' => ['sometimes', 'required', 'date'],
            'closeDate' => ['sometimes', 'required', 'date', 'after:openDate'],
            'includeLeadershipCompetencies' => ['nullable', 'boolean'],
            'customInstructions' => ['nullable', 'localized_string'],
        ];
    }

    public function messages(): array
    {
        return [
            'community.connect.exists' => ErrorCode::COMMUNITY_NOT_FOUND->name,
            'communityDevelopmentPrograms.sync.*.id.exists' => ErrorCode::COMMUNITY_DEVELOPMENT_PROGRAM_NOT_FOUND_OR_INVALID->name,
        ];
    }
}
