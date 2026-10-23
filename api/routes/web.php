<?php

use App\Http\Controllers\DummyAuthController;
use App\Http\Controllers\OpenidAuthController;
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
$authRoutes = function () {
    // the provider is fixed when routes load, so switching AUTH_PROVIDER needs a route cache rebuild
    if (config('auth.login_provider') === 'dummy') {
        Route::get('/login', [DummyAuthController::class, 'getLogin']);
        Route::get('/register', [DummyAuthController::class, 'getLogin']);
        Route::post('/login', [DummyAuthController::class, 'postLogin']);
        Route::post('/refresh', [DummyAuthController::class, 'refresh']);
    } else {
        Route::get('/login', [OpenidAuthController::class, 'login']);
        Route::get('/register', [OpenidAuthController::class, 'login']);
        Route::get('/auth-callback', [OpenidAuthController::class, 'authCallback']);
        Route::post('/refresh', [OpenidAuthController::class, 'refresh']);
    }
    Route::get('/sector-identifier', [OpenidAuthController::class, 'sectorIdentifier']);
};

Route::prefix(config('app.app_dir'))->group($authRoutes);

Route::prefix('')->group($authRoutes);

if (app()->environment('local')) {
    Route::get('{locale}/job/{id}', function (string $locale, string $id) {
        app()->setLocale($locale);
        $pool = Pool::with(['poolSkills.skill'])->find($id);

        return view('job_advertisement.index', ['pool' => $pool]);
    });
}
