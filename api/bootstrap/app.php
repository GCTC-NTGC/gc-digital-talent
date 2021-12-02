<?php

require_once __DIR__.'/../vendor/autoload.php';

(new Laravel\Lumen\Bootstrap\LoadEnvironmentVariables(
    dirname(__DIR__)
))->bootstrap();

date_default_timezone_set(env('APP_TIMEZONE', 'UTC'));

/*
|--------------------------------------------------------------------------
| Create The Application
|--------------------------------------------------------------------------
|
| Here we will load the environment and create the application instance
| that serves as the central piece of this framework. We'll use this
| application as an "IoC" container and router for this framework.
|
*/

$app = new Laravel\Lumen\Application(
    dirname(__DIR__)
);

$app->withFacades();

$app->withEloquent();

/*
|--------------------------------------------------------------------------
| Register Container Bindings
|--------------------------------------------------------------------------
|
| Now we will register a few bindings in the service container. We will
| register the exception handler and the console kernel. You may add
| your own bindings here if you like or you can make another file.
|
*/

$app->singleton(
    Illuminate\Contracts\Debug\ExceptionHandler::class,
    App\Exceptions\Handler::class
);

$app->singleton(
    Illuminate\Contracts\Console\Kernel::class,
    App\Console\Kernel::class
);

/*
|--------------------------------------------------------------------------
| Register Config Files
|--------------------------------------------------------------------------
|
| Now we will register the "app" configuration file. If the file exists in
| your configuration directory it will be loaded; otherwise, we'll load
| the default version. You may register other files below as needed.
|
*/

$app->configure('app');
$app->configure('appCustom');
$app->configure('trustedproxy');
$app->configure('lighthouse');
$app->configure('oauth');


/*
|--------------------------------------------------------------------------
| Register Middleware
|--------------------------------------------------------------------------
|
| Next, we will register the middleware with the application. These can
| be global middleware that run before and after each request into a
| route or middleware that'll be assigned to some specific routes.
|
*/

$app->middleware([
    App\Http\Middleware\CorsMiddleware::class
 ]);

// $app->middleware([
//     App\Http\Middleware\ExampleMiddleware::class
// ]);

// $app->routeMiddleware([
//     'auth' => App\Http\Middleware\Authenticate::class,
// ]);

/*
|--------------------------------------------------------------------------
| Register Service Providers
|--------------------------------------------------------------------------
|
| Here we will register all of the application's service providers which
| are used to bind services into the container. Service providers are
| totally optional, so you are not required to uncomment this line.
|
*/

// $app->register(App\Providers\AppServiceProvider::class);
$app->register(App\Providers\AuthServiceProvider::class);
// $app->register(App\Providers\EventServiceProvider::class);
$app->register(\Nuwave\Lighthouse\LighthouseServiceProvider::class);
$app->register(\Nuwave\Lighthouse\Auth\AuthServiceProvider::class);
$app->register(\Nuwave\Lighthouse\GlobalId\GlobalIdServiceProvider::class);
$app->register(\Nuwave\Lighthouse\OrderBy\OrderByServiceProvider::class);
$app->register(\Nuwave\Lighthouse\Pagination\PaginationServiceProvider::class);
$app->register(\Nuwave\Lighthouse\Scout\ScoutServiceProvider::class);
$app->register(\Nuwave\Lighthouse\SoftDeletes\SoftDeletesServiceProvider::class);
$app->register(\Nuwave\Lighthouse\Validation\ValidationServiceProvider::class);
$app->register(\Nuwave\Lighthouse\WhereConditions\WhereConditionsServiceProvider::class);
//$app->register(\Nuwave\Lighthouse\Tracing\TracingServiceProvider::class,);
$app->register(MLL\GraphQLPlayground\GraphQLPlaygroundServiceProvider::class);
$app->register(\Fideloper\Proxy\TrustedProxyServiceProvider::class);
$app->register(\Laravel\Tinker\TinkerServiceProvider::class);

$app->register(App\Providers\GraphQLServiceProvider::class);
$app->register(App\Providers\AuthClientServiceProvider::class);

/*
|--------------------------------------------------------------------------
| Load The Application Routes
|--------------------------------------------------------------------------
|
| Next we will include the routes file so that they can all be added to
| the application. This will provide all of the URLs the application
| can respond to, as well as the controllers that may handle them.
|
*/

$app->router->group([
    'namespace' => 'App\Http\Controllers',
], function ($router) {
    require __DIR__.'/../routes/web.php';
});

return $app;
