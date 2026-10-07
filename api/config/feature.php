<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Feature flags
    |--------------------------------------------------------------------------
    |
    | Toggles for turning features on and off. Each flag is read from a
    | FEATURE_* environment variable and defaults to off (false) when unset.
    | Access a flag with config('feature.<flag_name>').
    |
    */

    'auth_in_app_migration' => (bool) env('FEATURE_AUTH_IN_APP_MIGRATION', false),
    'disable_cl_migration' => (bool) env('FEATURE_DISABLE_CL_MIGRATION', false),
];
