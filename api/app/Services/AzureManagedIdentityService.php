<?php

namespace App\Services;

use App\Contracts\ManagedIdentityService;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Throwable;

/* Interact with an Azure managed identity service. */
class AzureManagedIdentityService implements ManagedIdentityService
{
    /* Stop using a cached token this long before it expires, so new connections don't start with one about to lapse. */
    protected const EXPIRY_MARGIN_SECONDS = 300;

    /* Retrieves identity values (from cache or Azure services) using a managed identity. */
    protected function getIdentityValues(string $resource): array
    {
        // never the default store: once that's Redis, getting the Redis token can't depend on Redis
        $cache = Cache::store(config('azure.managed_identity.cache_store'));
        $cacheKey = 'azure_managed_identity_values:'.$resource;

        $cached = $cache->get($cacheKey);
        if (is_array($cached)) {
            // shortcut: use cached access token values if available
            return $cached;
        }

        $response = Http::withHeader('X-IDENTITY-HEADER', config('azure.managed_identity.header'))
            ->withQueryParameters([
                'api-version' => '2019-08-01',
                'resource' => $resource,
            ])
            ->get(config('azure.managed_identity.endpoint'))
            ->throwUnlessStatus(200);
        assert($response instanceof Response); // type narrow away PromiseInterface

        $values = $response->json();

        // figure out when it expires so we can cache it until then (App Service returns expires_on as a numeric string)
        $expiresOn = $values['expires_on'] ?? null;
        if (is_numeric($expiresOn)) {
            $cacheUntil = Carbon::createFromTimestamp((int) $expiresOn)->subSeconds(self::EXPIRY_MARGIN_SECONDS);
            if ($cacheUntil->isFuture()) {
                try {
                    $cache->put($cacheKey, $values, $cacheUntil);
                } catch (Throwable) {
                    // e.g. a cache file created by root during deployment; the token is still valid, it just isn't cached
                }
            }
        }

        return $values;
    }

    /* Retrieve an access token from the identity service */
    public function getAccessToken(string $resource = 'https://monitor.azure.com/'): string
    {
        $values = $this->getIdentityValues($resource);

        return $values['access_token'];
    }
}
