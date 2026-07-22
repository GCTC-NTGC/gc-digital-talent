<?php

namespace App\GraphQL\Validators;

use App\Enums\EmailType;
use App\Enums\ErrorCode;
use App\Rules\CaseInsensitiveUnique;
use App\Rules\GovernmentEmailRegex;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Nuwave\Lighthouse\Validation\Validator;

final class SendUserEmailsVerificationInputValidator extends Validator
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

        // these rules should stay similar to api/app/GraphQL/Mutations/VerifyUserEmails.php
        return [
            'emailTypes' => [
                'required',
                'array',
                'min:1',
            ],
            'emailTypes.*' => [
                'required',
                'distinct',
                Rule::in(array_column(EmailType::verifiableGroup(), 'name')),
            ],
            'emailAddress' => [
                'required',
                'string',
                Rule::when(fn () => in_array(EmailType::WORK->name, $this->arg('emailTypes')),
                    [new GovernmentEmailRegex()],
                    ['email']
                ),
                (new CaseInsensitiveUnique('users', 'email'))->ignore($user?->id, 'id'),
                (new CaseInsensitiveUnique('users', 'work_email'))->ignore($user?->id, 'id'),
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
