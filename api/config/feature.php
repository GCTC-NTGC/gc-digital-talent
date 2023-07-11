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
    | Skill library
    |--------------------------------------------------------------------------
    |
    | A feature to allow users to build a library of skills associated with
    | themselves with competency levels.
    |
    */

    'skill_library' => (bool) env('FEATURE_SKILL_LIBRARY', false),

    /*
    |--------------------------------------------------------------------------
    | Skill library
    |--------------------------------------------------------------------------
    |
    | A feature to allow users to build a library of skills associated with
    | themselves with competency levels.
    |
    */

    'status_notifications' => (bool) env('FEATURE_STATUS_NOTIFICATIONS', false),
];
