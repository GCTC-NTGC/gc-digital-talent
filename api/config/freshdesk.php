<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Freshdesk
    |--------------------------------------------------------------------------
    |
    | Obtaining a domain requires creating a Freshdesk account.
    | REF: https://www.freshworks.com/freshdesk/signup/
    |
    | Developer documentation
    | REF: https://developers.freshdesk.com/api/#getting-started
    |
    */
    'api' => [
        /*
        |--------------------------------------------------------------------------
        | Freshdesk tickets endpoint
        |--------------------------------------------------------------------------
        |
        | Example: "https://domain.freshdesk.com/api/v2"
        |
        */
        'endpoint' => env('FRESHDESK_API_ENDPOINT'),
        /*
        |--------------------------------------------------------------------------
        | Freshdesk
        |--------------------------------------------------------------------------
        |
        | Finding API key
        | REF: https://support.freshdesk.com/en/support/solutions/articles/215517-how-to-find-your-api-key
        |
        | Example: "abcdefghij1234567890"
        |
        */
        'key' => env('FRESHDESK_API_KEY'),
        /*
        |--------------------------------------------------------------------------
        | Freshdesk
        |--------------------------------------------------------------------------
        |
        | This should be left empty unless testing a production account in which case
        | the string "test" should be set.
        |
        | Example: "test"
        |
        */
        'ticket_tag' => env('FRESHDESK_API_TICKET_TAG'),
        /*
        |--------------------------------------------------------------------------
        | Freshdesk
        |--------------------------------------------------------------------------
        |
        | This can be left empty unless the Freshdesk account filters tickets
        | based on a list of products (GC Digital Talent being a product).
        |
        | Example: 1234567890
        |
        */
        'product_id' => env('FRESHDESK_API_PRODUCT_ID'),
    ],
];
