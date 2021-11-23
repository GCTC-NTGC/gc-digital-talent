<?php
namespace App\Services\Contracts;

use Lcobucci\JWT\Configuration;

Interface KeySetInterface
{
    public function getConfiguration(string $keyId) : ?Configuration;
}
