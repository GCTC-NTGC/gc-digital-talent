<?php

namespace App\Contracts;

interface BearerTokenService
{
    public function validateAndGetClaims(string $bearerToken);
}
