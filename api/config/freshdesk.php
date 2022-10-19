<?php
return [
    'api' => [
        'tickets_endpoint' => env('FRESHDESK_API_TICKETS_ENDPOINT', ''),
        'key' => env('FRESHDESK_API_KEY', ''),
        'ticket_tag' => env('FRESHDESK_API_TICKET_TAG', ''),
    ]
];
