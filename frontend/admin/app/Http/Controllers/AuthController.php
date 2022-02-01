<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Http;
use InvalidArgumentException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $state = Str::random(40);
        $request->session()->put('state', $state = Str::random(40));

        $request->session()->put('from',
            isset($_GET['from'])
            ? $_GET['from']
            : null
        );

        $scope = 'openid';
        // Laravel auth server will error out if you request offline_access scope
        if(config('oauth.authorize_uri') != 'http://localhost:8000/oauth/authorize')
            $scope = $scope . ' offline_access';

        $query = http_build_query([
            'client_id' => config('oauth.client_id'),
            'redirect_uri' => config('oauth.redirect_uri'),
            'response_type' => 'code',
            'scope' => $scope,
            'state' => $state,
            'acr_values' => 'mfa',
        ]);

        return redirect(config('oauth.authorize_uri') . '?' . $query);
    }

    public function authCallback(Request $request)
    {
        $state = $request->session()->pull('state');

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
        $query = http_build_query($response->json());

        $from = $request->session()->pull('from');

        if($from != filter_var($from, FILTER_SANITIZE_URL))
            $from = null; // Contains unsanitary characters. Throw it away.
        if(substr($from, 0, 1) != '/')
            $from = null; // Does not start with / so it's not a relative url. Don't want an open redirect vulnerability. Throw it away.

        $navigateToUri = strlen($from) > 0 ? $from : config('app.url');
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
