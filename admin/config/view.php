<?php

return [

    /*
    |--------------------------------------------------------------------------
    | View Storage Paths
    |--------------------------------------------------------------------------
    |
    | Most templating systems load templates from disk. Here you may specify
    | an array of paths that should be checked for your views. Of course
    | the usual Laravel view path has already been registered for you.
    |
    */

    'paths' => [
        resource_path('views'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Compiled View Path
    |--------------------------------------------------------------------------
    |
    | This option determines where all the compiled Blade templates will be
    | stored for your application. Typically, this is within the storage
    | directory. However, as usual, you are free to change this value.
    |
    */

    // A somewhat hacky solution to enable deploying the app in a read-only directory
    'compiled' =>
        env('USE_TMP_STORAGE', false)
        ? '/tmp/admin/storage/framework/views'
        : env(
            'VIEW_COMPILED_PATH',
            realpath(storage_path('framework/views'))
        ),

];
