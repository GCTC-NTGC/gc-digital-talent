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
    // error-checked way to get the API endpoint
    protected static function getVaultBaseUrl(): string
    {
        $url = config('jose.azure.vault_base_url');
        throw_if(empty($url), RuntimeException::class, 'Missing Azure vault base URL');

        return $url;
    }

    /**
     * @param  ManagedIdentityService  $identityService  The service that can provide access token based on the managed identity.
     */
    public function __construct(
        protected ManagedIdentityService $identityService,
    ) {}

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
            ->get(self::getVaultBaseUrl().'/keys');
        // ->throwUnlessStatus(204);

        return $response->dump();
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

    /**
     * Creates a signature from a digest using the specified key.
     *
     * @see https://learn.microsoft.com/en-us/rest/api/keyvault/keys/sign/sign?view=rest-keyvault-keys-2025-07-01&tabs=HTTP
     *
     * @return array{kid: string, value: string}
     */
    public function sign(string $keyName, string $keyVersion, string $alg, string $digest): array
    {
        // POST {vaultBaseUrl}/keys/{key-name}/{key-version}/sign?api-version=2025-07-01

        $sampleResponse = <<<'JSON'
{
  "kid": "https://myvault.vault.azure.net/keys/testkey/9885aa558e8d448789683188f8c194b0",
  "value": "aKFG8NXcfTzqyR44rW42484K_zZI_T7zZuebvWuNgAoEI1gXYmxrshp42CunSmmu4oqo4-IrCikPkNIBkHXnAW2cv03Ad0UpwXhVfepK8zzDBaJPMKVGS-ZRz8CshEyGDKaLlb3J3zEkXpM3RrSEr0mdV6hndHD_mznLB5RmFui5DsKAhez4vUqajgtkgcPfCekMqeSwp6r9ItVL-gEoAohx8XMDsPedqu-7BuZcBcdayaPuBRL4wWoTDULA11P-UN_sJ5qMj3BbiRYhIlBWGR04wIGfZ3pkJjHJUpOvgH2QajdYPzUBauOCewMYbq9XkLRSzI_A7HkkDVycugSeAA"
}
JSON;

        return json_decode($sampleResponse, true);

    }
}
