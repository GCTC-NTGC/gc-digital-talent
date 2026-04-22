<?php

namespace App\GraphQL\Validators;

use App\Enums\ErrorCode;
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
        return [
            'community.connect' => ['uuid', 'exists:communities,id'],
            'communityDevelopmentPrograms.sync.*.id' => ['uuid', 'exists:community_development_program,id'],
            'description.en' => ['nullable', 'required_with:description.fr', 'string'],
            'description.fr' => ['nullable', 'required_with:description.en', 'string'],
            'learnMoreUrl.en' => ['nullable', 'required_with:learnMoreUrl.fr', 'string', 'url'],
            'learnMoreUrl.fr' => ['nullable', 'required_with:learnMoreUrl.en', 'string', 'url'],
            'openDate' => ['date'],
            'closeDate' => ['date', 'after:openDate'],
            'includeLeadershipCompetencies' => ['nullable', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'community.connect.exists' => ErrorCode::COMMUNITY_NOT_FOUND->name,
            'communityDevelopmentPrograms.connect.*.exists' => ErrorCode::COMMUNITY_DEVELOPMENT_PROGRAM_NOT_FOUND->name,
        ];
    }
}
