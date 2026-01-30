<?php

namespace App\Services;

use Exception;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
// We're using two JWT management libraries here (Jose & Lcobucci), which each
// offer different functionality related to constraints and JWKS.
// TODO: Consider consolidating into a single library, or migrating to a new
// one that does it all.
use Lcobucci\JWT\Configuration;
use Lcobucci\JWT\Signer;
use Lcobucci\JWT\Signer\Key\InMemory;
use Psr\Clock\ClockInterface;

class OpenIdBearerTokenService
{
    private ClockInterface $clock;

    private string $configUri;

    public function fastSigner(): Configuration
    {
        // replace implementations of signers with no algorithm, forUnsecuredSigner(), and dropping None
        // due to being dropped by Lcobucci, this is the recommended fast replacement
        // https://lcobucci-jwt.readthedocs.io/en/latest/upgrading/#v4x-to-v5x

        return Configuration::forSymmetricSigner(
            new Signer\Blake2b(),
            InMemory::base64Encoded('MpQd6dDPiqnzFSWmpUfLy4+Rdls90Ca4C8e0QD0IxqY=')
        );
    }

    public function __construct(string $configUri, ClockInterface $clock)
    {
        $this->clock = $clock;
        $this->configUri = $configUri;
    }

    // get a configuration property from the openid configuration json document
    private function getConfigProperty(string $propertyName): string
    {
        $jsonString = Cache::remember('openid_config_json_string', 60, function () { // only get content every minute
            $response = Http::retry(times: config('oauth.request_retries'), sleepMilliseconds: 500, when: function (Exception $exception) {
                return $exception instanceof ConnectionException;
            }, throw: false)->get($this->configUri);
            assert($response instanceof \Illuminate\Http\Client\Response);

            if ($response->failed()) {
                Log::error('Failed when GETting the OpenID configuration in getConfigProperty');
                Log::debug((string) $response->getBody());
                throw new Exception('Failed to get config');
            }

            return $response->body();
        });

        $obj = json_decode($jsonString);
        $uri = data_get($obj, $propertyName);
        if (! $uri) {
            throw new Exception('No '.$propertyName.' property found in OpenID configuration');
        }

        return $uri;
    }

    // request the introspection values (or pull from cache) and return the values
    private function getIntrospectionValues(string $accessToken): array
    {
        $cacheKey = 'introspection_token_values_'.$accessToken;

        if (Cache::has($cacheKey)) {
            // shortcut: use cached access token values if available
            return Cache::get($cacheKey);
        }

        // make api call to introspect endpoint
        $introspectionUri = $this->getConfigProperty('introspection_endpoint');
        $response = Http::retry(times: config('oauth.request_retries'), sleepMilliseconds: 500, when: function (Exception $exception) {
            return $exception instanceof ConnectionException;
        }, throw: false)->asForm()
            ->post($introspectionUri, [
                'client_id' => config('oauth.client_id'),
                'client_secret' => config('oauth.client_secret'),
                'token' => $accessToken,
            ]);
        assert($response instanceof \Illuminate\Http\Client\Response);

        if ($response->failed()) {
            Log::error('Failed when GETting the introspection verification in getIntrospectionValues ('.$response->status().') '.$response->body());
            throw new Exception('Failed to get introspection');
        }

        $values = $response->json();
        $isTokenActive = Arr::boolean($values, 'active', false);
        $expiryTimestamp = Arr::integer($values, 'exp', 0);
        $nowTimestamp = $this->clock->now()->getTimestamp();
        // only cache active token
        if ($isTokenActive && $expiryTimestamp > $nowTimestamp) {
            $cacheTime = min(10, $expiryTimestamp - $nowTimestamp); // cache for a few seconds, or up to expiry time
            Cache::put($cacheKey, $values, $cacheTime);
        }

        return $values;
    }

    // call the introspection endpoint to get the sub
    public function getSubWithIntrospection(string $accessToken): ?string
    {
        $values = $this->getIntrospectionValues($accessToken);

        if (Arr::has($values, 'sub')) {
            return Arr::string($values, 'sub');
        }

        return null;
    }
}
