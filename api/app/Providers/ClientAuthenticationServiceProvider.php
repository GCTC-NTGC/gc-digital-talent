<?php

namespace App\Providers;

use App\Contracts\ClientAuthenticationService;
use App\Services\OauthClientAuthenticationService;
use Illuminate\Support\ServiceProvider;
use Psr\Clock\ClockInterface;

class ClientAuthenticationServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(ClientAuthenticationService::class, function () {
            return new OauthClientAuthenticationService(
                config('oauth.client_auth_method'),
                config('oauth.client_id'),
                config('oauth.client_secret'),
                config('oauth.client_jwk_path'),
                $this->app->make(ClockInterface::class),
                config('oauth.client_assertion_ttl'),
            );
        });
    }
}
