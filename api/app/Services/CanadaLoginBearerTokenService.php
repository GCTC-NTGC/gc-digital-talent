<?php

namespace App\Services;

use App\Contracts\BearerTokenService;
use DateInterval;
use Exception;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Arr;
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
use Lcobucci\JWT\Configuration;
use Lcobucci\JWT\Signer;
use Lcobucci\JWT\Signer\Key\InMemory;
use Lcobucci\JWT\UnencryptedToken;
use Lcobucci\JWT\Validation\Constraint\IssuedBy;
use Lcobucci\JWT\Validation\Constraint\LooseValidAt;
use Lcobucci\JWT\Validation\Constraint\RelatedTo;
use Lcobucci\JWT\Validation\Constraint\SignedWith;
use Psr\Clock\ClockInterface;

class CanadaLoginBearerTokenService implements BearerTokenService
{
    private Configuration $unsecuredConfig;

    private ClockInterface $clock;

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

    public function __construct(string $configUri, ClockInterface $clock, DateInterval $allowableClockSkew)
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
            assert($response instanceof \Illuminate\Http\Client\Response);

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
            assert($response instanceof \Illuminate\Http\Client\Response);

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

        $signer = match (true) {
            ! $jwk->has('alg') => new Signer\Rsa\Sha256(), // assume if not given
            $jwk->get('alg') == 'RS256' => new Signer\Rsa\Sha256(),
            $jwk->get('alg') == 'RS384' => new Signer\Rsa\Sha384(),
            $jwk->get('alg') == 'RS512' => new Signer\Rsa\Sha512(),
            default => throw new Exception('Unknown algorithm type in jwks'),
        };

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

    private function getIntrospectionValues(string $accessToken): array
    {
        $cacheKey = 'introspection_token_values_'.$accessToken;

        if (Cache::has($cacheKey)) {
            // shortcut: use cached access token values if available
            return Cache::get($cacheKey);
        }

        // make api call to introspect endpoint
        $introspectionUri = $this->getConfigProperty('introspection_endpoint');
        $response = Http::retry(times: config('oauth.request_retries'), sleepMilliseconds: 500, when: function (Exception $exception) {
            return $exception instanceof ConnectionException;
        }, throw: false)->asForm()
            ->withToken($accessToken)  // required by mockauth but not GCSI
            ->post($introspectionUri, [
                'client_id' => config('oauth.client_id'),
                'client_secret' => config('oauth.client_secret'),
                'token' => $accessToken,
            ]);
        assert($response instanceof \Illuminate\Http\Client\Response);

        if ($response->failed()) {
            Log::error('Failed when GETting the introspection verification in getIntrospectionValues ('.$response->status().') '.$response->body());
            throw new Exception('Failed to get introspection');
        }

        $values = $response->json();
        $isTokenActive = Arr::boolean($values, 'active', false);
        $expiryTimestamp = Arr::integer($values, 'exp', 0);
        $nowTimestamp = $this->clock->now()->getTimestamp();
        // only cache active token
        if ($isTokenActive && $expiryTimestamp > $nowTimestamp) {
            $cacheTime = min(10, $expiryTimestamp - $nowTimestamp); // cache for a few seconds, or up to expiry time
            Cache::put($cacheKey, $values, $cacheTime);
        }

        return $values;
    }

    // call the introspection endpoint to check if the OP considers the access token still valid
    public function verifyJwtWithIntrospection(string $accessToken)
    {
        $values = $this->getIntrospectionValues($accessToken);

        $isTokenActive = Arr::boolean($values, 'active', false);

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
        $config = $config->withValidationConstraints(
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
