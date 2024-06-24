<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Server Root
    |--------------------------------------------------------------------------
    |
    | This value is the root path of the authentication server.  If set
    | then the bearer token service provider assumes it will be able to find
    | the relative path ./.well-known/openid-configuration and use that for
    | further configuration.  Should not end in a trailing slash.
    |
    */
    'server_root' => env('AUTH_SERVER_ROOT'),

    /*
    |--------------------------------------------------------------------------
    | Server Issuer
    |--------------------------------------------------------------------------
    |
    | If the server root configuration is not provided then this will be used
    | as the server issuer value to validate tokens.
    | https://datatracker.ietf.org/doc/html/rfc7519#section-4.1.1
    |
    */
    'server_iss' => env('AUTH_SERVER_ISS'),

    /*
    |--------------------------------------------------------------------------
    | Server Public Key
    |--------------------------------------------------------------------------
    |
    | If the server root configuration is not provided then this will be used
    | as the server public key to validate tokens.
    |
    */
    'server_public_key' => env('AUTH_SERVER_PUBLIC_KEY'),

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
    'allowable_clock_skew' => DateInterval::createFromDateString('4 minutes'),

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
    'authorize_uri' => env('OAUTH_URI', null),
    'token_uri' => env('OAUTH_TOKEN_URI', null),
    'redirect_uri' => env('OAUTH_REDIRECT_URI', config('app.url').'/auth-callback'),

    /**
     * When this request parameter is present, the authorization endpoint implementation should satisfy one of them in authenticating the end-user.
     * gckeymfa for MFA on (production)
     * gckey for MFA off (for testing purposes on local, dev, or uat: cannot be overridden in production)
     */
    'acr_values' => env('OAUTH_ACR_VALUES', 'gckeymfa'),

    /**
     * This server's client id and secret, known to the OAuth server.
     */
    'client_id' => env('OAUTH_API_CLIENT_ID', ''),
    'client_secret' => env('OAUTH_API_CLIENT_SECRET', ''),

    /**
     * Where is the user redirected to after login if it is not in the login request.
     */
    'post_login_redirect' => env('OAUTH_POST_LOGIN_REDIRECT'),
    'dev_post_login_redirect' => env('DEV_OAUTH_POST_LOGIN_REDIRECT'),

    /**
     * How many times should requests to the OAUTH server be retried when there are errors
     */
    'request_retries' => env('OAUTH_REQUEST_RETRIES', 3),
];
