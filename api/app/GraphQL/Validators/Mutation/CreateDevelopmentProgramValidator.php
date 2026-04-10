<?php

namespace App\GraphQL\Validators\Mutation;

use App\Enums\ErrorCode;
use Nuwave\Lighthouse\Validation\Validator;

final class CreateDevelopmentProgramValidator extends Validator
{
    /**
     * Return the validation rules.
     *
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        return [
            'developmentProgram.informationUrl.en' => ['required_with:developmentProgram.informationUrl.fr', 'string', 'nullable', 'url:http,https'],
            'developmentProgram.informationUrl.fr' => ['required_with:developmentProgram.informationUrl.en', 'string', 'nullable', 'url:http,https'],
            'developmentProgram.abbreviation.en' => ['required_with:developmentProgram.abbreviation.fr', 'string', 'nullable', 'url:http,https'],
            'developmentProgram.abbreviation.fr' => ['required_with:developmentProgram.abbreviation.en', 'string', 'nullable', 'url:http,https'],
        ];
    }

    /**
     * Return the validation messages
     */
    public function messages(): array
    {
        return [
            'community.developmentProgram.*.url' => ErrorCode::INVALID_URL->name,
        ];
    }
}
