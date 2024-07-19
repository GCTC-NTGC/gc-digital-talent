<?php

return [
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

];
