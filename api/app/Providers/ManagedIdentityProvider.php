<?php

namespace App\Providers;

use App\Contracts\ManagedIdentityService;
use App\Services\AzureManagedIdentityService;
use App\Services\DummyManagedIdentityService;
use Illuminate\Contracts\Support\DeferrableProvider;
use Illuminate\Support\ServiceProvider;

class ManagedIdentityProvider extends ServiceProvider implements DeferrableProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(ManagedIdentityService::class, function () {

            // this service only works when run inside a real Azure app service
            if (config('app.env') == 'production') {
                return new AzureManagedIdentityService();
            }

            // otherwise, return a dummy version
            return new DummyManagedIdentityService();
        });
    }

    /**
     * Get the services provided by the provider.
     *
     * @return array<int, string>
     */
    public function provides(): array
    {
        return [ManagedIdentityService::class];
    }
}
