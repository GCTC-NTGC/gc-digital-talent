<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| GraphQL Routes
|--------------------------------------------------------------------------
|
| This is where the routes that execute GraphQL queries are registered.
|
*/

/*
 * Beware that middleware defined here runs before the GraphQL execution phase,
 * make sure to return spec-compliant responses in case an error is thrown.
 */
Route::middleware([
    // Ensures the request is not vulnerable to cross-site request forgery.
    // Nuwave\Lighthouse\Http\Middleware\EnsureXHR::class,

    // Always set the `Accept: application/json` header.
    Nuwave\Lighthouse\Http\Middleware\AcceptJson::class,

    // Logs in a user if they are authenticated. In contrast to Laravel's 'auth'
    // middleware, this delegates auth and permission checks to the field level.
    Nuwave\Lighthouse\Http\Middleware\AttemptAuthentication::class,

    // Logs every incoming GraphQL query.
    // Nuwave\Lighthouse\Http\Middleware\LogGraphQLQueries::class,

    // Logs incoming GraphQL queries made by an admin
    App\Http\Middleware\AuditQueryMiddleware::class,

    // Logs slow running GraphQL queries
    App\Http\Middleware\SlowQueryLoggerMiddleware::class,

    // Set the app locale
    App\Http\Middleware\AcceptLanguageMiddleware::class,
])->group(function () {
    // regular access to the graphql controller
    Route::post('/graphql', Nuwave\Lighthouse\Http\GraphQLController::class)
        ->name('graphql');

    // "privileged" access to the graphql controller through a protected path
    Route::post('/admin/graphql', Nuwave\Lighthouse\Http\GraphQLController::class)
        ->name('graphql-protected');
});
