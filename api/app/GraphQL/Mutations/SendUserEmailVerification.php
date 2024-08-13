<?php

namespace App\GraphQL\Mutations;

use Illuminate\Support\Facades\Auth;

final class SendUserEmailVerification
{
    /**
     * Verify an email address with a code
     *
     * @param  array{}  $args
     */
    public function __invoke($_)
    {
        /** @var \App\Models\User */
        $user = Auth::user();
        $user->sendEmailVerificationNotification();

        return $user;
    }
}
