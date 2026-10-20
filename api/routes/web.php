<?php

use App\Http\Controllers\AuthController;
use App\Models\Pool;
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
    Route::post('/refresh', [AuthController::class, 'refresh']);
    Route::get('/sector-identifier', [AuthController::class, 'sectorIdentifier']);
});

Route::prefix('')->group(function () {
    Route::get('/login', [AuthController::class, 'login']);
    Route::get('/register', [AuthController::class, 'login']);
    Route::get('/auth-callback', [AuthController::class, 'authCallback']);
    Route::post('/refresh', [AuthController::class, 'refresh']);
    Route::get('/sector-identifier', [AuthController::class, 'sectorIdentifier']);
});

if (app()->environment('local')) {
    Route::get('{locale}/job/{id}', function (string $locale, string $id) {
        app()->setLocale($locale);
        $pool = Pool::find($id);

        return view('job_advertisement.index', ['pool' => $pool]);
    });
}
