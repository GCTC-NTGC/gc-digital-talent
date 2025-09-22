<?php

namespace App\GraphQL\Validators;

use App\Enums\EmailType;
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

        return [
            'emailAddress' => [
                Rule::when(fn () => in_array(EmailType::WORK->name, $this->arg('emailTypes')),
                    [new GovernmentEmailRegex],
                    ['email']
                ),
                Rule::unique('users', 'email')->ignore($user->id, 'id'),
                Rule::unique('users', 'work_email')->ignore($user->id, 'id'),
            ],
            'emailTypes' => [
                'array',
                'min:1',
            ],
            'emailTypes.*' => [
                'distinct',
                Rule::in(array_column(EmailType::cases(), 'name')),
            ],
        ];
    }
}
