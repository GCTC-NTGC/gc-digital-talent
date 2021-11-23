<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Services\Contracts\AuthConfigInterface;
use App\Services\OpenIdConfigService;

class AuthConfigServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register(): void
    {
        $this->app->bind(AuthConfigInterface::class, OpenIdConfigService::class);
    }
}
