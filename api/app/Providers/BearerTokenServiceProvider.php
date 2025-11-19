<?php

namespace App\Providers;

use App\Services\OpenIdBearerTokenService;
use Illuminate\Support\ServiceProvider;
use Psr\Clock\ClockInterface;

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
                $this->app->make(ClockInterface::class),
                config('oauth.allowable_clock_skew')
            );
        });
    }
}
