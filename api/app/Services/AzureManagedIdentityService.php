<?php

namespace App\Services;

use App\Contracts\ManagedIdentityService;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

/* Interact with an Azure managed identity service. */
class AzureManagedIdentityService implements ManagedIdentityService
{
    /* Retrieves identity values (from cache or Azure services) using a managed identity. */
    protected function getIdentityValues(string $resource): array
    {
        $cacheKey = 'azure_managed_identity_values:'.$resource;

        if (Cache::has($cacheKey)) {
            // shortcut: use cached access token values if available
            return Cache::get($cacheKey);
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

        // figure out when it expires so we can cache it until then
        $expiresOnStr = $values['expires_on'] ?? null;
        if (is_int($expiresOnStr)) {
            $expiresOn = Carbon::createFromTimestamp($expiresOnStr);
            if ($expiresOn->isFuture()) {
                Cache::put($cacheKey, $values, $expiresOn);
            }
        }

        return $values;
    }

    /* Retrieve an access token from the identity service */
    public function getAccessToken(string $resource): string
    {
        $values = $this->getIdentityValues($resource);

        return $values['access_token'];
    }
}
