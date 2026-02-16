<?php

namespace App\Contracts;

interface BearerTokenService
{
    public function fastSigner(): \Lcobucci\JWT\Configuration;

    public function verifyJwtWithIntrospection(string $accessToken);

    public function validateAndGetClaims(string $bearerToken);
}
