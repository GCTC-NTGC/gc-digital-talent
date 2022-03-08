<?php

namespace App\Providers;

use DateTimeZone;
use Illuminate\Support\ServiceProvider;
use App\Services\Contracts\BearerTokenServiceInterface;
use App\Services\LocalAuthBearerTokenService;
use App\Services\OpenIdBearerTokenService;
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

        if(config('oauth.server_root'))
            $this->app->singleton(BearerTokenServiceInterface::class, function () use ($systemClock) {
                return new OpenIdBearerTokenService(
                    config('oauth.server_root').'/.well-known/openid-configuration',
                    $systemClock,
                    config('oauth.allowable_clock_skew')
                );
            });
        else
            $this->app->singleton(BearerTokenServiceInterface::class, function () use ($systemClock) {
                return new LocalAuthBearerTokenService(
                    config('oauth.server_iss'),
                    config('oauth.server_public_key'),
                    $systemClock,
                    config('oauth.allowable_clock_skew')
                );
            });
    }
}
