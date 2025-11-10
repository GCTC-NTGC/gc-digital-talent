<?php

namespace App\Providers;

use App\Services\OpenIdBearerTokenService;
use App\Utilities\CarbonClock;
use Illuminate\Support\ServiceProvider;

class BearerTokenServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(OpenIdBearerTokenService::class, function () {
            return new OpenIdBearerTokenService(
                config('oauth.server_root').'/.well-known/openid-configuration',
                new CarbonClock(),
                config('oauth.allowable_clock_skew')
            );
        });
    }
}
