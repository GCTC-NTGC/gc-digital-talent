<?php
namespace App\Services;

use Exception;
use App\Services\Contracts\BearerTokenServiceInterface;
use DateInterval;
use Illuminate\Support\Facades\Cache;
use Lcobucci\Clock\Clock;
use Lcobucci\JWT\Configuration;
use Lcobucci\JWT\Signer;
use Lcobucci\JWT\UnencryptedToken;
use Lcobucci\JWT\Signer\Key\InMemory;
use Lcobucci\JWT\Token\DataSet;
use Lcobucci\JWT\Validation\Constraint\IssuedBy;
use Lcobucci\JWT\Validation\Constraint\RelatedTo;
use Lcobucci\JWT\Validation\Constraint\LooseValidAt;
use Lcobucci\JWT\Validation\Constraint\SignedWith;

class OpenIdBearerTokenService implements BearerTokenServiceInterface
{
    private Configuration $unsecuredConfig;
    private Clock $clock;
    private string $configUri;
    private DateInterval $allowableClockSkew;

    public function __construct(Clock $clock, string $configUri, DateInterval $allowableClockSkew)
    {
        $this->unsecuredConfig = Configuration::forUnsecuredSigner(); // need a config to parse the token and get the key id
        $this->clock = $clock;
        $this->configUri = $configUri;
        $this->allowableClockSkew = $allowableClockSkew;
    }

    // parse the jwks json document and build a dictionary of key id to configuration object
    private function parseJwksJsonString(string $jsonString) : array
    {
        $obj = json_decode($jsonString);
        $keysObj = data_get($obj, 'keys');

        $dictionaryKeys = array_map(fn($value) => data_get($value, 'kid'), $keysObj);
        $dictionaryValues = array_map(fn($value) => $this->mapKeyEntryToConfig($value), $keysObj);
        $dictionary =  array_combine($dictionaryKeys, $dictionaryValues);

        array_filter($dictionary); // clean out null elements that will not be used

        return $dictionary;
    }

    // take a single key entry and build a Lcobucci\JWT\Configuration object for it
    // any objects that can't be mapped return a null and will be filtered out later
    private function mapKeyEntryToConfig(object $value): ?Configuration
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

    // get a configuration property from the openid configuration json document
    private function getConfigProperty(string $propertyName): string
    {
        $jsonString = Cache::remember('openid_config_json_string', 60, function() { // only get content every minute
            return file_get_contents($this->configUri);
        });

        $obj = json_decode($jsonString);;
        $uri = data_get($obj, $propertyName);
        if(!$uri)
            throw new Exception('No ' . $propertyName . ' property found in OpenID configuration');
        return $uri;
    }

    // get a Lcobucci\JWT\Configuration object for a given key ID
    private function getConfiguration(string $keyId) : ?Configuration
    {
        if(!$keyId)
            throw new Exception('No key ID provided');

        $jwks_uri = $this->getConfigProperty('jwks_uri');
        $jsonString = Cache::remember('jwks_json_string', 60, function() use($jwks_uri) // only get jwks content every minute
        {
            return file_get_contents($jwks_uri);
        });

        $keyDictionary = $this->parseJwksJsonString($jsonString);

        return $keyDictionary[$keyId];
    }


    public function validateAndGetClaims(string $bearerToken) : DataSet
    {
        $unsecuredToken = $this->unsecuredConfig->parser()->parse($bearerToken);

        $keyId = strval($unsecuredToken->headers()->get('kid'));
        $config = $this->getConfiguration($keyId);

        $token = $config->parser()->parse($bearerToken);

        assert($token instanceof UnencryptedToken);
        $config->setValidationConstraints(
            new IssuedBy($this->getConfigProperty('issuer')),
            new RelatedTo($token->claims()->get('sub')),
            new LooseValidAt($this->clock, $this->allowableClockSkew),
            new SignedWith($config->signer(), $config->verificationKey()),
        );
        $constraints = $config->validationConstraints();

        $config->validator()->assert($token, ...$constraints);

        return $token->claims();
    }
}
