<?php

namespace App\Services;

use App\Models\Role;
use App\Models\User;
use App\Rules\GovernmentEmailRegex;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Log;
use Throwable;

/**
 * Creates or updates a user from the claims of a login.
 * Shared by every login flow so they all treat claims the same way.
 */
class UserClaimsService
{
    /**
     * @param  array<string, mixed>  $claims
     * @return bool whether the user was newly created
     */
    public function applyClaims(array $claims): bool
    {
        // preferred language
        $localeCode = null;
        if (array_key_exists('locale', $claims)) {
            $normalizedValue = strtolower(substr($claims['locale'], 0, 2));
            if ($normalizedValue == 'en' || $normalizedValue == 'fr') {
                $localeCode = $normalizedValue;
            }
        }

        // track whether a new user was created
        $newUserCreated = false;

        // find the corresponding User
        $sub = $claims['sub'];
        $userMatch = User::where('sub', $sub)->withTrashed()->firstOr(function () use ($sub, &$newUserCreated, $localeCode) {
            // No user found for given subscriber - lets auto-register them
            $newUser = new User();
            $newUser->sub = $sub;
            if ($localeCode == 'en') {
                $newUser->looking_for_english = true;
            }
            if ($localeCode == 'fr') {
                $newUser->looking_for_french = true;
            }
            if (! empty($localeCode)) {
                $newUser->preferred_language_for_interview = $localeCode;
                $newUser->preferred_language_for_exam = $localeCode;
            }
            $newUser->save();
            $newUser->syncRoles([  // every new user is automatically an base_user and an applicant
                Role::where('name', 'base_user')->sole(),
                Role::where('name', 'applicant')->sole(),
            ], null);
            $newUserCreated = true;

            return $newUser;
        });

        // update the user with values from logging in
        $userMatch->last_sign_in_at = Carbon::now();
        $userMatch->last_sign_in_iss = $claims['iss'] ?? null;
        if (array_key_exists('given_name', $claims)) {
            $userMatch->first_name = $claims['given_name'];
        }
        if (array_key_exists('family_name', $claims)) {
            $userMatch->last_name = $claims['family_name'];
        }
        if (array_key_exists('email', $claims)) {
            $incomingEmailAddress = $claims['email'];

            // if email is not null, check if existing users have this email and take it from them
            if (! empty($incomingEmailAddress)) {
                try {
                    $existingUser = User::where('id', '!=', $userMatch->id)
                        ->where(fn ($subquery) => $subquery
                            ->whereRaw('LOWER(email) = ?', [mb_strtolower($incomingEmailAddress)])
                            ->orWhereRaw('LOWER(work_email) = ?', [mb_strtolower($incomingEmailAddress)]))
                        ->withTrashed()
                        ->first();
                    if ($existingUser) {
                        if (! empty($existingUser->email) && strcasecmp($existingUser->email, $incomingEmailAddress) == 0) {
                            $existingUser->email_backup = $existingUser->email;
                            $existingUser->email = null;
                        }
                        if (! empty($existingUser->work_email) && strcasecmp($existingUser->work_email, $incomingEmailAddress) == 0) {
                            $existingUser->work_email_backup = $existingUser->work_email;
                            $existingUser->work_email = null;
                        }
                        $existingUser->save();
                    }
                } catch (Throwable $e) {
                    // log and continue - don't break log in for failure to take address
                    Log::error('Failed to take email address on log in.', [
                        'message' => $e->getMessage(),
                        'sub' => $sub,
                        'email address' => $incomingEmailAddress,
                    ]);
                }
            }

            // email should be clear now so save if possible
            if (User::where('sub', '!=', $sub)
                ->where(fn ($subquery) => $subquery
                    ->whereRaw('LOWER(email) = ?', [mb_strtolower($incomingEmailAddress)])
                    ->orWhereRaw('LOWER(work_email) = ?', [mb_strtolower($incomingEmailAddress)])
                )->count() == 0
            ) {
                $userMatch->setVerifiedContactEmail($incomingEmailAddress);
                if (preg_match(GovernmentEmailRegex::PATTERN, $incomingEmailAddress)) {
                    $userMatch->setVerifiedWorkEmail($incomingEmailAddress);
                }
            }
        }
        if (array_key_exists('phone_number', $claims)) {
            $userMatch->telephone = $claims['phone_number'];
        }
        if (! empty($localeCode)) {
            $userMatch->preferred_lang = $localeCode;
        }
        $userMatch->save();

        return $newUserCreated;
    }
}
