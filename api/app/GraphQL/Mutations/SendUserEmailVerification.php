<?php

namespace App\GraphQL\Mutations;

use App\Enums\EmailType;
use Illuminate\Support\Facades\Auth;

final class SendUserEmailVerification
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
        $emailType = isset($args['emailType']) ? EmailType::fromName($args['emailType']) : EmailType::CONTACT;
        $user->sendEmailVerificationNotification($emailType);

        return $user;
    }
}
