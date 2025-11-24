<?php

namespace App\GraphQL\Mutations;

use App\Models\User;

final class RemoveUserWorkEmail
{
    /**
     * Wipe the user's work email and verification fields
     */
    public function __invoke($_, array $args)
    {
        /** @var User $user */
        $user = User::find($args['id']);

        $user->work_email = null;
        $user->work_email_verified_at = null;
        $user->save();

        return $user;
    }
}
