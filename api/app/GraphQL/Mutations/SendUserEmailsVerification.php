<?php

namespace App\GraphQL\Mutations;

use App\Enums\ErrorCode;
use App\Notifications\VerifyEmails;
use GraphQL\Error\Error;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\RateLimiter;

final class SendUserEmailsVerification
{
    /**
     * Verify an email address with a code
     */
    public function __invoke($_, array $args)
    {
        /** @var \App\Models\User | null */
        $user = Auth::user();
        $emailAddress = $args['emailAddress'];
        $emailTypes = $args['emailTypes'];
        $rateLimiterKey = 'send-user-emails-verification:'.$user->id;

        try {
            $executed = RateLimiter::attempt(
                $rateLimiterKey,
                $maxAttempts = 1,
                fn () => $user->notify(new VerifyEmails($emailAddress, $emailTypes)),
                $decaySeconds = 30
            );
        } catch (\Throwable $e) {
            Log::error('Problem sending email verification code '.$e);

            return new Error($e->getMessage());
        }

        if (! $executed) {
            $seconds = RateLimiter::availableIn($rateLimiterKey);
            Log::debug('Remaining time: '.$seconds);

            return new Error(ErrorCode::TOO_MANY_REQUESTS->name);

        }

        return $user;
    }
}
