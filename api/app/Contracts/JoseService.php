<?php

namespace App\Contracts;

use Jose\Component\Core\JWK;

/* A service to provide JOSE (JSON Object Signing and Encryption) operations */
interface JoseService
{
    public function getEncryptionKeyPublicJwk(): JWK;

    public function getSigningKeyPublicJwk(): JWK;

    public function createSignature(array $values): string;
}
