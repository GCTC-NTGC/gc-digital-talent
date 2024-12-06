<?php

use App\Http\Controllers\CspReportController;
use App\Http\Controllers\SupportController;
use App\Http\Controllers\UserGeneratedFilesController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
Route::prefix('support')->controller(SupportController::class)->group(function () {
    Route::post('/tickets', 'createTicket');
});

Route::prefix('user-generated-files')
    ->controller(UserGeneratedFilesController::class)->group(function () {
        Route::get('/{fileName}', 'getFile')
        // api/config/auth.php
            ->middleware('auth:api');
    });

Route::post('csp-report', [CspReportController::class, 'report']);
