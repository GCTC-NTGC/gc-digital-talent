<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Config Endpoint
    |--------------------------------------------------------------------------
    |
    | This value is the root path of the authentication server.  If set
    | then the bearer token service provider assumes it will be able to find
    | the relative path ./.well-known/openid-configuration and use that for
    | further configuration.  Should not end in a trailing slash.
    |
    */
    'config_endpoint' => env('OAUTH_CONFIG_ENDPOINT'),

    /*
    |--------------------------------------------------------------------------
    | Allowable Clock Skew
    |--------------------------------------------------------------------------
    |
    | According to CATSv3, section 4.1, Deployments MUST allow between three (3)
    | and five (5) minutes of clock skew — in either direction — when interpreting
    | the exp and nbf claims in ID tokens and when enforcing security policies
    | based thereupon.
    |
    */
    'allowable_clock_skew' =>  '4 minutes',

    /*
    |--------------------------------------------------------------------------
    | Default User
    |--------------------------------------------------------------------------
    |
    | If this is set to a valid user email, then any authenticated request will be treated as this user.
    | THIS SHOULD BE NULL IN PRODUCTION!
    |
    */
    'default_user' => env('AUTH_DEFAULT_USER', null),

    /**
     * The urls of the OAuth server we connect to for authentication.
     */
    'redirect_uri' => env('OAUTH_REDIRECT_URI', config('app.url') . '/auth-callback'),

    /**
     * This server's client id and secret, known to the OAuth server.
     */
    'client_id' => env('OAUTH_API_CLIENT_ID', ''),
    'client_secret' => env('OAUTH_API_CLIENT_SECRET', ''),

    /**
     * Where is the user redirected to after login if it is not in the login request.
     */
    'post_login_redirect' => env('OAUTH_POST_LOGIN_REDIRECT'),
];
