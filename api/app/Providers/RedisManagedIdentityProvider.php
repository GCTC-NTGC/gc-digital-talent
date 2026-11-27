<?php

namespace App\Providers;

use App\Redis\ManagedIdentityPhpRedisConnector;
use App\Redis\ManagedIdentityReverbClientFactory;
use Illuminate\Redis\RedisManager;
use Illuminate\Support\ServiceProvider;
use Laravel\Reverb\Servers\Reverb\Publishing\RedisClientFactory;

/* Log in to Redis with the app's managed identity instead of an access key, for both Laravel and Reverb. */
class RedisManagedIdentityProvider extends ServiceProvider
{
    public function register(): void
    {
        if (! config('azure.redis.use_managed_identity')) {
            return;
        }

        $this->app->afterResolving('redis', function (RedisManager $redis) {
            $redis->extend('phpredis', fn () => app(ManagedIdentityPhpRedisConnector::class));
        });

        $this->app->bind(RedisClientFactory::class, ManagedIdentityReverbClientFactory::class);
    }
}
