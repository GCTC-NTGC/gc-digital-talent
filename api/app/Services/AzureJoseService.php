<?php

namespace App\Services;

use App\Contracts\JoseService;
use App\Support\Azure\AzureKeyVaultClient;
use AzureKeyVaultRS256;
use Jose\Component\Core\AlgorithmManager;
use Jose\Component\Core\JWK;
use Jose\Component\Signature\JWSBuilder;
use Jose\Component\Signature\Serializer\CompactSerializer;
use RuntimeException;

/* Use Azure key vault to provide JOSE operations. */
class AzureJoseService implements JoseService
{
    /**
     * @param  AzureKeyVaultClient  $azureClient  The API client for the Azure key vault
     */
    public function __construct(
        protected AzureKeyVaultClient $azureClient,
    ) {}

    protected function makeJwkForConfigKey(string $configKey): JWK
    {
        $keyName = config($configKey, '');
        throw_unless(strlen($keyName) > 0, RuntimeException::class, ("Missing Azure key name for {$configKey}"));
        $key = $this->azureClient->getKey($keyName)['key'];
        $jwk = new JWK($key);

        return $jwk->toPublic();
    }

    public function getEncryptionKeyPublicJwk(): JWK
    {
        $jwk = $this->makeJwkForConfigKey('keys.azure.encryption_key_name');

        return $jwk->toPublic();
    }

    public function getSigningKeyPublicJwk(): JWK
    {
        $jwk = $this->makeJwkForConfigKey('keys.azure.signing_key_name');

        return $jwk->toPublic();
    }

    public function createSignature(array $values): string
    {
        $keyName = config('keys.azure.signing_key_name', '');
        throw_unless(strlen($keyName) > 0, new RuntimeException('Missing Azure signing key name'));
        $publicKey = $this->azureClient->getKey($keyName)['key'];
        $publicJwk = new JWK($publicKey);

        $jws = (new JWSBuilder(new AlgorithmManager([new AzureKeyVaultRS256($this->azureClient)])))
            ->create()
            ->withPayload(json_encode($values))
            ->addSignature($publicJwk, ['alg' => 'RS256', 'typ' => 'JWT', 'kid' => $publicJwk->get('kid')])
            ->build();

        return (new CompactSerializer())->serialize($jws, 0);
    }
}
