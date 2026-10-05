<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Default Key Provider
    |--------------------------------------------------------------------------
    |
    | This option controls the default key provider that will be used to sign
    | and encrypt. By default, the local provider is used for local development.
    |
    | Supported: "local", "azure"
    |
    */
    'provider' => env('KEY_PROVIDER', 'local'),

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
        'signing_key_path' => env('SIGNING_KEY_PATH', storage_path('app/signing_key.json')),
        'encryption_key_path' => env('ENCRYPTION_KEY_PATH', storage_path('app/encryption_key.json')),
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
        'vault_base_url' => env('AZURE_KEYVAULT_URL'),
        'signing_key_name' => env('SIGNING_KEY_NAME', 'canadalogin-signing-key'),
        'encryption_key_name' => env('ENCRYPTION_KEY_NAME', 'canadalogin-encryption-key'),
    ],

];
