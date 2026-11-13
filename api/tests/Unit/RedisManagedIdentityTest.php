<?php

namespace Tests\Unit;

use App\Contracts\ManagedIdentityService;
use App\Providers\RedisManagedIdentityProvider;
use App\Redis\ManagedIdentityCredentials;
use App\Redis\ManagedIdentityPhpRedisConnector;
use App\Redis\ManagedIdentityReverbClientFactory;
use Laravel\Reverb\Servers\Reverb\Publishing\RedisClientFactory;
use Mockery;
use ReflectionMethod;
use RuntimeException;
use Tests\TestCase;

class RedisManagedIdentityTest extends TestCase
{
    protected function jwt(array $claims): string
    {
        $encode = fn (array $part) => rtrim(strtr(base64_encode(json_encode($part)), '+/', '-_'), '=');

        return $encode(['alg' => 'none']).'.'.$encode($claims).'.signature';
    }

    protected function credentialsFor(string $token): ManagedIdentityCredentials
    {
        $identityService = Mockery::mock(ManagedIdentityService::class);
        $identityService->shouldReceive('getAccessToken')->with('https://redis.azure.com')->andReturn($token);

        return new ManagedIdentityCredentials($identityService);
    }

    public function testUsesObjectIdAsUsernameAndTokenAsPassword(): void
    {
        $token = $this->jwt(['oid' => '0a8dace4-2b4d-44fc-919a-6ec7b281c580', 'aud' => 'https://redis.azure.com']);

        $this->assertSame(
            ['username' => '0a8dace4-2b4d-44fc-919a-6ec7b281c580', 'password' => $token],
            $this->credentialsFor($token)->get(),
        );
    }

    public function testTokenWithoutObjectIdThrows(): void
    {
        $this->expectException(RuntimeException::class);
        $this->expectExceptionMessage('no oid claim');

        // the dummy identity service used outside Azure
        $this->credentialsFor('X')->get();
    }

    public function testDisabledByDefault(): void
    {
        $this->app->register(RedisManagedIdentityProvider::class, true);

        $this->assertNotInstanceOf(ManagedIdentityReverbClientFactory::class, app(RedisClientFactory::class));
        $this->assertNotInstanceOf(ManagedIdentityPhpRedisConnector::class, $this->redisConnector());
    }

    public function testEnabledSwapsLaravelAndReverbClients(): void
    {
        config(['azure.redis.use_managed_identity' => true]);
        $this->app->forgetInstance('redis');
        $this->app->register(RedisManagedIdentityProvider::class, true);

        $this->assertInstanceOf(ManagedIdentityReverbClientFactory::class, app(RedisClientFactory::class));
        $this->assertInstanceOf(ManagedIdentityPhpRedisConnector::class, $this->redisConnector());
    }

    protected function redisConnector(): object
    {
        return (new ReflectionMethod(app('redis'), 'connector'))->invoke(app('redis'));
    }
}
