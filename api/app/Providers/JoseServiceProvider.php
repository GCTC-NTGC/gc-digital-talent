<?php

namespace App\Providers;

use App\Contracts\JoseService;
use App\Services\AzureJoseService;
use App\Services\LocalJoseService;
use Illuminate\Contracts\Support\DeferrableProvider;
use Illuminate\Support\ServiceProvider;

class JoseServiceProvider extends ServiceProvider implements DeferrableProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(JoseService::class, function () {

            return match (config('jose.provider')) {
                'local' => $this->app->make(LocalJoseService::class),
                'azure' => $this->app->make(AzureJoseService::class),
                default => throw new \Error('Unexpected JOSE service: '.config('jose.provider'))
            };
        });
    }

    /**
     * Get the services provided by the provider.
     *
     * @return array<int, string>
     */
    public function provides(): array
    {
        return [JoseService::class];
    }
}
