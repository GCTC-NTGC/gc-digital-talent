<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Default JOSE Provider
    |--------------------------------------------------------------------------
    |
    | This option controls the default key provider that will be used to sign
    | and encrypt. By default, the local provider is used for local development.
    |
    | Supported: "local", "azure"
    |
    */
    'provider' => env('JOSE_PROVIDER', 'local'),

    /*
    |--------------------------------------------------------------------------
    | Local Options
    |--------------------------------------------------------------------------
    |
    | When the keys are stored locally, set the options to find them. By
    | default, stored in the 'app' storage path.  Intended for local
    | development only.
    |
    */
    'local' => [
        'signing_key_path' => env('JOSE_SIGNING_KEY_PATH', storage_path('app/signing_key.json')),
        'encryption_key_path' => env('JOSE_ENCRYPTION_KEY_PATH', storage_path('app/encryption_key.json')),
    ],

    /*
    |--------------------------------------------------------------------------
    | Azure Options
    |--------------------------------------------------------------------------
    |
    | When the keys are stored in an Azure keyvault, set the config options
    | to find them. Uses managed identities so it only works in the app
    | service itself.
    |
    */
    'azure' => [
        'vault_base_url' => env('JOSE_AZURE_KEYVAULT_URL'),
        'signing_key_name' => env('JOSE_SIGNING_KEY_NAME', 'canadalogin-signing-key'),
        'encryption_key_name' => env('JOSE_ENCRYPTION_KEY_NAME', 'canadalogin-encryption-key'),
    ],

];
