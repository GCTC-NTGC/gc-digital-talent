<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\TestTokenController;
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
Route::prefix(config('app.app_dir'))->group(function () {
    Route::get('/login', [AuthController::class, 'login']);
    Route::get('/register', [AuthController::class, 'login']);
    Route::get('/auth-callback', [AuthController::class, 'authCallback']);
    Route::get('/refresh', [AuthController::class, 'refresh']);
    Route::get('/sector-identifier', [AuthController::class, 'sectorIdentifier']);
});

Route::prefix('')->group(function () {
    Route::get('/login', [AuthController::class, 'login']);
    Route::get('/register', [AuthController::class, 'login']);
    Route::get('/auth-callback', [AuthController::class, 'authCallback']);
    Route::get('/refresh', [AuthController::class, 'refresh']);
    Route::get('/sector-identifier', [AuthController::class, 'sectorIdentifier']);
});

// Test-only token endpoint — only registered when TESTING_TOKEN_ENABLED=true.
// Returns a short-lived JWT for a user matched by ?role= or ?sub= without
// going through GCKey. Never available in production.
if (config('testing.token_enabled')) {
    Route::get('/testing/token', [TestTokenController::class, 'issue']);
}
