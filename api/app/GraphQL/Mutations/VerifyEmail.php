<?php

namespace App\GraphQL\Mutations;

use GraphQL\Error\Error;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;

final class VerifyEmail
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

        $code = $args['code'];
        $key = 'email-verification-'.$code;
        $token = Cache::get($key);

        if (is_null($token)) {
            throw new Error('Token not found');
        }

        if ($token['user_id'] != $user->id) {
            throw new Error('Bad user ID');
        }

        if ($token['field'] == 'email' && $user->getEmailForVerification() == $token['value']) {
            if (! $user->hasVerifiedEmail()) {
                $user->markEmailAsVerified();
            }
        } elseif ($token['field'] == 'work_email' && $user->getWorkEmailForVerification() == $token['value']) {
            if (! $user->hasVerifiedWorkEmail()) {
                $user->markWorkEmailAsVerified();
            }
        } else {
            throw new Error('Bad request');
        }
        $user->save();

        return $user;
    }
}
