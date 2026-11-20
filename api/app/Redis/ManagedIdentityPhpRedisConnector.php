<?php

namespace App\Redis;

use Illuminate\Redis\Connectors\PhpRedisConnector;

/* phpredis connector that logs in with the app's managed identity. */
class ManagedIdentityPhpRedisConnector extends PhpRedisConnector
{
    public function __construct(protected ManagedIdentityCredentials $credentials) {}

    /* Also runs when Laravel reconnects a dropped connection, so a reconnect picks up a fresh token. */
    protected function createClient(array $config)
    {
        // phpredis would otherwise reconnect on its own, re-sending the original (possibly expired) token;
        // with no retries a dropped connection surfaces as "Connection lost" and Laravel rebuilds it through here
        return parent::createClient(array_merge($config, ['max_retries' => 0], $this->credentials->get()));
    }
}
