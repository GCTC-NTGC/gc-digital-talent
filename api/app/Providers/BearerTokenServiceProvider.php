<?php

namespace App\Providers;

use App\Services\OpenIdBearerTokenService;
use DateTimeZone;
use Illuminate\Support\ServiceProvider;
use Lcobucci\Clock\SystemClock;

class BearerTokenServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $systemClock = new SystemClock(new DateTimeZone(config('app.timezone')));

        $this->app->singleton(OpenIdBearerTokenService::class, function () use ($systemClock) {
            return new OpenIdBearerTokenService(
                config('oauth.server_root').'/.well-known/openid-configuration',
                $systemClock,
                config('oauth.allowable_clock_skew')
            );
        });
    }
}
