<?php

namespace App\GraphQL\Validators;

use App\Models\DevelopmentProgram;
use Database\Helpers\ApiErrorEnums;
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
        $developmentProgramIds = $communityId ? DevelopmentProgram::where('community_id', $communityId)->get('id')->pluck('id') : [];

        return [
            'community.connect' => ['uuid', 'required', 'exists:communities,id'],
            'developmentPrograms.sync.*' => ['uuid', 'exists:development_programs,id', Rule::in($developmentProgramIds)],
            'name.en' => ['required', 'string'],
            'name.fr' => ['required', 'string'],
            'description.en' => ['nullable', 'required_with:description.fr', 'string'],
            'description.fr' => ['nullable', 'required_with:description.en', 'string'],
            'openDate' => ['required', 'date'],
            'closeDate' => ['required', 'date', 'after:openDate'],
            'includeLeadershipCompetencies' => ['nullable', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'community.connect.exists' => ApiErrorEnums::COMMUNITY_NOT_FOUND,
            'interestInDevelopmentPrograms.sync.*.developmentProgramId.in' => ApiErrorEnums::DEVELOPMENT_PROGRAM_NOT_VALID_FOR_COMMUNITY,
        ];
    }
}
