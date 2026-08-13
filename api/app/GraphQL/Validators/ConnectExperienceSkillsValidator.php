<?php

namespace App\GraphQL\Validators;

use App\Enums\ErrorCode;
use Nuwave\Lighthouse\Validation\Validator;

final class ConnectExperienceSkillsValidator extends Validator
{
    /**
     * Return the validation rules.
     *
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        return [
            'id' => ['exists:skills,id'],
        ];
    }

    /**
     * Return the validation messages
     */
    public function messages(): array
    {
        return [
            'id.exists' => ErrorCode::SKILL_NOT_FOUND->name,
        ];
    }
}
