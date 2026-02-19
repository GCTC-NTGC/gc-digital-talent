<?php

namespace App\Services;

use App\Contracts\ManagedIdentityService;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

// retrieves and caches tokens from Azure using a managed identity
class AzureManagedIdentityService implements ManagedIdentityService
{
    // contact the endpoint and request a token, hopefully cache it
    protected function getServiceValues(): array
    {
        $cacheKey = 'azure_managed_identity_values';

        if (Cache::has($cacheKey)) {
            // shortcut: use cached access token values if available
            return Cache::get($cacheKey);
        }

        $response = Http::withHeaders([
            'Secret' => config('azure.managed_identity.header'),
        ])
            ->get(config('azure.managed_identity.endpoint').'?api-version=2017-09-01&resource=https://management.azure.com/')
            ->throwUnlessStatus(200);
        assert($response instanceof Response); // type narrow away PromiseInterface

        $values = $response->json();

        // figure out when it expires so we can cache it until then
        $expiresOnStr = $values['expires_on'];
        $expiresOn = Carbon::parse($expiresOnStr);
        if ($expiresOn->isFuture()) {
            Cache::put($cacheKey, $values, $expiresOn);
        }

        return $values;
    }

    public function getAccessToken(): string
    {
        $values = $this->getServiceValues();

        return $values['access_token'];
    }
}
