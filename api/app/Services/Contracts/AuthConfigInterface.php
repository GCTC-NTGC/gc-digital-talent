<?php
namespace App\Services\Contracts;

Interface AuthConfigInterface
{
    public function getIssuer() : string;
    public function getJwksUri(): string;
}
