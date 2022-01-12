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
];
