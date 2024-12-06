<?php

namespace App\GraphQL\Mutations;

use App\Enums\EmailType;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Nuwave\Lighthouse\Exceptions\ValidationException;

final class VerifyUserEmail
{
    /**
     * Verify an email address with a code
     */
    public function __invoke($_, array $args)
    {
        /** @var \App\Models\User | null */
        $user = Auth::user();
        $emailType = isset($args['emailType']) ? EmailType::fromName($args['emailType']) : EmailType::CONTACT;
        $providedCode = $args['code'];
        $normalizedCode = trim(strtoupper($providedCode));

        $key = $emailType->name.'-email-verification-'.$user->id;
        $token = Cache::get($key);

        if (
            ! is_null($token) &&
            $token['code'] == $normalizedCode &&
            $token['field'] == $emailType->value &&
            $token['value'] == $user->getEmailForVerification($emailType)
        ) {
            $isValid = true;
        } else {
            $isValid = false;
        }

        if (! $isValid) {
            throw ValidationException::withMessages(['code' => 'VERIFICATION_FAILED']);
        }

        // by now, token seems good
        if (! $user->hasVerifiedEmail($emailType)) {
            $user->markEmailAsVerified($emailType);
        }
        $user->save();

        return $user;
    }
}
