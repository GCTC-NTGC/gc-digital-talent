<?php

namespace App\GraphQL\Validators;

use App\Enums\ErrorCode;
use App\Rules\CaseInsensitiveUnique;
use App\Rules\GovernmentEmailRegex;
use Illuminate\Support\Facades\Auth;
use Nuwave\Lighthouse\Validation\Validator;

/**
 * Validates a work email address the user wants to verify.
 * Used by the sendUserWorkEmailVerification mutation (via @validator) and by
 * VerifyUserWorkEmail to re-check the address stored in the token.
 */
final class WorkEmailAddressValidator extends Validator
{
    public function __construct() {}

    /**
     * Return the validation rules.
     *
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        $user = Auth::user();

        return [
            'emailAddress' => [
                'required',
                'email',
                new GovernmentEmailRegex(),
                new CaseInsensitiveUnique('users', 'email')->ignore($user?->id, 'id'),
            ],
        ];
    }

    /**
     * Return the validation messages
     */
    public function messages(): array
    {
        return [
            'emailAddress.case_insensitive_unique' => ErrorCode::EMAIL_ADDRESS_IN_USE->name,
        ];
    }
}
