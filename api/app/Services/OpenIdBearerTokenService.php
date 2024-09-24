<?php

namespace App\Services;

use DateInterval;
use Exception;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\UnauthorizedException;
// We're using two JWT management libraries here (Jose & Lcobucci), which each
// offer different functionality related to constraints and JWKS.
// TODO: Consider consolidating into a single library, or migrating to a new
// one that does it all.
use Jose\Component\Core\JWKSet;
use Jose\Component\Core\Util\RSAKey;
use Lcobucci\Clock\Clock;
use Lcobucci\JWT\Configuration;
use Lcobucci\JWT\Signer;
use Lcobucci\JWT\Signer\Key\InMemory;
use Lcobucci\JWT\UnencryptedToken;
use Lcobucci\JWT\Validation\Constraint\IssuedBy;
use Lcobucci\JWT\Validation\Constraint\LooseValidAt;
use Lcobucci\JWT\Validation\Constraint\RelatedTo;
use Lcobucci\JWT\Validation\Constraint\SignedWith;

class OpenIdBearerTokenService
{
    private Configuration $unsecuredConfig;

    private Clock $clock;

    private string $configUri;

    private DateInterval $allowableClockSkew;

    public function fastSigner(): Configuration
    {
        // replace implementations of signers with no algorithm, forUnsecuredSigner(), and dropping None
        // due to being dropped by Lcobucci, this is the recommended fast replacement
        // https://lcobucci-jwt.readthedocs.io/en/latest/upgrading/#v4x-to-v5x

        return Configuration::forSymmetricSigner(
            new Signer\Blake2b(),
            InMemory::base64Encoded('MpQd6dDPiqnzFSWmpUfLy4+Rdls90Ca4C8e0QD0IxqY=')
        );
    }

    public function __construct(string $configUri, Clock $clock, DateInterval $allowableClockSkew)
    {
        $this->unsecuredConfig = $this->fastSigner();
        $this->clock = $clock;
        $this->configUri = $configUri;
        $this->allowableClockSkew = $allowableClockSkew;
    }

    // get a configuration property from the openid configuration json document
    private function getConfigProperty(string $propertyName): string
    {
        $jsonString = Cache::remember('openid_config_json_string', 60, function () { // only get content every minute
            $response = Http::retry(times: config('oauth.request_retries'), sleepMilliseconds: 500, when: function (Exception $exception) {
                return $exception instanceof ConnectionException;
            }, throw: false)->get($this->configUri);

            if ($response->failed()) {
                Log::error('Failed when GETting the OpenID configuration in getConfigProperty');
                Log::debug((string) $response->getBody());
                throw new Exception('Failed to get config');
            }

            return $response->body();
        });

        $obj = json_decode($jsonString);
        $uri = data_get($obj, $propertyName);
        if (! $uri) {
            throw new Exception('No '.$propertyName.' property found in OpenID configuration');
        }

        return $uri;
    }

    // get a Lcobucci\JWT\Configuration object for a given key ID
    private function getConfiguration(string $keyId): Configuration
    {
        if (! $keyId) {
            throw new Exception('No key ID provided');
        }

        $jwks_uri = $this->getConfigProperty('jwks_uri');
        $jsonString = Cache::remember('jwks_json_string', 60, function () use ($jwks_uri) { // only get jwks content every minute
            $response = Http::retry(times: config('oauth.request_retries'), sleepMilliseconds: 500, when: function (Exception $exception) {
                return $exception instanceof ConnectionException;
            }, throw: false)->get($jwks_uri);

            if ($response->failed()) {
                Log::error('Failed when GETting the JWKS in getConfiguration');
                Log::debug((string) $response->getBody());
                throw new Exception('Failed to get config');
            }

            return $response->body();
        });

        // Uses web-token/jwt-core to generate public key from "e" and "n" in JWKS.
        // Source: https://github.com/lcobucci/jwt/issues/32#issuecomment-907556410
        $set = JWKSet::createFromKeyData(json_decode($jsonString, true));
        $jwk = $set->get($keyId);

        switch ($jwk->get('alg')) {
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
                throw new Exception('Unknown algorithm type in jwks');
        }

        $pem = RSAKey::createFromJWK($jwk)->toPEM();
        // Private key is only used for generating tokens, which is not being done here
        // None support was dropped so used a key from Lcobucci docs
        // https://lcobucci-jwt.readthedocs.io/en/stable/quick-start/#parsing-tokens
        $config = Configuration::forAsymmetricSigner(
            $signer,
            InMemory::base64Encoded(
                'hiG8DlOKvtih6AxlZn5XKImZ06yu8I3mkOzaJrEuW8yAv8Jnkw330uMt8AEqQ5LB'
            ),
            InMemory::plainText($pem),
        );

        return $config;

    }

    // call the introspection endpoint to check if the OP considers the access token still valid
    public function verifyJwtWithIntrospection(string $accessToken)
    {
        $cacheKey = 'introspection_token_'.$accessToken;

        if (Cache::has($cacheKey)) {
            // use cached access token status if available
            $isTokenActive = Cache::get($cacheKey);
        } else {
            // make api call to introspect endpoint
            $introspectionUri = $this->getConfigProperty('introspection_endpoint');
            $response = Http::retry(times: config('oauth.request_retries'), sleepMilliseconds: 500, when: function (Exception $exception) {
                return $exception instanceof ConnectionException;
            }, throw: false)->asForm()
                ->withToken($accessToken)
                ->post($introspectionUri, [
                    'token' => $accessToken,
                ]);

            if ($response->failed()) {
                $errorCode = $response->json('error');
                $isNormalErrorCode = $errorCode == 'access_denied';

                $errorMessageToLog = 'Failed when GETting the introspection verification in verifyJwtWithIntrospection '.$errorCode;
                if (! $isNormalErrorCode) {
                    Log::error($errorMessageToLog);
                } else {
                    Log::debug($errorMessageToLog);
                }
                Log::debug((string) $response->getBody());
                throw new Exception('Failed to get introspection');
            }

            $isTokenActive = boolval($response->json('active'));
            // only cache active token
            if ($isTokenActive) {
                Cache::put($cacheKey, $isTokenActive, 3); // cache for a few seconds in case of multiple API calls for a page load
            }
        }

        if (! $isTokenActive) {
            throw new UnauthorizedException('Access token is not active', 401);
        }
    }

    /*
    * @returns Lcobucci\JWT\Token\DataSet
    */
    public function validateAndGetClaims(string $bearerToken)
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

        $this->verifyJwtWithIntrospection($bearerToken);

        return $token->claims();
    }
}
