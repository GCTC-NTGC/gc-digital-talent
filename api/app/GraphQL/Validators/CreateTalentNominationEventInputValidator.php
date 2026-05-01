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
            'community.connect' => ['uuid', 'required', 'exists:communities,id'],
            'communityDevelopmentPrograms.sync.*.id' => [
                'uuid',
                Rule::exists('community_development_program', 'id')
                    ->where(function ($query) use ($communityId) {
                        $query->where('community_id', $communityId);
                    }),
            ],
            'name.en' => ['required', 'string'],
            'name.fr' => ['required', 'string'],
            'description.en' => ['nullable', 'required_with:description.fr', 'string'],
            'description.fr' => ['nullable', 'required_with:description.en', 'string'],
            'learnMoreUrl.en' => ['nullable', 'required_with:learnMoreUrl.fr', 'string', 'url'],
            'learnMoreUrl.fr' => ['nullable', 'required_with:learnMoreUrl.en', 'string', 'url'],
            'openDate' => ['required', 'date'],
            'closeDate' => ['required', 'date', 'after:openDate'],
            'includeLeadershipCompetencies' => ['nullable', 'boolean'],
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
