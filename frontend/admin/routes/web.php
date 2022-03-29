<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\DashboardController;

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
Route::prefix(config('app.app_dir'))->group(function () {
    Route::get('/', [DashboardController::class, 'index']);
    Route::get('/{any}', [DashboardController::class, 'index'])->where('any', '.*');
});

// Repeat dashboard routes including language prefix
Route::group([
    'prefix' => '{locale}',
    'where' => ['locale' => 'en|fr'],
], function () {
    Route::prefix(config('app.app_dir'))->group(function () {
        Route::get('/', [DashboardController::class, 'index']);
        Route::get('/{any}', [DashboardController::class, 'index'])->where('any', '.*');
    });
});
