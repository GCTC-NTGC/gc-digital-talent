<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Testing Token Enabled
    |--------------------------------------------------------------------------
    |
    | When true, the /refresh endpoint accepts an X-Testing-Secret header
    | and issues JWTs signed with the local test key — bypassing GCKey.
    |
    | Must be unset or false in production. The code also requires APP_ENV_VERTICAL
    | to be set to a non-production value (e.g. "uat" or "local") as a second
    | guard — accidental activation on production is blocked even if this flag
    | is mistakenly set, as long as APP_ENV_VERTICAL defaults to "production".
    |
    */
    'token_enabled' => env('TESTING_TOKEN_ENABLED', false),

    /*
    |--------------------------------------------------------------------------
    | Testing JWT Secret
    |--------------------------------------------------------------------------
    |
    | Base64-encoded 32-byte key used to sign and verify test tokens.
    | No default — app will throw if TESTING_TOKEN_ENABLED=true and this
    | is not set, preventing silent use of a guessable fallback.
    |
    | Generate: php -r "echo base64_encode(random_bytes(32));"
    |
    */
    'jwt_secret' => env('TESTING_JWT_SECRET'),

    /*
    |--------------------------------------------------------------------------
    | Testing Endpoint Secret
    |--------------------------------------------------------------------------
    |
    | Caller must pass this value as the X-Testing-Secret request header.
    | Stored in Azure Key Vault and injected into the pipeline as an env var.
    | Prevents anonymous access to the token endpoint even if its URL is known.
    |
    | Generate: php -r "echo bin2hex(random_bytes(32));"
    |
    */
    'endpoint_secret' => env('TESTING_ENDPOINT_SECRET'),
];
