<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Managed identity
    |--------------------------------------------------------------------------
    |
    | These variables are set automatically by the managed identity when
    | inside a real Azure app service.
    |
    */

    'managed_identity' => [
        'header' => env('IDENTITY_HEADER'),
        'endpoint' => env('IDENTITY_ENDPOINT'),
    ],
];
