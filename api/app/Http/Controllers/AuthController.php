<?php

namespace App\Http\Controllers;

use App\Services\UserClaimsService;
use App\Support\LogUtil;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use InvalidArgumentException;
use Jose\Component\Core\Util\Base64UrlSafe;
use Lcobucci\JWT\Encoding\JoseEncoder;
use Lcobucci\JWT\Token\Parser;
use Lcobucci\JWT\UnencryptedToken;
use Throwable;

class AuthController extends Controller
{
    public function __construct(protected UserClaimsService $userClaimsService) {}

    public function login(Request $request)
    {
        $state = Str::random(40);
        $nonce = Str::random(40);
        $request->session()->put('state', $state);
        $request->session()->put('nonce', $nonce);

        // PKCE (RFC 7636): pair a one-time verifier with a hashed challenge so that
        // whoever exchanges the auth code later must prove they're who initiated login.
        $codeVerifier = Base64UrlSafe::encodeUnpadded(random_bytes(64));
        $codeChallenge = Base64UrlSafe::encodeUnpadded(hash('sha256', $codeVerifier, binary: true));
        $request->session()->put('code_verifier', $codeVerifier);

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
            $lang = 'en';
        } elseif (strcasecmp($requestedLocale, 'fr') == 0) {
            $lang = 'fr';
        } else {
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
            'lang' => $lang,
            'code_challenge' => $codeChallenge,
            'code_challenge_method' => 'S256',
        ]);

        return redirect(config('oauth.authorize_uri').'?'.$query);
    }

    public function authCallback(Request $request)
    {
        // pull the original nonce and state from  beginning to compare with returned values
        $state = $request->session()->pull('state');
        $nonce = $request->session()->pull('nonce');
        $codeVerifier = $request->session()->pull('code_verifier');

        // Session state does not match or is empty, do not login.
        if (! (strlen($state) > 0 && $state === $request->state)) {
            return redirect(config('oauth.logged_out_redirect').'?'.http_build_query(['logout_reason' => 'invalid-session']));

        }

        $tokenPayload = [
            'grant_type' => 'authorization_code',
            'client_id' => config('oauth.client_id'),
            'client_secret' => config('oauth.client_secret'),
            'redirect_uri' => config('oauth.redirect_uri'),
            'code' => $request->code,
            'code_verifier' => $codeVerifier,
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

        // read the claims without verifying the signature - the token came straight from the provider's token endpoint
        $idToken = (new Parser(new JoseEncoder()))->parse($encodedIdToken);
        assert($idToken instanceof UnencryptedToken);

        // grab the tokenNonce out of the unencrypted thing and compare to original nonce, and throw_unless if mismatch
        $tokenNonce = $idToken->claims()->get('nonce');
        throw_unless(
            strlen($tokenNonce) > 0 && $tokenNonce === $nonce,
            new InvalidArgumentException('Invalid session nonce')
        );

        $newUserCreated = $this->userClaimsService->applyClaims($idToken->claims()->all());

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

        // POST body only - GET query-param support was removed in #17832 so refresh tokens don't end up in URL/access logs
        $refreshToken = $request->post('refresh_token');
        if (! is_string($refreshToken) || $refreshToken === '') {
            return response('Failed to get token', 400);
        }

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
