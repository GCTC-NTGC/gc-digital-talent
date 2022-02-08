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
    'allowable_clock_skew' =>  DateInterval::createFromDateString('4 minutes'),
  
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
];
