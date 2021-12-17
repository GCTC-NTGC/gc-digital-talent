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

$router->group([
    'prefix' => 'en',
], function() use ($router) {
    $router->get('/', 'TalentSearchController@index');
});

$router->group([
    'prefix' => 'en',
], function() use ($router) {
    $router->get('/{any:.*}', 'TalentSearchController@index');
});

$router->group([
    'prefix' => 'fr',
], function() use ($router) {
    $router->get('/', 'TalentSearchController@index');
});

$router->group([
    'prefix' => 'fr',
], function() use ($router) {
    $router->get('/{any:.*}', 'TalentSearchController@index');
});

$router->get('/', function() {
    return redirect('/en');
});

$router->get('/{any:.*}', function($any) {
    return redirect('/en/'.$any);
});

