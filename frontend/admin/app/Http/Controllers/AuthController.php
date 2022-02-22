<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Http;
use InvalidArgumentException;
//following the online Lcobucci documentation an attempt at parsing has been made
use Lcobucci\JWT\Configuration;
use Lcobucci\JWT\UnencryptedToken;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        //add the creation of a nonce alongside state
        $state = Str::random(40);
        $nonce = Str::random(40);
        $request->session()->put('state', $state = Str::random(40), 'nonce', $nonce = Str::random(40));

        $request->session()->put(
            'from',
            $request->input('from')
        );

        $requestedLocale = $request->input('locale');
        if(strcasecmp($requestedLocale, 'en') == 0)
            $ui_locales = 'en-CA en';
        else if(strcasecmp($requestedLocale, 'fr') == 0)
            $ui_locales = 'fr-CA fr';
        else
            $ui_locales = $requestedLocale;

        $scope = 'openid';
        // Laravel auth server will error out if you request offline_access scope
        if(config('oauth.authorize_uri') != 'http://localhost:8000/oauth/authorize')
            $scope = $scope . ' offline_access';

        //add nonce in this query
        $query = http_build_query([
            'client_id' => config('oauth.client_id'),
            'redirect_uri' => config('oauth.redirect_uri'),
            'response_type' => 'code',
            'scope' => $scope,
            'state' => $state,
            'nonce' => $nonce,
            'acr_values' => 'mfa',
            'ui_locales' => $ui_locales,
        ]);

        return redirect(config('oauth.authorize_uri') . '?' . $query);
    }

    public function authCallback(Request $request)
    {
        //pull the original nonce alongside state
        $state = $request->session()->pull('state');
        $nonce = $request->session()->pull('nonce');

        throw_unless(
            strlen($state) > 0 && $state === $request->state,
            new InvalidArgumentException("Invalid session state")
        );

        $response = Http::asForm()->post(config('oauth.token_uri'), [
            'grant_type' => 'authorization_code',
            'client_id' => config('oauth.client_id'),
            'client_secret' => config('oauth.client_secret'),
            'redirect_uri' => config('oauth.redirect_uri'),
            'code' => $request->code,
        ]);

        // decode id_token here
        // pull token out of the response, it is in 3 parts, middle part is the desired payload, split it and grab the the desire idPayload
        $idToken = $response->query('id_token');
        $idTokenSplit = explode(".", $idToken);
        $idPayload = $idTokenSplit[1];

        // following the online Lcobucci documentation, attempt to parse the token
        $config = $container->get(Configuration::class);
        assert($config instanceof Configuration);
        $token = $config->parser()->parse($idPayload);
        assert($token instanceof UnencryptedToken);

        //now, grab the tokenNonce out of the unencrypted thing, and compare to the nonce grabbed at line 59 and throw_unless

        $tokenNonce = $token->nonce;
        throw_unless(
            strlen($tokenNonce) > 0 && $tokenNonce === $nonce,
            new InvalidArgumentException("Invalid session nonce")
        );

        $query = http_build_query($response->json());

        $from = $request->session()->pull('from');

        if($from != filter_var($from, FILTER_SANITIZE_URL))
            $from = null; // Contains unsanitary characters. Throw it away.
        if(substr($from, 0, 1) != '/')
            $from = null; // Does not start with / so it's not a relative url. Don't want an open redirect vulnerability. Throw it away.

        $navigateToUri = strlen($from) > 0 ? config('app.url').$from : config('app.url').config('app.app_dir');
        return redirect($navigateToUri . '?' . $query);
    }

    public function refresh(Request $request)
    {
        $refreshToken = $request->query('refresh_token');
        $response = Http::asForm()
            ->post(config('oauth.token_uri'), [
                    'grant_type' => 'refresh_token',
                    'client_id' => config('oauth.client_id'),
                    'client_secret' => config('oauth.client_secret'),
                    'refresh_token' => $refreshToken,
                ]);
        return response($response);
    }
}
