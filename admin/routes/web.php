<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/
Route::prefix(config('app_dir'))->group(function () {
    Route::get('/login', 'AuthController@login');
    Route::get('/auth-callback', 'AuthController@authCallback');

    Route::get('/', 'DashboardController@index');
    Route::get('/{any:.*}', 'DashboardController@index');
});
