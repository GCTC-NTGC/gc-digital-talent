<?php

namespace App\Providers;

use App\Contracts\ClientAuthenticationService;
use App\Services\ClientSecretPostAuthenticationService;
use App\Services\PrivateKeyJwtAuthenticationService;
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
            return match (config('oauth.client_auth_method')) {
                'private_key_jwt' => new PrivateKeyJwtAuthenticationService(
                    config('oauth.client_id'),
                    config('oauth.client_jwk_path'),
                    $this->app->make(ClockInterface::class),
                    config('oauth.client_assertion_ttl'),
                ),
                'client_secret_post' => new ClientSecretPostAuthenticationService(
                    config('oauth.client_secret'),
                ),
                default => throw new \Error('Unexpected method: '.config('oauth.client_auth_method'))
            };
        });
    }
}
