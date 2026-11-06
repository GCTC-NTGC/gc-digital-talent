<?php

namespace App\Services;

use App\Contracts\LoginProvider;
use App\Support\LogUtil;
use App\ValueObjects\LoginResult;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\Response;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use InvalidArgumentException;
use Jose\Component\Core\Util\Base64UrlSafe;
use Lcobucci\JWT\Encoding\JoseEncoder;
use Lcobucci\JWT\Token\Parser;
use Lcobucci\JWT\UnencryptedToken;
use Symfony\Component\HttpFoundation\Response as HttpResponse;
use Throwable;

/**
 * Logs users in through an OpenID Connect provider using the authorization code flow with PKCE.
 */
class OpenidLoginProvider implements LoginProvider
{
    public function startLogin(Request $request): HttpResponse
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

    public function finishLogin(Request $request): LoginResult
    {
        // pull the original nonce and state from  beginning to compare with returned values
        $state = $request->session()->pull('state');
        $nonce = $request->session()->pull('nonce');
        $codeVerifier = $request->session()->pull('code_verifier');

        // Session state does not match or is empty, do not login.
        if (! (strlen($state) > 0 && $state === $request->state)) {
            throw new HttpResponseException(redirect(config('oauth.logged_out_redirect').'?'.http_build_query(['logout_reason' => 'invalid-session'])));
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

            throw new HttpResponseException(response('Failed to get token', 400));
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

        return new LoginResult($idToken->claims()->all(), $tokenResponse->json());
    }

    public function refresh(string $refreshToken): ?array
    {
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

            return null;
        }

        return $response->json();
    }
}
