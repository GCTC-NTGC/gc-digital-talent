<?php

namespace App\Providers;

use App\Reverb\ReverbLogger;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Http\Middleware\PreventRequestForgery;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Laravel\Reverb\Contracts\Logger;
use PhpOffice\PhpWord\Settings;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    public function boot()
    {
        $this->app->instance(
            Logger::class,
            new ReverbLogger(),
        );

        // https://laravel.com/docs/9.x/eloquent#configuring-eloquent-strictness
        Model::shouldBeStrict(! $this->app->isProduction());

        // https://github.com/PHPOffice/PHPWord/issues/2524#issuecomment-1847981808
        // https://phpoffice.github.io/PHPWord/usage/introduction.html#output-escaping
        Settings::setOutputEscapingEnabled(true);

        // /refresh is an OAuth token endpoint - the refresh token itself proves legitimacy,
        // same reasoning as exempting other OAuth token endpoints from CSRF checks.
        PreventRequestForgery::except(['refresh', '*/refresh']);

        // enable below for database debugging
        // DB::listen(function ($query) {
        //     Log::info(
        //         $query->toRawSql(),
        //         [
        //             'milliseconds' => $query->time,
        //         ]
        //     );
        // });

        // enable and adjust timing for logging of SQL statement times
        // DB::listen(function ($query) {
        //     if ($query->time > 20) {
        //         Log::warning('Query exceeded 20 milliseconds -', [
        //             'sql' => $query->toRawSql(),
        //             'milliseconds' => $query->time,
        //         ]);
        //     }
        // });

        // rate limiter for GC Notify API
        RateLimiter::for('gcnotify_api', fn () => Limit::perMinute(config('notify.client.max_requests_per_minute')));

        // log all events (except logging)
        // Event::listen('*', function (string $event, array $data) {
        //     if ($event != 'Illuminate\Log\Events\MessageLogged') {
        //         Log::info("An event was fired: {$event}", $data);
        //     }
        // });
    }
}
