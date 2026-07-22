<?php

namespace App\Http\Controllers;

use App\Contracts\BearerTokenService;
use App\Models\Role;
use App\Models\User;
use App\Rules\GovernmentEmailRegex;
use App\Support\LogUtil;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use InvalidArgumentException;
use Lcobucci\JWT\Configuration;
use Lcobucci\JWT\UnencryptedToken;
use Throwable;

class AuthController extends Controller
{
    protected $fastSigner;

    public function __construct(BearerTokenService $service)
    {
        // inject signer method from service file
        $this->fastSigner = $service->fastSigner();
    }

    public function login(Request $request)
    {
        $state = Str::random(40);
        $nonce = Str::random(40);
        $request->session()->put('state', $state);
        $request->session()->put('nonce', $nonce);

        $request->session()->put(
            'from',
            $request->input('from')
        );

        $request->session()->put(
            'devServer',
            $request->input('devServer')
        );

        $requestedLocale = $request->input('locale');
        if (strcasecmp($requestedLocale, 'en') == 0) {
            $ui_locales = 'en-CA en';
            $lang = 'en';
        } elseif (strcasecmp($requestedLocale, 'fr') == 0) {
            $ui_locales = 'fr-CA fr';
            $lang = 'fr';
        } else {
            $ui_locales = $requestedLocale;
            $lang = $requestedLocale;
        }

        $scope = 'openid offline_access';

        $query = http_build_query([
            'client_id' => config('oauth.client_id'),
            'redirect_uri' => config('oauth.redirect_uri'),
            'response_type' => 'code',
            'scope' => $scope,
            'state' => $state,
            'nonce' => $nonce,
            'acr_values' => config('oauth.acr_values'),
            'ui_locales' => $ui_locales, // This is what SIC wants
            'lang' => $lang,  // This is what CanadaLogin wants
            'skipmigration' => $request->input('skipmigration', null),
        ]);

        return redirect(config('oauth.authorize_uri').'?'.$query);
    }

    public function authCallback(Request $request)
    {
        // pull the original nonce and state from  beginning to compare with returned values
        $state = $request->session()->pull('state');
        $nonce = $request->session()->pull('nonce');

        // Session state does not match or is empty, do not login.
        if (! (strlen($state) > 0 && $state === $request->state)) {
            return redirect(config('oauth.logged_out_redirect').'?'.http_build_query(['reason' => 'invalid-session']));

        }

        $tokenPayload = [
            'grant_type' => 'authorization_code',
            'client_id' => config('oauth.client_id'),
            'client_secret' => config('oauth.client_secret'),
            'redirect_uri' => config('oauth.redirect_uri'),
            'code' => $request->code,
        ];
        $tokenResponse = Http::retry(times: config('oauth.request_retries'), sleepMilliseconds: 500, when: function (Throwable $exception) {
            return $exception instanceof ConnectionException;
        }, throw: false)->asForm()->post(config('oauth.token_uri'), $tokenPayload);
        assert($tokenResponse instanceof Response);
        if ($tokenResponse->failed()) {
            Log::error('Failed when POSTing to the token URI in authCallback', LogUtil::responseContext($tokenResponse));
            Log::debug(LogUtil::cleanString($tokenResponse->body()));
            Log::debug(LogUtil::cleanArray($tokenPayload));

            return response('Failed to get token', 400);
        }
        // decode id_token stage
        // pull token out of the response as json -> lcobucci parser, no key verification is being done here however
        $encodedIdToken = $tokenResponse->json('id_token');

        if (! ($encodedIdToken && is_string($encodedIdToken))) {
            Log::debug(LogUtil::cleanString($tokenResponse->body()));
            throw new InvalidArgumentException('id token is a '.gettype($encodedIdToken));
        }

        $config = $this->fastSigner;
        assert($config instanceof Configuration);

        $idToken = $config->parser()->parse($encodedIdToken);
        assert($idToken instanceof UnencryptedToken);

        // grab the tokenNonce out of the unencrypted thing and compare to original nonce, and throw_unless if mismatch
        $tokenNonce = $idToken->claims()->get('nonce');
        throw_unless(
            strlen($tokenNonce) > 0 && $tokenNonce === $nonce,
            new InvalidArgumentException('Invalid session nonce')
        );

        // preferred language
        $idTokenLocaleCode = null;
        if ($idToken->claims()->has('locale')) {
            $normalizedValue = strtolower(substr($idToken->claims()->get('locale'), 0, 2));
            if ($normalizedValue == 'en' || $normalizedValue == 'fr') {
                $idTokenLocaleCode = $normalizedValue;
            }
        }

        // track whether a new user was created
        $newUserCreated = false;

        // find the corresponding User
        $sub = $idToken->claims()->get('sub');
        $userMatch = User::where('sub', $sub)->withTrashed()->firstOr(function () use ($sub, &$newUserCreated, $idTokenLocaleCode) {
            // No user found for given subscriber - lets auto-register them
            $newUser = new User();
            $newUser->sub = $sub;
            if ($idTokenLocaleCode == 'en') {
                $newUser->looking_for_english = true;
            }
            if ($idTokenLocaleCode == 'fr') {
                $newUser->looking_for_french = true;
            }
            if (! empty($idTokenLocaleCode)) {
                $newUser->preferred_language_for_interview = $idTokenLocaleCode;
                $newUser->preferred_language_for_exam = $idTokenLocaleCode;
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
        $userMatch->last_sign_in_iss = $idToken->claims()->get('iss', null);
        if ($idToken->claims()->has('given_name')) {
            $userMatch->first_name = $idToken->claims()->get('given_name');
        }
        if ($idToken->claims()->has('family_name')) {
            $userMatch->last_name = $idToken->claims()->get('family_name');
        }
        if ($idToken->claims()->has('email')) {
            $incomingEmailAddress = $idToken->claims()->get('email');

            // if email is not null, check if existing users have this email and take it from them
            if (! empty($incomingEmailAddress)) {
                try {
                    $existingUser = User::where('id', '!=', $userMatch->id)
                        ->where(fn ($subquery) => $subquery
                            ->where('email', 'ilike', $incomingEmailAddress)
                            ->orWhere('work_email', 'ilike', $incomingEmailAddress))
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
                    ->where('email', 'ilike', $incomingEmailAddress)
                    ->orWhere('work_email', 'ilike', $incomingEmailAddress)
                )->count() == 0
            ) {
                $userMatch->setVerifiedContactEmail($incomingEmailAddress);
                if (preg_match(GovernmentEmailRegex::PATTERN, $incomingEmailAddress)) {
                    $userMatch->setVerifiedWorkEmail($incomingEmailAddress);
                }
            }
        }
        if ($idToken->claims()->has('phone_number')) {
            $userMatch->telephone = $idToken->claims()->get('phone_number');
        }
        if (! empty($idTokenLocaleCode)) {
            $userMatch->preferred_lang = $idTokenLocaleCode;
        }
        $userMatch->save();

        // start with token payload
        $authCallbackResponseQuery = $tokenResponse->json();

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

    public function refresh(Request $request)
    {
        // Test token branch — only active when TESTING_TOKEN_ENABLED=true and APP_ENV_VERTICAL != production.
        // Checks the secret VALUE so a wrong/missing header falls through to normal OAuth refresh.
        $testSecret = config('testing.endpoint_secret');
        if (config('testing.token_enabled') && config('app.vertical') !== 'production' && $testSecret && $request->header('X-Testing-Secret') === $testSecret) {
            return app(TestTokenController::class)->issue($request);
        }

        $refreshToken = $request->query('refresh_token');
        $payload = [
            'grant_type' => 'refresh_token',
            'client_id' => config('oauth.client_id'),
            'client_secret' => config('oauth.client_secret'),
            'refresh_token' => $refreshToken,
        ];
        $response =
        Http::retry(times: config('oauth.request_retries'), sleepMilliseconds: 500, when: function (Throwable $exception) {
            return $exception instanceof ConnectionException;
        }, throw: false)->asForm()
            ->post(config('oauth.token_uri'), $payload);
        assert($response instanceof Response);
        if ($response->failed()) {
            $errorCode = $response->json('error');
            $isNormalErrorCode = $errorCode == 'invalid_grant';
            Log::log(
                level: $isNormalErrorCode ? 'debug' : 'error',
                message: 'Failed when POSTing to the token URI in refresh',
                context: LogUtil::responseContext($response)
            );
            Log::debug(LogUtil::cleanString($response->body()));
            Log::debug(LogUtil::cleanArray($payload));

            return response('Failed to get token', 400);
        }

        return response($response)->header('Content-Type', 'application/json');
    }

    // generates an allow-list of auth callbacks for our domain
    public function sectorIdentifier(Request $request)
    {
        $callbackUrls = [
            // our actual auth callback
            config('oauth.redirect_uri'),
        ];

        // temporarily allow callback to the migration tool
        if (config('oauth.migration_tool_callback')) {
            $callbackUrls[] = config('oauth.migration_tool_callback');
        }

        return response(json_encode($callbackUrls, JSON_UNESCAPED_SLASHES))
            ->withHeaders([
                'Content-Type' => 'application/json; charset=utf-8',
            ]);
    }
}
