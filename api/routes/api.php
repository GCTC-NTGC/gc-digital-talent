<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SupportController;
use App\Facades\Notify;
use Illuminate\Support\Facades\Storage;

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

/**
 * Note: These routes are for testing/example and should be
 * removed before merging
 */
Route::prefix('notify')->group(function () {
    $templates = config('notify.templates');

    Route::get('email', function () use ($templates) {
        try {
            $response = Notify::sendEmail(
                'domain@test.com', // Replace with your email
                $templates['email'],
                ['name' => 'Your Name']
            );

            return $response->json();
        } catch (\Exception $e) {
            echo $e->getMessage();
        }
    });

    Route::get('email/attachment', function () use ($templates) {
        try {
            $file = Storage::get('example.txt'); // Add a file by this name to `api/storage/app`
            $response = Notify::sendEmail(
                'domain@test.com', // Replace with your email
                $templates['email'],
                ['name' => 'Your Name'],
                null,
                null,
                [
                    'file' => base64_encode($file),
                    'filename' => "attachment.txt"
                ]
            );

            return $response->json();
        } catch (\Exception $e) {
            echo $e->getMessage();
        }
    });

    Route::get('sms', function () use ($templates) {
        try {
            $response = Notify::sendSms(
                '5555555555', // Replace with your phone number
                $templates['sms'],
                ['name' => 'Your Name']
            );

            return $response->json();
        } catch (\Exception $e) {
            echo $e->getMessage();
        }
    });

    Route::prefix('bulk')->group(function () use($templates) {
        Route::get('email', function () use ($templates) {
            try {
                $response = Notify::sendBulk(
                    'Test',
                    [
                        ['email address', 'name'],
                        ['email@domain.com', 'Your Name'], // Replace with your email + name
                        ['anotheremail@domain.com', 'Another Name'], // Replace with another email + name or remove
                    ],
                    $templates['bulk_email']
                );

                return $response->json();
            } catch (\Exception $e) {
                echo $e->getMessage();
            }
        });
    });
});
