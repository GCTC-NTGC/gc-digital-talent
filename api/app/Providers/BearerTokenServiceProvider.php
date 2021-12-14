<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Services\Contracts\BearerTokenServiceInterface;
use App\Services\LocalAuthBearerTokenService;
use App\Services\OpenIdBearerTokenService;

class BearerTokenServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register(): void
    {
        if(env('AUTH_SERVER_ROOT'))
            $this->app->singleton(BearerTokenServiceInterface::class, function () {
                return new OpenIdBearerTokenService(
                    env('APP_TIMEZONE'),
                    env('AUTH_SERVER_ROOT').'/.well-known/openid-configuration'
                );
            });
        else
            $this->app->singleton(BearerTokenServiceInterface::class, function () {
                return new LocalAuthBearerTokenService(
                    env('AUTH_SERVER_ISS'),
                    env('AUTH_SERVER_PUBLIC_KEY'),
                    env('APP_TIMEZONE')
                );
            });
    }
}
