<?php

namespace App\GraphQL\Validators;

use App\Enums\ErrorCode;
use App\Rules\CaseInsensitiveUnique;
use Illuminate\Validation\Rule;
use Nuwave\Lighthouse\Validation\Validator;

final class CreateUserInputValidator extends Validator
{
    /**
     * Return the validation rules.
     *
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        return [
            'sub' => [
                'sometimes',
                Rule::unique('users', 'sub'),
            ],
            'email' => [
                'sometimes',
                'nullable',
                new CaseInsensitiveUnique('users', 'email'),
                new CaseInsensitiveUnique('users', 'work_email'),
            ],
            'workEmail' => [
                'sometimes',
                'nullable',
                new CaseInsensitiveUnique('users', 'email'),
                new CaseInsensitiveUnique('users', 'work_email'),
            ],
        ];
    }

    /**
     * Return the validation messages
     */
    public function messages(): array
    {
        return [
            'sub.unique' => ErrorCode::SUB_IN_USE->name,
            'email.case_insensitive_unique' => ErrorCode::EMAIL_ADDRESS_IN_USE->name,
            'workEmail.case_insensitive_unique' => ErrorCode::EMAIL_ADDRESS_IN_USE->name,
        ];
    }
}
