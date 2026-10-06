<?php

namespace App\Contracts;

use Jose\Component\Core\JWK;

/* A service to provide keys */
interface KeyService
{
    public function getEncryptionKeyPublicJwk(): JWK;

    public function getSigningKeyPublicJwk(): JWK;

    public function createSignature(array $values): string;
}
