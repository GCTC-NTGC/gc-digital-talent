<?php

namespace App\Providers;

use App\Contracts\BearerTokenService;
use App\Services\CanadaLoginBearerTokenService;
use App\Services\SignInCanadaBearerTokenService;
use Illuminate\Support\ServiceProvider;
use Psr\Clock\ClockInterface;

class BearerTokenServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(BearerTokenService::class, function () {

            // for Sign In Canada, use the older service
            if (config('oauth.server_root') == 'https://te-auth.id.tbs-sct.gc.ca/oxauth' || config('oauth.server_root') == 'https://auth.id.canada.ca/oxauth') {
                return new SignInCanadaBearerTokenService(
                    config('oauth.server_root').'/.well-known/openid-configuration',
                    $this->app->make(ClockInterface::class),
                    config('oauth.allowable_clock_skew')
                );
            }

            // otherwise, use the new service
            return new CanadaLoginBearerTokenService(
                config('oauth.server_root').'/.well-known/openid-configuration',
                $this->app->make(ClockInterface::class),
                config('oauth.allowable_clock_skew')
            );
        });
    }
}
