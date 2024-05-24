<?php

use App\Http\Controllers\SupportController;
use App\Http\Controllers\UserGeneratedFilesController;
use App\Http\Requests\EmailVerificationRequest;
use App\Http\Requests\WorkEmailVerificationRequest;
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

Route::prefix('verification')->group(function () {

    Route::get('/email/{id}/{hash}', function (EmailVerificationRequest $request) {
        $request->fulfill();

        return redirect('/home');
    })->name('verification.verify_email');

    Route::get('/work-email/{id}/{hash}', function (WorkEmailVerificationRequest $request) {
        $request->fulfill();

        return redirect('/home');
    })->name('verification.verify_work_email');
})->middleware(['signed']);
