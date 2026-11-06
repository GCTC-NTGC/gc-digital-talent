<?php

namespace App\GraphQL\Mutations;

use App\Enums\ErrorCode;
use App\GraphQL\Exceptions\ClientSafeTooManyRequestsException;
use App\Models\User;
use App\Notifications\VerifyWorkEmail;
use GraphQL\Error\Error;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\RateLimiter;

final class SendUserWorkEmailVerification
{
    /**
     * Verify an email address with a code
     */
    public function __invoke($_, array $args)
    {
        /** @var User | null */
        $user = Auth::user();
        $emailAddress = $args['emailAddress'];
        $rateLimiterKey = 'send-user-email-verification:'.$user->id;

        try {
            $executed = RateLimiter::attempt(
                $rateLimiterKey,
                $maxAttempts = 1,
                fn () => $user->notify(new VerifyWorkEmail($emailAddress)),
                $decaySeconds = 30
            );
        } catch (\Throwable $e) {
            Log::error('Problem sending email verification code',
                [
                    'message' => $e->getMessage(),
                    'userId' => $user->id,
                    'emailAddress' => $emailAddress,
                ]);

            return new Error($e->getMessage());
        }

        if (! $executed) {
            $seconds = RateLimiter::availableIn($rateLimiterKey);
            Log::debug('Remaining time: '.$seconds);

            return new ClientSafeTooManyRequestsException(ErrorCode::RATE_LIMIT->name, $seconds);

        }

        return $user;
    }
}
