<?php

namespace App\Providers;

use App\Contracts\BearerTokenService;
use App\Services\CanadaLoginBearerTokenService;
use App\Services\SignInCanadaBearerTokenService;
use App\Services\TestBearerTokenService;
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
            $clock = $this->app->make(ClockInterface::class);

            // for Sign In Canada, use the older service
            if (config('oauth.server_root') == 'https://te-auth.id.tbs-sct.gc.ca/oxauth' || config('oauth.server_root') == 'https://auth.id.canada.ca/oxauth') {
                $realService = new SignInCanadaBearerTokenService(
                    config('oauth.server_root').'/.well-known/openid-configuration',
                    $clock,
                    config('oauth.allowable_clock_skew')
                );
            } else {
                $realService = new CanadaLoginBearerTokenService(
                    config('oauth.server_root').'/.well-known/openid-configuration',
                    $clock,
                    config('oauth.allowable_clock_skew')
                );
            }

            // When TESTING_TOKEN_ENABLED=true and APP_ENV_VERTICAL != production, wrap the
            // real service so test tokens are validated locally while real GCKey tokens
            // pass through unchanged.
            if (config('testing.token_enabled') && config('app.vertical') !== 'production') {
                $jwtSecret = config('testing.jwt_secret');
                if (! $jwtSecret) {
                    throw new \RuntimeException('TESTING_JWT_SECRET must be set when TESTING_TOKEN_ENABLED=true');
                }

                return new TestBearerTokenService($realService, $jwtSecret, $clock);
            }

            return $realService;
        });
    }
}
