<?php

namespace App\Providers;

use App\Contracts\BearerTokenService;
use App\Contracts\LoginProvider;
use App\Services\DummyBearerTokenService;
use App\Services\DummyLoginProvider;
use App\Services\OpenidBearerTokenService;
use App\Services\OpenidLoginProvider;
use App\Services\TestBearerTokenService;
use Illuminate\Support\ServiceProvider;
use Psr\Clock\ClockInterface;

class LoginProviderServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        if (config('auth.login_provider') === 'dummy') {
            // Refuse to boot anywhere that looks like production. Dummy auth lets anyone act as any user.
            if (config('app.vertical') === 'production') {
                throw new \RuntimeException('AUTH_PROVIDER=dummy cannot be used when APP_ENV_VERTICAL=production');
            }
            if (filled(config('oauth.client_id')) || filled(config('oauth.client_secret'))) {
                throw new \RuntimeException('AUTH_PROVIDER=dummy cannot be used while OAUTH_API_CLIENT_ID or OAUTH_API_CLIENT_SECRET is set');
            }

            $this->app->singleton(DummyBearerTokenService::class);
            $this->app->singleton(BearerTokenService::class, DummyBearerTokenService::class);
            $this->app->bind(LoginProvider::class, DummyLoginProvider::class);

            return;
        }

        $this->app->bind(LoginProvider::class, OpenidLoginProvider::class);

        $this->app->singleton(BearerTokenService::class, function () {
            $clock = $this->app->make(ClockInterface::class);

            $realService = new OpenidBearerTokenService(
                config('oauth.server_root').'/.well-known/openid-configuration',
                $clock,
                config('oauth.allowable_clock_skew')
            );

            // When TESTING_TOKEN_ENABLED=true and APP_ENV_VERTICAL != production, wrap the
            // real service so test tokens are validated locally while real tokens
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
