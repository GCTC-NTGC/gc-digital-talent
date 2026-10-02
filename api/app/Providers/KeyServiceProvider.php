<?php

namespace App\Providers;

use App\Contracts\KeyService;
use App\Services\AzureKeyVaultService;
use App\Services\LocalKeyService;
use Illuminate\Contracts\Support\DeferrableProvider;
use Illuminate\Support\ServiceProvider;

class KeyServiceProvider extends ServiceProvider implements DeferrableProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(KeyService::class, function () {

            return match (config('keys.default')) {
                'local' => $this->app->make(LocalKeyService::class),
                'azure' => $this->app->make(AzureKeyVaultService::class),
                default => throw new \Error('Unexpected key service: '.config('keys.default'))
            };
        });
    }

    /**
     * Get the services provided by the provider.
     *
     * @return array<int, string>
     */
    public function provides(): array
    {
        return [KeyService::class];
    }
}
