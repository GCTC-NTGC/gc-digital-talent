<?php

namespace App\Providers;

use DateTimeZone;
use Illuminate\Support\ServiceProvider;
use App\Services\OpenIdBearerTokenService;
use App\Services\OpenIdConfigurationService;
use Lcobucci\Clock\SystemClock;

class BearerTokenServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register(): void
    {
        $systemClock = new SystemClock(new DateTimeZone(config('app.timezone')));

        $this->app->singleton(OpenIdBearerTokenService::class, function ($app) use ($systemClock) {
            return new OpenIdBearerTokenService(
                $app->make(OpenIdConfigurationService::class),
                $systemClock,
                config('oauth.allowable_clock_skew')
            );
        });
    }
}
