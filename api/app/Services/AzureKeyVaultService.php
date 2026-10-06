<?php

namespace App\Services;

use App\Contracts\KeyService;
use App\Contracts\ManagedIdentityService;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Jose\Component\Core\JWK;
use RuntimeException;
use Throwable;

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
        $this->vaultBaseUrl = config('keys.azure.vault_base_url');
    }

    /**
     * List keys in the specified vault.
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

    /**
     * Gets the public part of a stored key.
     *
     * @see https://learn.microsoft.com/en-us/rest/api/keyvault/keys/get-key/get-key?view=rest-keyvault-keys-2025-07-01&tabs=HTTP
     */
    private function getKey(string $keyName): array
    {
        $sampleResponse = <<<'JSON'
        {
  "key": {
    "kid": "https://myvault.vault.azure.net/keys/CreateSoftKeyTest/78deebed173b48e48f55abf87ed4cf71",
    "kty": "RSA",
    "key_ops": [
      "encrypt",
      "decrypt",
      "sign",
      "verify",
      "wrapKey",
      "unwrapKey"
    ],
    "n": "2HJAE5fU3Cw2Rt9hEuq-F6XjINKGa-zskfISVqopqUy60GOs2eyhxbWbJBeUXNor_gf-tXtNeuqeBgitLeVa640UDvnEjYTKWjCniTxZRaU7ewY8BfTSk-7KxoDdLsPSpX_MX4rwlAx-_1UGk5t4sQgTbm9T6Fm2oqFd37dsz5-Gj27UP2GTAShfJPFD7MqU_zIgOI0pfqsbNL5xTQVM29K6rX4jSPtylZV3uWJtkoQIQnrIHhk1d0SC0KwlBV3V7R_LVYjiXLyIXsFzSNYgQ68ZjAwt8iL7I8Osa-ehQLM13DVvLASaf7Jnu3sC3CWl3Gyirgded6cfMmswJzY87w",
    "e": "AQAB"
  },
  "attributes": {
    "enabled": true,
    "created": 1493942451,
    "updated": 1493942451,
    "recoveryLevel": "Recoverable+Purgeable"
  },
  "tags": {
    "purpose": "unit test",
    "test name ": "CreateGetDeleteKeyTest"
  }
}
JSON;

        return json_decode($sampleResponse, true)['key'];
    }

    public function getEncryptionKeyPublicJwk(): ?JWK
    {
        try {
            $keyName = config('keys.azure.encryption_key_name', '');
            throw_unless(strlen($keyName) > 0, new RuntimeException('Missing Azure encryption key name'));
            $key = $this->getKey($keyName);
            $jwk = new JWK($key);

            return $jwk->toPublic();
        } catch (Throwable $e) {
            Log::error('Failed to get the encryption key from Azure', [
                'message' => $e->getMessage(),
            ]);
        }

        return null;
    }

    public function getSigningKeyPublicJwk(): ?JWK
    {
        try {
            $keyName = config('keys.azure.encryption_key_name', '');
            throw_unless(strlen($keyName) > 0, new RuntimeException('Missing Azure signing key name'));
            $key = $this->getKey($keyName);
            $jwk = new JWK($key);

            return $jwk->toPublic();
        } catch (Throwable $e) {
            Log::error('Failed to get the signing key from Azure', [
                'message' => $e->getMessage(),
            ]);
        }

        return null;
    }
}
