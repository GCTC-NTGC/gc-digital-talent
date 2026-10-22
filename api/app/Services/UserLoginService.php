<?php

namespace App\Services;

use App\Models\Role;
use App\Models\User;
use App\Rules\GovernmentEmailRegex;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Log;
use Lcobucci\JWT\Token\DataSet;
use Throwable;

/**
 * Finishes a login once the auth provider has identified the user.
 * Shared by every login flow so they all treat claims and redirects the same way.
 */
class UserLoginService
{
    /**
     * Apply the login claims to the user and hand the tokens back to the frontend.
     *
     * @param  array<string, mixed>  $tokens  passed to the frontend as query parameters
     */
    public function completeLogin(Request $request, DataSet $claims, array $tokens): RedirectResponse
    {
        [, $newUserCreated] = $this->applyClaims($claims);

        return $this->postLoginRedirect($request, $newUserCreated, $tokens);
    }

    /**
     * @return array{0: User, 1: bool} the matched user and whether they were newly created
     */
    public function applyClaims(DataSet $claims): array
    {
        // preferred language
        $localeCode = null;
        if ($claims->has('locale')) {
            $normalizedValue = strtolower(substr($claims->get('locale'), 0, 2));
            if ($normalizedValue == 'en' || $normalizedValue == 'fr') {
                $localeCode = $normalizedValue;
            }
        }

        // track whether a new user was created
        $newUserCreated = false;

        // find the corresponding User
        $sub = $claims->get('sub');
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
        $userMatch->last_sign_in_iss = $claims->get('iss', null);
        if ($claims->has('given_name')) {
            $userMatch->first_name = $claims->get('given_name');
        }
        if ($claims->has('family_name')) {
            $userMatch->last_name = $claims->get('family_name');
        }
        if ($claims->has('email')) {
            $incomingEmailAddress = $claims->get('email');

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
        if ($claims->has('phone_number')) {
            $userMatch->telephone = $claims->get('phone_number');
        }
        if (! empty($localeCode)) {
            $userMatch->preferred_lang = $localeCode;
        }
        $userMatch->save();

        return [$userMatch, $newUserCreated];
    }

    /**
     * @param  array<string, mixed>  $tokens  passed to the frontend as query parameters
     */
    private function postLoginRedirect(Request $request, bool $newUserCreated, array $tokens): RedirectResponse
    {
        // start with token payload
        $authCallbackResponseQuery = $tokens;

        $from = $request->session()->pull('from');

        if ($from != filter_var($from, FILTER_SANITIZE_URL)) {
            $from = null;
        } // Contains unsanitary characters. Throw it away.
        if (substr($from, 0, 1) != '/') {
            $from = null;
        } // Does not start with / so it's not a relative url. Don't want an open redirect vulnerability. Throw it away.

        if ($newUserCreated) {
            // new user, go to registration
            if (strlen($from) > 0) {
                $authCallbackResponseQuery['from'] = $from;
            }
            $navigateToUri = config('oauth.post_login_registration_redirect');
        } else {
            // existing user, go where they want
            $appUrl = config('app.url');
            $navigateToUri = strlen($from) > 0 ? $appUrl.$from : config('oauth.post_login_redirect');
        }

        // duplicate logic for running with watch mode
        if ($request->session()->pull('devServer')) {
            if ($newUserCreated) {
                // new user, go to registration
                if (strlen($from) > 0) {
                    $authCallbackResponseQuery['from'] = $from;
                }
                $navigateToUri = config('oauth.dev_post_login_registration_redirect');
            } else {
                // existing user, go where they want
                $appUrl = config('app.dev_url');
                $navigateToUri = strlen($from) > 0 ? $appUrl.$from : config('oauth.dev_post_login_redirect');
            }
        }

        return redirect($navigateToUri.'?'.http_build_query($authCallbackResponseQuery));
    }
}
