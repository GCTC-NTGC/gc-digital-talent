<?php
namespace App\Services\Contracts;

use Lcobucci\JWT\Token\DataSet;

Interface BearerTokenServiceInterface
{
    public function validateAndGetClaims(string $bearerToken) : DataSet;
}
