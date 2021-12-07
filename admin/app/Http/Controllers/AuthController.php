<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Http;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $state = Str::random(40);
        $request->session()->put('state', $state = Str::random(40));

        $query = http_build_query([
            'client_id' => config('oauth.client_id'),
            'redirect_uri' => config('oauth.redirct_uri'),
            'response_type' => 'code',
            'scope' => 'openid',
            'state' => $state,
        ]);

        return redirect(config('oauth.authorize_uri') . '?' . $query);
    }

    public function authCallback(Request $request)
    {
        $state = $request->session()->pull('state');

        throw_unless(
            strlen($state) > 0 && $state === $request->state,
            InvalidArgumentException::class
        );

        $response = Http::asForm()->post(config('oauth.token_uri'), [
            'grant_type' => 'authorization_code',
            'client_id' => config('oauth.client_id'),
            'client_secret' => config('oauth.client_secret'),
            'redirect_uri' => config('oauth.redirct_uri'),
            'code' => $request->code,
        ]);
        $query = http_build_query($response->json());
        return redirect(config('app.url') . '?' . $query);
    }
}
