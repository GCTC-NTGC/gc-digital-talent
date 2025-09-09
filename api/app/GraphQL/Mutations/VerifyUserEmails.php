<?php

namespace App\GraphQL\Mutations;

use App\Enums\EmailType;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Nuwave\Lighthouse\Exceptions\ValidationException;

final class VerifyUserEmails
{
    /**
     * Verify an email address with a code
     */
    public function __invoke($_, array $args)
    {
        /** @var \App\Models\User | null */
        $user = Auth::user();
        $providedCode = $args['code'];
        $normalizedCode = trim(strtoupper($providedCode));

        $key = 'email-verification-'.$user->id;
        $token = Cache::get($key); // refer to VerifyEmails->createVerificationCode

        if (! is_null($token) &&
        $token['code'] == $normalizedCode &&
        is_array($token['emailTypes']) &&
        is_string($token['emailAddress'])
        ) {
            $isValid = true;
        } else {
            $isValid = false;
        }

        if (! $isValid) {
            throw ValidationException::withMessages(['code' => 'VERIFICATION_FAILED']);
        }

        // by now, token seems good
        foreach ($token['emailTypes'] as $emailTypeString) {
            $emailType = EmailType::fromName($emailTypeString);
            $user->setVerifiedEmail($token['emailAddress'], $emailType);
        }
        $user->save();

        return $user;
    }
}
