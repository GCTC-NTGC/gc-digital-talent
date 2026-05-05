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

    'auth_in_app_migration' => (bool) env('FEATURE_AUTH_IN_APP_MIGRATION', false),
];
