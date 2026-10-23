<?php

namespace App\Contracts;

interface BearerTokenService
{
    public function verifyJwtWithIntrospection(string $accessToken);

    public function validateAndGetClaims(string $bearerToken);
}
