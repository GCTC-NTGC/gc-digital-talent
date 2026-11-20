<?php

namespace App\Redis;

use Clue\React\Redis\Client;
use Laravel\Reverb\Servers\Reverb\Publishing\RedisClientFactory;
use React\EventLoop\LoopInterface;
use React\Promise\PromiseInterface;
use Throwable;

use function React\Promise\reject;

/* Reverb's Redis client factory, logging in with the app's managed identity. */
class ManagedIdentityReverbClientFactory extends RedisClientFactory
{
    public function __construct(protected ManagedIdentityCredentials $credentials) {}

    /* Reverb calls this on every connect and reconnect, so a reconnect picks up a fresh token. */
    public function make(LoopInterface $loop, string $redisUrl): PromiseInterface
    {
        try {
            $credentials = $this->credentials->get();
        } catch (Throwable $e) {
            // rejecting lets Reverb log it and retry, instead of the exception stopping the event loop
            return reject($e);
        }

        // clue/redis-react only sends AUTH <password>, Entra needs AUTH <username> <password>
        // (Redis commands are sent through Client::__call)
        return parent::make($loop, $redisUrl)->then(
            fn (Client $client) => $client->auth($credentials['username'], $credentials['password'])->then( // @phpstan-ignore method.notFound
                fn () => $client,
                function (Throwable $e) use ($client) {
                    $client->close();
                    throw $e;
                },
            ),
        );
    }
}
