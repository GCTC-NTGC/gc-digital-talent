<?php

namespace App\GraphQL\Validators;

use App\Enums\ErrorCode;
use Illuminate\Validation\Rule;
use Nuwave\Lighthouse\Validation\Validator;

final class CreateTalentNominationEventInputValidator extends Validator
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
            'community' => ['present'],
            'community.connect' => ['uuid', 'required', 'exists:communities,id'],
            'community.disconnect' => ['missing'],
            'communityDevelopmentPrograms.sync' => ['required', 'list'],
            'communityDevelopmentPrograms.sync.*.id' => [
                'required',
                'uuid',
                Rule::exists('community_development_program', 'id')
                    ->where(function ($query) use ($communityId) {
                        $query->where('community_id', $communityId);
                    }),
            ],
            'name' => ['required', 'localized_string'],
            'description' => ['nullable', 'localized_string'],
            'learnMoreUrl' => ['nullable', 'localized_string'],
            'learnMoreUrl.en' => ['nullable', 'url'],
            'learnMoreUrl.fr' => ['nullable', 'url'],
            'openDate' => ['required', 'date'],
            'closeDate' => ['required', 'date', 'after:openDate'],
            'includeLeadershipCompetencies' => ['nullable', 'boolean'],
            'include_9_box' => ['sometimes', 'boolean'],
            'require_reference_for_advancement' => ['sometimes', 'boolean'],
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
