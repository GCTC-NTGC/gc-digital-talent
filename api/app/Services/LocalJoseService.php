<?php

namespace App\Services;

use App\Contracts\JoseService;
use Jose\Component\Core\AlgorithmManager;
use Jose\Component\Core\JWK;
use Jose\Component\Signature\Algorithm\RS256;
use Jose\Component\Signature\JWSBuilder;
use Jose\Component\Signature\Serializer\CompactSerializer;
use RuntimeException;

/* Use local key files to provide JOSE operations. */
class LocalJoseService implements JoseService
{
    /* Get a list of keys */
    public function getKeys(): ?string
    {
        return 'hello world';
    }

    protected static function makeJwkForConfigKey(string $configKey): JWK
    {
        $path = config($configKey, '');
        throw_unless(file_exists($path), RuntimeException::class, "No key file found for {$configKey}");

        return JWK::createFromJson(file_get_contents($path));
    }

    public function getEncryptionKeyPublicJwk(): JWK
    {
        return self::makeJwkForConfigKey('keys.local.encryption_key_path')->toPublic();

    }

    public function getSigningKeyPublicJwk(): JWK
    {
        return self::makeJwkForConfigKey('keys.local.signing_key_path')->toPublic();
    }

    public function createSignature(array $values): string
    {
        $algorithmManager = new AlgorithmManager([new RS256()]);
        $jwsBuilder = new JWSBuilder($algorithmManager);
        $jwk = self::makeJwkForConfigKey('keys.local.signing_key_path');

        $jws = $jwsBuilder->create()
            ->withPayload(json_encode($values))
            ->addSignature($jwk, [
                'alg' => 'RS256',
                'typ' => 'JWT',
                'kid' => $jwk->get('kid'),
            ])
            ->build();

        return (new CompactSerializer())->serialize($jws, 0);
    }
}
