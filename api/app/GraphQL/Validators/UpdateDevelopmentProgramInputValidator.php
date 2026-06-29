<?php

namespace App\GraphQL\Validators;

use App\Enums\ErrorCode;
use Nuwave\Lighthouse\Validation\Validator;

final class UpdateDevelopmentProgramInputValidator extends Validator
{
    /**
     * Return the validation rules.
     *
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        return [
            'informationUrl.en' => ['required_with:informationUrl.fr', 'string', 'nullable', 'url:http,https'],
            'informationUrl.fr' => ['required_with:informationUrl.en', 'string', 'nullable', 'url:http,https'],
            'abbreviation.en' => ['required_with:abbreviation.fr', 'string', 'nullable'],
            'abbreviation.fr' => ['required_with:abbreviation.en', 'string', 'nullable'],
        ];
    }

    /**
     * Return the validation messages
     */
    public function messages(): array
    {
        return [
            'informationUrl.*.url' => ErrorCode::INVALID_URL->name,
        ];
    }
}
