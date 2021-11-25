<?php

return [
    /**
     * The urls of the OAuth server we connect to for authentication.
     */
    'authorize_uri' => env('OAUTH_URI', null),
    'token_uri' => env('OAUTH_TOKEN_URI', null),

    /**
     * This server's client id and secret, known to the OAuth server.
     */
    'client_id' => env('OAUTH_ADMIN_CLIENT_ID', ''),
    'client_secret' => env('OAUTH_ADMIN_CLIENT_SECRET', ''),
];
