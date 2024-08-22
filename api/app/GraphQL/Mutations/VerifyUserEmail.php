<?php

namespace App\GraphQL\Mutations;

use App\Enums\ApiError;
use Illuminate\Support\Facades\Auth;
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
        /** @var \App\Models\User */
        $user = Auth::user();
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
            throw ValidationException::withMessages([
                'code' => [ApiError::EMAIL_VERIFICATION_FAILED->localizedMessage()],
            ]);
        }

        // by now, token seems good
        if (! $user->hasVerifiedEmail()) {
            $user->markEmailAsVerified();
        }
        $user->save();

        return $user;
    }
}
