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
            'client_id' => env('OAUTH_CLIENT_ID'),
            'redirect_uri' => env('APP_URL').'/auth-callback',
            'response_type' => 'code',
            'scope' => 'openid',
            'state' => $state,
        ]);

        return redirect(env('OAUTH_URI').'?'.$query);
    }

    public function authCallback(Request $request)
    {
        $state = $request->session()->pull('state');

        throw_unless(
            strlen($state) > 0 && $state === $request->state,
            InvalidArgumentException::class
        );

        $response = Http::asForm()->post(env('OAUTH_TOKEN_URI'), [
            'grant_type' => 'authorization_code',
            'client_id' => env('OAUTH_CLIENT_ID'),
            'client_secret' => env('OAUTH_CLIENT_SECRET'),
            'redirect_uri' => env('APP_URL').'/auth-callback',
            'code' => $request->code,
        ]);

        $query = http_build_query($response->json());
        return redirect(env('APP_URL').'?'.$query);
    }
}
