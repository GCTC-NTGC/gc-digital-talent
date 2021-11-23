<?php
namespace App\Services\Contracts;

use Lcobucci\JWT\Configuration;

Interface AuthClientInterface
{
    public function getConfiguration(string $keyId) : ?Configuration;
    public function getIssuer() : string;
}
