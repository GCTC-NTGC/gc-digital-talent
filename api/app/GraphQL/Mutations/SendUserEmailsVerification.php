<?php

namespace App\GraphQL\Mutations;

use App\Notifications\VerifyEmails;
use GraphQL\Error\Error;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

final class SendUserEmailsVerification
{
    /**
     * Verify an email address with a code
     */
    public function __invoke($_, array $args)
    {
        try {
            /** @var \App\Models\User | null */
            $user = Auth::user();
            $emailAddress = $args['emailAddress'];
            $emailTypes = $args['emailTypes'];

            $message = new VerifyEmails($emailAddress, $emailTypes);
            $user->notify($message);
        } catch (\Throwable $e) {
            Log::error('Problem sending email verification code '.$e);

            return new Error($e->getMessage());
        }

        return $user;
    }
}
