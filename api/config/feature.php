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
    | Status notifications
    |--------------------------------------------------------------------------
    |
    | A feature to provide users with notifications queued whenever one of
    | their pool candidates changes status.
    |
    */

    'status_notifications' => (bool) env('FEATURE_STATUS_NOTIFICATIONS', false),
];
