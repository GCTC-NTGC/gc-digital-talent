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
        'max_requests_per_minute' => env('GCNOTIFY_MAX_REQUESTS_PER_MINUTE', 1000),
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
        'test_email' => env('GCNOTIFY_TEMPLATE_TEST_EMAIL', ''),
        'test_sms' => env('GCNOTIFY_TEMPLATE_TEST_SMS', ''),
        'test_bulk_email' => env('GCNOTIFY_TEMPLATE_TEST_BULK_EMAIL', ''),
        'test_bulk_sms' => env('GCNOTIFY_TEMPLATE_TEST_BULK_SMS', ''),
        'application_deadline_approaching_en' => env('GCNOTIFY_TEMPLATE_APPLICATION_DEADLINE_APPROACHING_EN', ''),
        'application_deadline_approaching_fr' => env('GCNOTIFY_TEMPLATE_APPLICATION_DEADLINE_APPROACHING_FR', ''),
        'application_status_changed_en' => env('GCNOTIFY_TEMPLATE_APPLICATION_STATUS_CHANGED_EN', ''),
        'application_status_changed_fr' => env('GCNOTIFY_TEMPLATE_APPLICATION_STATUS_CHANGED_FR', ''),
        'new_job_posted_en' => env('GCNOTIFY_TEMPLATE_NEW_JOB_POSTED_EN', ''),
        'new_job_posted_fr' => env('GCNOTIFY_TEMPLATE_NEW_JOB_POSTED_FR', ''),
        'talent_request_submission_confirmation_enfr' => env('GCNOTIFY_TEMPLATE_TALENT_REQUEST_SUBMISSION_CONFIRMATION_ENFR', ''),
        'verify_email_en' => env('GCNOTIFY_TEMPLATE_VERIFY_EMAIL_EN', ''),
        'verify_email_fr' => env('GCNOTIFY_TEMPLATE_VERIFY_EMAIL_FR', ''),
        'system_notification_en' => env('GCNOTIFY_TEMPLATE_SYSTEM_NOTIFICATION_EN', ''),
        'system_notification_fr' => env('GCNOTIFY_TEMPLATE_SYSTEM_NOTIFICATION_FR', ''),
        'nomination_received_submitter_en' => env('GCNOTIFY_TEMPLATE_NOMINATION_RECEIVED_SUBMITTER_EN', ''),
        'nomination_received_submitter_fr' => env('GCNOTIFY_TEMPLATE_NOMINATION_RECEIVED_SUBMITTER_FR', ''),
        'nomination_received_nominator_en' => env('GCNOTIFY_TEMPLATE_NOMINATION_RECEIVED_NOMINATOR_EN', ''),
        'nomination_received_nominator_fr' => env('GCNOTIFY_TEMPLATE_NOMINATION_RECEIVED_NOMINATOR_FR', ''),
        'application_received_en' => env('GCNOTIFY_TEMPLATE_APPLICATION_RECEIVED_EN', ''),
        'application_received_fr' => env('GCNOTIFY_TEMPLATE_APPLICATION_RECEIVED_FR', ''),
        'application_deadline_extended_en' => env('GCNOTIFY_TEMPLATE_APPLICATION_DEADLINE_EXTENDED_EN', ''),
        'application_deadline_extended_fr' => env('GCNOTIFY_TEMPLATE_APPLICATION_DEADLINE_EXTENDED_FR', ''),
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

    /*
    |--------------------------------------------------------------------------
    | GC Notify Smoke Test
    |--------------------------------------------------------------------------
    |
    | If you need to smoke test your integration with GC Notify on a regular
    | basis, you should use the following smoke test email addresses and phone
    | numbers.
    |
    | https://documentation.notification.canada.ca/en/testing.html#smoke-testing
    |
    */
    'smokeTest' => [
        'emailAddress' => 'simulate-delivered@notification.canada.ca',
        'emailAddress2' => 'simulate-delivered-2@notification.canada.ca',
        'emailAddress3' => 'simulate-delivered-3@notification.canada.ca',
        'phoneNumber' => '+16132532222',
        'phoneNumber2' => '+16132532223',
        'phoneNumber3' => '+16132532224',
    ],
];
