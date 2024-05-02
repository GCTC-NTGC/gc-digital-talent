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
    | Notifications
    |--------------------------------------------------------------------------
    |
    | A feature to introduce notifications (application and email)
    |
    */

    'notifications' => (bool) env('FEATURE_NOTIFICATIONS', false),

    /*
    |--------------------------------------------------------------------------
    | Protected API
    |--------------------------------------------------------------------------
    |
    | A feature to add enhanced protection for the API depending on the network path used
    |
    */

    'protectedApi' => (bool) env('FEATURE_PROTECTED_API', false),

];
