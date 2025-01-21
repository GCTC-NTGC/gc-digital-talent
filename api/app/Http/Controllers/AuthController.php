<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\User;
use App\Services\OpenIdBearerTokenService;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use InvalidArgumentException;
use Lcobucci\JWT\Configuration;
use Lcobucci\JWT\UnencryptedToken;

class AuthController extends Controller
{
    protected $fastSigner;

    public function __construct(OpenIdBearerTokenService $service)
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
        } elseif (strcasecmp($requestedLocale, 'fr') == 0) {
            $ui_locales = 'fr-CA fr';
        } else {
            $ui_locales = $requestedLocale;
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
            'ui_locales' => $ui_locales,
        ]);

        return redirect(config('oauth.authorize_uri').'?'.$query);
    }

    public function authCallback(Request $request)
    {
        // pull the original nonce and state from  beginning to compare with returned values
        $state = $request->session()->pull('state');
        $nonce = $request->session()->pull('nonce');

        throw_unless(
            strlen($state) > 0 && $state === $request->state,
            new InvalidArgumentException('Invalid session state')
        );

        $response = Http::retry(times: config('oauth.request_retries'), sleepMilliseconds: 500, when: function (Exception $exception) {
            return $exception instanceof ConnectionException;
        }, throw: false)->asForm()->post(config('oauth.token_uri'), [
            'grant_type' => 'authorization_code',
            'client_id' => config('oauth.client_id'),
            'client_secret' => config('oauth.client_secret'),
            'redirect_uri' => config('oauth.redirect_uri'),
            'code' => $request->code,
        ]);
        if ($response->failed()) {
            Log::error('Failed when POSTing to the token URI in authCallback');
            Log::debug((string) $response->getBody());

            return response('Failed to get token', 400);
        }
        // decode id_token stage
        // pull token out of the response as json -> lcobucci parser, no key verification is being done here however
        $idToken = $response->json('id_token');

        if (! ($idToken && is_string($idToken))) {
            Log::debug((string) $response->body());
            throw new InvalidArgumentException('id token is a '.gettype($idToken));
        }

        $config = $this->fastSigner;
        assert($config instanceof Configuration);

        $token = $config->parser()->parse($idToken);
        assert($token instanceof UnencryptedToken);

        // grab the tokenNonce out of the unencrypted thing and compare to original nonce, and throw_unless if mismatch
        $tokenNonce = $token->claims()->get('nonce');
        throw_unless(
            strlen($tokenNonce) > 0 && $tokenNonce === $nonce,
            new InvalidArgumentException('Invalid session nonce')
        );

        // nothing to break the session now, mark login successful with a last active update
        $sub = $token->claims()->get('sub');
        $userMatch = User::where('sub', $sub)->withTrashed()->first();
        $now = Carbon::now();
        if (isset($userMatch)) {
            $userMatch->last_sign_in_at = $now;
            $userMatch->save();
        } else {
            // No user found for given subscriber - lets auto-register them
            $newUser = new User;
            $newUser->sub = $sub;
            $newUser->last_sign_in_at = $now;
            $newUser->save();
            $newUser->syncRoles([  // every new user is automatically an base_user and an applicant
                Role::where('name', 'base_user')->sole(),
                Role::where('name', 'applicant')->sole(),
            ], null);
        }

        $query = http_build_query($response->json());

        $from = $request->session()->pull('from');

        if ($from != filter_var($from, FILTER_SANITIZE_URL)) {
            $from = null;
        } // Contains unsanitary characters. Throw it away.
        if (substr($from, 0, 1) != '/') {
            $from = null;
        } // Does not start with / so it's not a relative url. Don't want an open redirect vulnerability. Throw it away.

        $appUrl = config('app.url');
        $postLoginRedirect = config('oauth.post_login_redirect');
        if ($request->session()->pull('devServer')) {
            $appUrl = config('app.dev_url');
            $postLoginRedirect = config('oauth.dev_post_login_redirect');
        }

        $navigateToUri = strlen($from) > 0 ? $appUrl.$from : $postLoginRedirect;

        return redirect($navigateToUri.'?'.$query);
    }

    public function refresh(Request $request)
    {
        $refreshToken = $request->query('refresh_token');
        $response =
        Http::retry(times: config('oauth.request_retries'), sleepMilliseconds: 500, when: function (Exception $exception) {
            return $exception instanceof ConnectionException;
        }, throw: false)->asForm()
            ->post(config('oauth.token_uri'), [
                'grant_type' => 'refresh_token',
                'client_id' => config('oauth.client_id'),
                'client_secret' => config('oauth.client_secret'),
                'refresh_token' => $refreshToken,
            ]);
        if ($response->failed()) {
            $errorCode = $response->json('error');
            $isNormalErrorCode = $errorCode == 'invalid_grant';

            $errorMessageToLog = 'Failed when POSTing to the token URI in refresh '.$errorCode;
            if (! $isNormalErrorCode) {
                Log::error($errorMessageToLog);
            } else {
                Log::debug($errorMessageToLog);
            }
            Log::debug((string) $response->getBody());

            return response('Failed to get token', 400);
        }

        return response($response)->header('Content-Type', 'application/json');
    }
}
