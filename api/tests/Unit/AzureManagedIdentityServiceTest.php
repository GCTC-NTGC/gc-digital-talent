<?php

namespace Tests\Unit;

use App\Services\AzureManagedIdentityService;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class AzureManagedIdentityServiceTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        config([
            'azure.managed_identity.endpoint' => 'http://identity.test/msi/token',
            'azure.managed_identity.header' => 'secret-header',
            'azure.managed_identity.cache_store' => 'array',
        ]);
        Cache::store('array')->flush();
    }

    protected function resource(Request $request): string
    {
        parse_str(parse_url($request->url(), PHP_URL_QUERY), $query);

        return $query['resource'];
    }

    protected function fakeIdentityEndpoint(int $expiresOn): void
    {
        Http::fake([
            'identity.test/*' => fn (Request $request) => Http::response([
                'access_token' => 'token-for-'.$this->resource($request),
                // App Service returns this as a string
                'expires_on' => (string) $expiresOn,
            ]),
        ]);
    }

    public function testRequestsTokenForResource(): void
    {
        $this->fakeIdentityEndpoint(now()->addDay()->timestamp);

        $token = (new AzureManagedIdentityService())->getAccessToken('https://redis.azure.com');

        $this->assertSame('token-for-https://redis.azure.com', $token);
        Http::assertSent(fn (Request $request) => $request->hasHeader('X-IDENTITY-HEADER', 'secret-header')
            && $this->resource($request) === 'https://redis.azure.com');
    }

    public function testDefaultsToMonitorResource(): void
    {
        $this->fakeIdentityEndpoint(now()->addDay()->timestamp);

        $this->assertSame('token-for-https://monitor.azure.com/', (new AzureManagedIdentityService())->getAccessToken());
    }

    public function testCachesTokenPerResource(): void
    {
        $this->fakeIdentityEndpoint(now()->addDay()->timestamp);
        $service = new AzureManagedIdentityService();

        $service->getAccessToken('https://redis.azure.com');
        $service->getAccessToken('https://redis.azure.com');
        $service->getAccessToken();

        Http::assertSentCount(2);
    }

    public function testDoesNotCacheTokenAboutToExpire(): void
    {
        $this->fakeIdentityEndpoint(now()->addMinutes(2)->timestamp);
        $service = new AzureManagedIdentityService();

        $service->getAccessToken('https://redis.azure.com');
        $service->getAccessToken('https://redis.azure.com');

        Http::assertSentCount(2);
    }
}
