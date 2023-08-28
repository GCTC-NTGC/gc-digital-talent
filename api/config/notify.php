<?php

return [

    /*
    |--------------------------------------------------------------------------
    | GC Notify Client
    |--------------------------------------------------------------------------
    |
    | Contains configuration for the GC Notify client
    |
    */
    'client' => [
        'apiKey' => env('GCNOTIFY_API_KEY'),
    ],

    /*
    |--------------------------------------------------------------------------
    | GC Notify Templates
    |--------------------------------------------------------------------------
    |
    | Map the template IDs to a more human readable
    | configuration
    |
    */
    'templates' => [
        'test_email' => env('GCNOTIFY_TEMPLATE_TEST_EMAIL'),
        'test_sms' => env('GCNOTIFY_TEMPLATE_TEST_SMS'),
        'test_bulk_email' => env('GCNOTIFY_TEMPLATE_TEST_BULK_EMAIL'),
        'test_bulk_sms' => env('GCNOTIFY_TEMPLATE_TEST_BULK_SMS'),
    ],

    /*
    |--------------------------------------------------------------------------
    | GC Notify Reply To
    |--------------------------------------------------------------------------
    |
    | Map any reply to email address IDs to a
    | more human readable config
    |
    */
    'replyTo' => [],
];
