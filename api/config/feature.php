<?php

return [
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

    'directive_forms' => (bool) env('FEATURE_DIRECTIVE_FORMS', false),

    /*
    |--------------------------------------------------------------------------
    | Record of decision
    |--------------------------------------------------------------------------
    |
    | A feature to introduce a multiple step assessment builder for evaluating candidates
    |
    */

    'record_of_decision' => (bool) env('FEATURE_RECORD_OF_DECISION', false),

    /*
    |--------------------------------------------------------------------------
    | Notifications
    |--------------------------------------------------------------------------
    |
    | A feature to introduce notifications (application and email)
    |
    */

    'notifications' => (bool) env('FEATURE_NOTIFICATIONS', false),
];
