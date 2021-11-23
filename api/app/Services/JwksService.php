<?php
namespace App\Services;

use App\Services\Contracts\AuthConfigInterface;
use App\Services\Contracts\KeySetInterface;
use Lcobucci\JWT\Configuration;
use Lcobucci\JWT\Signer;
use Lcobucci\JWT\Signer\Key\InMemory;
use Illuminate\Support\Facades\Cache;

class JwksService implements KeySetInterface
{
    protected $authConfig;

    public function __construct(AuthConfigInterface $authConfig)
    {
        $this->authConfig = $authConfig;
    }

    public function getConfiguration(string $keyId) : ?Configuration
    {
        $jwks_uri = $this->authConfig->getJwksUri();
        $jsonString = Cache::remember('jwks_json_string', 60, function() use($jwks_uri) // only get jwks content every minute
        {
            return file_get_contents($jwks_uri);
        });

        $keyDictionary = $this->parseJwksJsonString($jsonString);

        return $keyDictionary[$keyId];
    }

    private function parseJwksJsonString(string $jsonString) : array
    {
        $obj = json_decode($jsonString);
        $keysObj = data_get($obj, 'keys');

        $dictionaryKeys = array_map(fn($value) => data_get($value, 'kid'), $keysObj);
        $dictionaryValues = array_map(fn($value) => $this->mapObjectToConfig($value), $keysObj);
        $dictionary =  array_combine($dictionaryKeys, $dictionaryValues);

        array_filter($dictionary); // clean out null elements that will not be used

        return $dictionary;
    }

    private function mapObjectToConfig(object $value): ?Configuration
    {
        $publicKeyUse = data_get($value, 'use');
        if($publicKeyUse != 'sig')
            return null; // only take signing keys for use

        $algorithm = data_get($value, 'alg');
        switch ($algorithm) {
            case 'RS256':
                $signer = new Signer\Rsa\Sha256();
                break;
            case 'RS384':
                $signer = new Signer\Rsa\Sha384();
                break;
            case 'RS512':
                $signer = new Signer\Rsa\Sha512();
                break;
            default:
                return null; // unknown algorithm type
        }

        $certificateChain = array_values(data_get($value, 'x5c'))[0];

        $config = Configuration::forAsymmetricSigner(
            $signer,
            InMemory::empty(), // Private key is only used for generating tokens, which is not being done here, therefore empty is used.
            InMemory::plainText('-----BEGIN CERTIFICATE-----' . "\n" . $certificateChain . "\n" . '-----END CERTIFICATE-----'),
        );

        return $config;
    }
}
