<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Queue\Events\Looping;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

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
        // https://laravel.com/docs/9.x/eloquent#configuring-eloquent-strictness
        Model::shouldBeStrict(! $this->app->isProduction());

        // https://github.com/PHPOffice/PHPWord/issues/2524#issuecomment-1847981808
        // https://phpoffice.github.io/PHPWord/usage/introduction.html#output-escaping
        \PhpOffice\PhpWord\Settings::setOutputEscapingEnabled(true);

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

        Event::listen(function (Looping $_) {
            /** @var \Monolog\Logger */
            $logger = Log::channel('azure'); // ->flush();
            /** @var \Monolog\Handler\BufferHandler */
            $firstHandler = $logger->getHandlers()[0];
            $firstHandler->flush();
        });

    }
}
