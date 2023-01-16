<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SupportController;

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

Route::get('/test-notify', function () {
    try {
        Notify::sendEmail(
            'email@domain.com', // Replace with the email you gave to @esizer
            'c386053b-e65c-477e-8f09-da19c2e9dea0',
            [
                'name' => 'Eric Sizer'
            ]
        );
    } catch (\Exception $e) {
        echo $e->getMessage();
    }

});
