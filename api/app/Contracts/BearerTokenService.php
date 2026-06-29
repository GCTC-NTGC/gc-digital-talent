<?php

namespace App\Contracts;

use Lcobucci\JWT\Configuration;

interface BearerTokenService
{
    public function fastSigner(): Configuration;

    public function verifyJwtWithIntrospection(string $accessToken);

    public function validateAndGetClaims(string $bearerToken);
}
