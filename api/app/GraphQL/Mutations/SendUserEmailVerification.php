<?php

namespace App\GraphQL\Mutations;

use App\Enums\EmailType;
use GraphQL\Error\Error;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

final class SendUserEmailVerification
{
    /**
     * Verify an email address with a code
     *
     * @param  array{}  $args
     */
    public function __invoke($_, array $args)
    {
        try {
            /** @var \App\Models\User | null */
            $user = Auth::user();
            $emailType = isset($args['emailType']) ? EmailType::fromName($args['emailType']) : EmailType::CONTACT;
            $user->sendEmailVerificationNotification($emailType);
        } catch (\Throwable $e) {
            Log::error('Problem sending email verification code '.$e);

            return new Error($e->getMessage());
        }

        return $user;
    }
}
