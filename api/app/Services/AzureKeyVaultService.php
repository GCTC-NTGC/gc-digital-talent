<?php

namespace App\Services;

use App\Contracts\KeyService;
use App\Contracts\ManagedIdentityService;
use Exception;
use Illuminate\Support\Facades\Http;
use Jose\Component\Core\JWK;

/* Interact with an Azure key vault. */
class AzureKeyVaultService implements KeyService
{
    protected string $vaultBaseUrl;

    /**
     * @param  ManagedIdentityService  $identityService  The service that can provide access token based on the managed identity.
     */
    public function __construct(
        public ManagedIdentityService $identityService,
    ) {
        $this->vaultBaseUrl = config('keys.providers.azure.vault_base_url');
    }

    /**
     * Get a list of keys
     *
     * @see https://learn.microsoft.com/en-us/rest/api/keyvault/keys/get-keys/get-keys?view=rest-keyvault-keys-2025-07-01&tabs=HTTP
     */
    public function getKeys(): ?string
    {
        // GET {vaultBaseUrl}/keys?api-version=2025-07-01
        $response = Http::withToken($this->identityService->getAccessToken('https://vault.azure.net'))
            ->withQueryParameters(['api-version' => '2025-07-01'])
            ->get($this->vaultBaseUrl.'/keys');
        // ->throwUnlessStatus(204);

        return $response->dump();
    }

    public function getEncryptionKeyPublicJwk(): ?JWK
    {
        throw new Exception('Not implemented');
    }

    public function getSigningKeyPublicJwk(): ?JWK
    {
        throw new Exception('Not implemented');
    }
}
