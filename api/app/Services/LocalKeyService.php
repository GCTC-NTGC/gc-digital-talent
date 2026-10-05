<?php

namespace App\Services;

use App\Contracts\KeyService;
use Illuminate\Support\Facades\Log;
use Jose\Component\Core\JWK;

/* Interact with an Azure key vault. */
class LocalKeyService implements KeyService
{
    /* Get a list of keys */
    public function getKeys(): ?string
    {
        return 'hello world';
    }

    private static function getKeyPublicJwk(string $configLocation): ?JWK
    {
        $path = config($configLocation);

        if (! file_exists($path)) {
            Log::warning('No key found when serving jwks.json', ['location' => $configLocation]);

            return null;
        }

        return JWK::createFromJson(file_get_contents($path))->toPublic();
    }

    public function getEncryptionKeyPublicJwk(): ?JWK
    {
        return self::getKeyPublicJwk('keys.local.encryption_key_path');

    }

    public function getSigningKeyPublicJwk(): ?JWK
    {
        return self::getKeyPublicJwk('keys.local.signing_key_path');
    }
}
