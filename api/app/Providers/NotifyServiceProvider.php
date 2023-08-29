<?php

namespace App\Providers;

use App\Notify\Client;
use Illuminate\Support\ServiceProvider;

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
