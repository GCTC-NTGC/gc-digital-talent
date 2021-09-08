<?php

/** @var \Laravel\Lumen\Routing\Router $router */

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/
$router->group(['prefix' => env('APP_DIR')], function () use ($router) {
    $router->get('login', 'AuthController@login');
    $router->get('auth-callback', 'AuthController@authCallback');

    $router->get('/', 'DashboardController@index');
    $router->get('/{any:.*}', 'DashboardController@index');
});
