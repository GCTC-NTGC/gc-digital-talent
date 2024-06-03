<?php

namespace App\GraphQL\Mutations;

use App\Models\User;
use GraphQL\Error\Error;
use Illuminate\Support\Facades\Cache;

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

        if (is_null($token)) {
            throw new Error('Token not found');
        }

        if ($token['code'] != $normalizedCode) {
            throw new Error('Bad code');
        }

        if ($token['field'] != 'email') {
            throw new Error('Unexpected field');
        }

        if ($user->getEmailForVerification() != $token['value']) {
            throw new Error('Token value invalid');
        }

        // by now, token seems good
        if (! $user->hasVerifiedEmail()) {
            $user->markEmailAsVerified();
        }
        $user->save();

        return $user;
    }
}
