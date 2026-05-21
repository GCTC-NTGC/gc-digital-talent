<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Testing Token Enabled
    |--------------------------------------------------------------------------
    |
    | When true, a /testing/token endpoint is registered that issues JWTs
    | signed with the local test key below — bypassing GCKey entirely.
    |
    | MUST be false (or unset) in production.
    |
    */
    'token_enabled' => env('TESTING_TOKEN_ENABLED', false),

    /*
    |--------------------------------------------------------------------------
    | Testing JWT Secret
    |--------------------------------------------------------------------------
    |
    | Base64-encoded 32-byte key used to sign and verify test tokens.
    | Tokens signed with this key are accepted only when token_enabled is true.
    |
    | Generate a new one with: base64_encode(random_bytes(32))
    |
    */
    'jwt_secret' => env('TESTING_JWT_SECRET', 'U2VjcmV0VGVzdEtleUZvclBsYXl3cmlnaHQxMjM0NTY='),
];
