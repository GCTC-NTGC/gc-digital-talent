<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Notify\Client;

class NotifyServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->singleton('notify', function ($app) {
            return new Client();
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
