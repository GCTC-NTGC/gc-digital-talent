<?php

namespace App\GraphQL\Mutations;

use App\Enums\ErrorCode;
use App\GraphQL\Exceptions\ClientSafeTooManyRequestsException;
use App\GraphQL\Validators\WorkEmailAddressValidator;
use App\Models\User;
use App\Notifications\VerifyWorkEmail;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Validator;
use Nuwave\Lighthouse\Exceptions\ValidationException;

final class VerifyUserWorkEmail
{
    /**
     * Verify an email address with a code
     */
    public function __invoke(null $_, array $args)
    {
        /** @var User | null */
        $user = Auth::user();
        $providedCode = $args['code'];
        $normalizedCode = trim(strtoupper($providedCode));

        // Apply throttling to prevent brute-force attack
        // 10 attempts per minute deemed generous to real users while still hampering bots
        $rateLimiterKey = 'verify-user-email:'.$user->id;
        $attemptsPerMinute = 10;
        if (RateLimiter::tooManyAttempts($rateLimiterKey, $attemptsPerMinute)) {
            $seconds = RateLimiter::availableIn($rateLimiterKey);

            return new ClientSafeTooManyRequestsException(ErrorCode::RATE_LIMIT->name, $seconds);
        }
        RateLimiter::increment($rateLimiterKey);

        $key = VerifyWorkEmail::tokenCacheKey($user->id);
        $token = Cache::get($key);

        if (is_null($token)) {
            throw ValidationException::withMessages(['code' => ErrorCode::VERIFICATION_FAILED->name]);
        }

        // re-check the address in the token, in case it was taken since the code was sent
        $emailAddressValidator = new WorkEmailAddressValidator();
        $validator = Validator::make(
            $token,
            [
                'code' => ['required', 'string'],
                ...$emailAddressValidator->rules(),
            ],
            $emailAddressValidator->messages(),
        );

        if ($validator->fails()) {
            throw ValidationException::withMessages($validator->errors()->toArray());
        }

        if ($token['code'] !== $normalizedCode) {
            throw ValidationException::withMessages(['code' => ErrorCode::VERIFICATION_FAILED->name]);
        }

        $newEmailAddress = $token['emailAddress'];

        // by now, token seems good
        DB::transaction(function () use ($user, $newEmailAddress) {
            User::releaseWorkEmail($newEmailAddress, $user->id);
            $user->setVerifiedWorkEmail($newEmailAddress);
            $user->save();
        });

        Cache::forget($key); // the token is redeemed, don't use it again

        return $user;
    }
}
