<?php

namespace App\GraphQL\Mutations;

use App\Enums\EmailType;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Nuwave\Lighthouse\Exceptions\ValidationException;

final class VerifyUserEmail
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
        $emailType = isset($args['emailType']) && $args['emailType'] === EmailType::WORK->name ? EmailType::WORK : EmailType::CONTACT;
        $field = $emailType == EmailType::CONTACT ? 'email' : 'work_email';
        $providedCode = $args['code'];
        $normalizedCode = trim(strtoupper($providedCode));

        $key = $emailType == EmailType::CONTACT ? 'email-verification-'.$user->id : 'work-email-verification-'.$user->id;
        $token = Cache::get($key);

        if (
            ! is_null($token) &&
            $token['code'] == $normalizedCode &&
            $token['field'] == $field &&
            $token['value'] == $user->getEmailForVerification($emailType)
        ) {
            $isValid = true;
        } else {
            $isValid = false;
        }

        if (! $isValid) {
            throw ValidationException::withMessages(['VERIFICATION_FAILED']);
        }

        // by now, token seems good
        if (($emailType == EmailType::CONTACT && ! $user->hasVerifiedContactEmail())
            || ! $user->hasVerifiedWorkEmail()) {
            $user->markEmailAsVerified($emailType);
        }
        $user->save();

        return $user;
    }
}
