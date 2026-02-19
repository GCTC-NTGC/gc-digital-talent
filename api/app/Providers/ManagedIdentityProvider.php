<?php

namespace App\Providers;

use App\Contracts\ManagedIdentityService;
use App\Services\AzureManagedIdentityService;
use App\Services\DummyManagedIdentityService;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Support\ServiceProvider;

class ManagedIdentityProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(ManagedIdentityService::class, function (Application $app) {

            // this service only works when run inside a real Azure app service
            if (config('app.env') == 'production') {
                return new AzureManagedIdentityService();
            }

            // otherwise, run the dummy version
            return new DummyManagedIdentityService();

        });
    }
}
