<?php
namespace App\Services;

use App\Services\Contracts\AuthClientInterface;
use Exception;
use Lcobucci\JWT\Configuration;
use Lcobucci\JWT\Signer;
use Lcobucci\JWT\Signer\Key\InMemory;
use Illuminate\Support\Facades\Cache;

class LocalAuthClientService implements AuthClientInterface
{
    public function getConfiguration(string $keyId) : ?Configuration
    {
        return Configuration::forAsymmetricSigner(
            new Signer\Rsa\Sha256(),
            InMemory::empty(), // Private key is only used for generating tokens, which is not being done here, therefore empty is used.
            InMemory::plainText($this->getEnvVariable('AUTH_SERVER_PUBLIC_KEY')),
        );
    }

    public function getIssuer(): string
    {
        return $this->getEnvVariable('AUTH_SERVER_ISS');
    }

    private function getEnvVariable(string $variableName): string
    {
        $variableValue = env($variableName);
        if(!$variableValue)
            throw new Exception('No environment variable ' . $variableName);
        return $variableValue;
    }
}
