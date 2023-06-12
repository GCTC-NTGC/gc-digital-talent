<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Applicant Dashboard
    |--------------------------------------------------------------------------
    |
    | A new landing page for applicants after logging in showing their
    | information at a glance.
    |
    */

    'applicant_dashboard' => (bool) env('FEATURE_APPLICANT_DASHBOARD', false),

    /*
    |--------------------------------------------------------------------------
    | Application Revamp
    |--------------------------------------------------------------------------
    |
    | AKA Application V6, AKA New Application Flow.  A wizard-style application
    | process.
    |
    */

    'application_revamp' => (bool) env('FEATURE_APPLICATION_REVAMP', false),

    /*
    |--------------------------------------------------------------------------
    | PSAC Strike
    |--------------------------------------------------------------------------
    |
    | Enable a notification disclaimer about disrupted service due to the PSAC
    | strike.
    |
    */

    'psac_strike' => (bool) env('FEATURE_PSAC_STRIKE', false),
];
