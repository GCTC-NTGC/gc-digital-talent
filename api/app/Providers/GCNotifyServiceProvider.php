<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Alphagov\Notifications\Client;
use GuzzleHttp\Client as GuzzleClient;

class GCNotifyServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {

        $this->app->singleton('gcnotify', function ($app) {
            $config = config('services.gcnotify');
            $config = array_merge($config, [
                'httpClient' => new GuzzleClient
            ]);

            return new Client($config);
        });
    }

    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }
}
