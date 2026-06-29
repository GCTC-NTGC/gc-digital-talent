<?php

namespace App\GraphQL\Mutations;

use App\Enums\EmailType;
use App\Enums\ErrorCode;
use App\Models\User;
use App\Rules\CaseInsensitiveUnique;
use App\Rules\GovernmentEmailRegex;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Nuwave\Lighthouse\Exceptions\ValidationException;

final class VerifyUserEmails
{
    /**
     * Verify an email address with a code
     */
    public function __invoke($_, array $args)
    {
        /** @var User | null */
        $user = Auth::user();
        $providedCode = $args['code'];
        $normalizedCode = trim(strtoupper($providedCode));

        $key = 'email-verification-'.$user->id;
        $token = Cache::get($key); // refer to VerifyEmails->createVerificationCode

        if (is_null($token)) {
            throw ValidationException::withMessages(['code' => ErrorCode::VERIFICATION_FAILED->name]);
        }

        // these rules should stay similar to api/app/GraphQL/Validators/SendUserEmailsVerificationInputValidator.php
        $validator = Validator::make($token, [
            'code' => [
                'required',
                'string',
            ],
            'emailTypes' => [
                'required',
                'array',
                'min:1',
            ],
            'emailTypes.*' => [
                'required',
                'distinct',
                Rule::in(array_column(EmailType::cases(), 'name')),
            ],
            'emailAddress' => [
                'required',
                'string',
                Rule::when(fn ($attributes) => in_array(EmailType::WORK->name, $attributes['emailTypes']),
                    [new GovernmentEmailRegex()],
                    ['email']
                ),
                (new CaseInsensitiveUnique('users', 'email'))->ignore($user?->id, 'id'),
                (new CaseInsensitiveUnique('users', 'work_email'))->ignore($user?->id, 'id'),
            ],
        ],
            [
                'emailAddress.case_insensitive_unique' => ErrorCode::EMAIL_ADDRESS_IN_USE->name,
            ]);

        if ($validator->fails()) {
            throw ValidationException::withMessages($validator->errors()->toArray());
        }

        if ($token['code'] !== $normalizedCode) {
            throw ValidationException::withMessages(['code' => ErrorCode::VERIFICATION_FAILED->name]);
        }

        $newEmailAddress = $token['emailAddress'];

        // by now, token seems good
        foreach ($token['emailTypes'] as $emailTypeString) {
            switch ($emailTypeString) {
                case EmailType::CONTACT->name:
                    $user->setVerifiedContactEmail($newEmailAddress);
                    break;
                case EmailType::WORK->name:
                    $user->setVerifiedWorkEmail($newEmailAddress);
                    break;
                default:
                    throw new \Exception('Unexpected email type: '.$emailTypeString);
            }
        }
        $user->save();

        Cache::forget($key); // the token is redeemed, don't use it again

        return $user;
    }
}
