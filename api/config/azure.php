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
        'cache_store' => 'file',
    ],

    /*
    |--------------------------------------------------------------------------
    | Redis
    |--------------------------------------------------------------------------
    |
    | Log in to Azure Managed Redis with the app's managed identity (Microsoft
    | Entra) instead of an access key. Only works inside a real Azure app service.
    |
    */

    'redis' => [
        'use_managed_identity' => (bool) env('REDIS_USE_MANAGED_IDENTITY', false),
    ],
];
