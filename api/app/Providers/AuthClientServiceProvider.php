<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Services\OpenIdClientService;
use App\Services\Contracts\AuthClientInterface;
use App\Services\LocalAuthClientService;

class AuthClientServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register(): void
    {
        if(env('AUTH_SERVER_ROOT'))
            $this->app->bind(AuthClientInterface::class, OpenIdClientService::class);
        else
            $this->app->bind(AuthClientInterface::class, LocalAuthClientService::class);
    }
}
