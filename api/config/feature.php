<?php

return [
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

    /*
    |--------------------------------------------------------------------------
    | Directive forms
    |--------------------------------------------------------------------------
    |
    | A feature to provide users with the ability to view and use the directive
    | forms in the site.
    |
    */

    'status_notifications' => (bool) env('FEATURE_DIRECTIVE_FORMS', false),
];
