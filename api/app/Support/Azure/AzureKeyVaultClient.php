<?php

namespace App\Support\Azure;

use App\Contracts\ManagedIdentityService;
use Illuminate\Support\Facades\Http;
use RuntimeException;

/**
 * Azure Key Vault Client
 *
 * Client for interacting with the Azure Key Vault API
 */
class AzureKeyVaultClient
{
    protected readonly string $baseUrl;

    /**
     * @param  ManagedIdentityService  $identityService  The service that can provide access token based on the managed identity.
     */
    public function __construct(
        protected ManagedIdentityService $identityService,
        string $vaultBaseUrl
    ) {
        throw_if(empty($vaultBaseUrl), RuntimeException::class, 'Missing Azure vault base URL');

        $this->baseUrl = rtrim($vaultBaseUrl, '/');
    }

    /**
     * Gets the public part of a stored key.
     *
     * @see https://learn.microsoft.com/en-us/rest/api/keyvault/keys/get-key/get-key?view=rest-keyvault-keys-2025-07-01&tabs=HTTP
     *
     * @return array{key: array{kid: string, kty: string, key_ops: array<string>, n: string, e:string}, attributes: array, tags: array}
     */
    public function getKey(string $keyName): array
    {
        $response = Http::withToken($this->identityService->getAccessToken('https://vault.azure.net'))
            ->withUrlParameters([
                'base' => $this->baseUrl,
                'key' => $keyName,
            ])
            ->withQueryParameters(['api-version' => '2025-07-01'])
            ->get('{+base}/keys/{key}')
            ->throwUnlessStatus(200);

        return json_decode($response, true);
    }

    /**
     * Creates a signature from a digest using the specified key.
     *
     * @see https://learn.microsoft.com/en-us/rest/api/keyvault/keys/sign/sign?view=rest-keyvault-keys-2025-07-01&tabs=HTTP
     *
     * @return array{kid: string, value: string}
     */
    public function sign(string $keyName, string $keyVersion, string $alg, string $digest): array
    {
        $response = Http::withToken($this->identityService->getAccessToken('https://vault.azure.net'))
            ->withUrlParameters([
                'base' => $this->baseUrl,
                'key' => $keyName,
                'version' => $keyVersion,
            ])
            ->withQueryParameters(['api-version' => '2025-07-01'])
            ->post(
                '{+base}/keys/{key}/{version}/sign',
                [
                    'alg' => $alg,
                    'value' => $digest,
                ]
            )
            ->throwUnlessStatus(200);

        return json_decode($response, true);

    }
}
