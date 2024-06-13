<?php

namespace App\GraphQL\Mutations;

use App\Models\User;

final class SendUserEmailVerification
{
    /**
     * Verify an email address with a code
     *
     * @param  array{}  $args
     */
    public function __invoke($_, array $args)
    {
        $user = User::find($args['id']);
        $user->sendEmailVerificationNotification();

        return $user;
    }
}
