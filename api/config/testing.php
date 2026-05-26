<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Testing Token Enabled
    |--------------------------------------------------------------------------
    |
    | When true, a /testing/token endpoint is registered that issues JWTs
    | signed with the local test key — bypassing GCKey entirely.
    |
    | Must be unset or false in production. The code also hard-blocks execution
    | when APP_ENV=production regardless of this flag.
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
