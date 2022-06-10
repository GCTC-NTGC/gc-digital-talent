<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Services\OpenIdConfigurationService;

class OpenIdConfigurationServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(OpenIdConfigurationService::class, function () {
            $configUri = config('oauth.config_endpoint');
            return new OpenIdConfigurationService($configUri);
        });
    }

}
