<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Email verifications
    |--------------------------------------------------------------------------
    |
    | A feature to ensure pools can only be applied to by applicants
    | with a verified email. If it is an internal job, only applicants with a
    | verified work email can apply (both emails are verified if work email is set to verified).
    |
    */

    'application_email_verification' => (bool) env('FEATURE_APPLICATION_EMAIL_VERIFICATION', false),
];
