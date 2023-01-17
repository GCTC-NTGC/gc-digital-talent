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
        'email' => 'c386053b-e65c-477e-8f09-da19c2e9dea0',
        'sms' => '3525f0e3-845a-4001-b456-7cb02c13c69f',

        'bulk_email' => '90fa07f5-fbe8-402e-9547-f3259159a2da',
        'bulk_sms' => 'd662aac4-08bb-4917-860f-cc9999f4648d',
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
    'replyTo' => []
];
