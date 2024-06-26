<?php

namespace App\GraphQL\Mutations;

use App\Models\User;
use Illuminate\Support\Facades\Cache;
use Nuwave\Lighthouse\Exceptions\ValidationException;

final class VerifyUserEmail
{
    /**
     * Verify an email address with a code
     *
     * @param  array{}  $args
     */
    public function __invoke($_, array $args)
    {
        $user = User::find($args['id']);
        $providedCode = $args['code'];
        $normalizedCode = trim(strtoupper($providedCode));

        $key = 'email-verification-'.$user->id;
        $token = Cache::get($key);

        if (
            ! is_null($token) &&
            $token['code'] == $normalizedCode &&
            $token['field'] == 'email' &&
            $token['value'] == $user->getEmailForVerification()
        ) {
            $isValid = true;
        } else {
            $isValid = false;
        }

        if (! $isValid) {
            throw ValidationException::withMessages(['VERIFICATION_FAILED']);
        }

        // by now, token seems good
        if (! $user->hasVerifiedEmail()) {
            $user->markEmailAsVerified();
        }
        $user->save();

        return $user;
    }
}
