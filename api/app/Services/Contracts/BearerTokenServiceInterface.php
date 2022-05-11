<?php
namespace App\Services\Contracts;

Interface BearerTokenServiceInterface
{
    public function validateAndGetClaims(string $bearerToken);
}
