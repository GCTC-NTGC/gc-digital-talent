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
        if(config('oauth.server_root'))
            $this->app->singleton(BearerTokenServiceInterface::class, function () {
                return new OpenIdBearerTokenService(
                    config('app.timezone'),
                    config('oauth.server_root').'/.well-known/openid-configuration'
                );
            });
        else
            $this->app->singleton(BearerTokenServiceInterface::class, function () {
                return new LocalAuthBearerTokenService(
                    config('oauth.server_iss'),
                    config('oauth.server_public_key'),
                    config('app.timezone')
                );
            });
    }
}
