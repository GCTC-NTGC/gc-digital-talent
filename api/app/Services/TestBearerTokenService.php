<?php

namespace App\Services;

use App\Contracts\BearerTokenService;
use Lcobucci\JWT\Configuration;
use Lcobucci\JWT\Signer;
use Lcobucci\JWT\Signer\Key\InMemory;
use Lcobucci\JWT\Token\DataSet;
use Lcobucci\JWT\UnencryptedToken;
use Lcobucci\JWT\Validation\Constraint\IssuedBy;
use Lcobucci\JWT\Validation\Constraint\LooseValidAt;
use Lcobucci\JWT\Validation\Constraint\SignedWith;
use Psr\Clock\ClockInterface;

/**
 * Wraps the real BearerTokenService and intercepts tokens issued via the
 * test branch on /refresh (X-Testing-Secret header). Test tokens are validated
 * against a shared symmetric key — no JWKS fetch or introspection call is made.
 *
 * All other tokens (real JWTs) are passed through to the real service
 * unchanged, so normal UAT logins continue to work while this is active.
 *
 * Only registered when TESTING_TOKEN_ENABLED=true. Never used in production.
 */
class TestBearerTokenService implements BearerTokenService
{
    public const TEST_ISSUER = 'gc-digital-talent-testing';

    public function __construct(
        private readonly BearerTokenService $realService,
        private readonly string $testSecret,
        private readonly ClockInterface $clock,
    ) {}

    public function fastSigner(): Configuration
    {
        return $this->realService->fastSigner();
    }

    public function verifyJwtWithIntrospection(string $accessToken): void
    {
        if ($this->isTestToken($accessToken)) {
            return; // no-op — test tokens are not registered with the auth provider
        }

        $this->realService->verifyJwtWithIntrospection($accessToken);
    }

    public function validateAndGetClaims(string $bearerToken): DataSet
    {
        if ($this->isTestToken($bearerToken)) {
            return $this->validateTestToken($bearerToken);
        }

        return $this->realService->validateAndGetClaims($bearerToken);
    }

    private function isTestToken(string $bearerToken): bool
    {
        try {
            $parsed = $this->fastSigner()->parser()->parse($bearerToken);

            if (! ($parsed instanceof UnencryptedToken)) {
                return false;
            }

            return $parsed->claims()->get('iss') === self::TEST_ISSUER;
        } catch (\Throwable) {
            return false;
        }
    }

    private function validateTestToken(string $bearerToken): DataSet
    {
        $config = $this->testConfig();
        $token = $config->parser()->parse($bearerToken);

        assert($token instanceof UnencryptedToken);

        $config = $config->withValidationConstraints(
            new IssuedBy(self::TEST_ISSUER),
            new LooseValidAt($this->clock),
            new SignedWith($config->signer(), $config->verificationKey()),
        );

        $config->validator()->assert($token, ...$config->validationConstraints());

        return $token->claims();
    }

    private function testConfig(): Configuration
    {
        return Configuration::forSymmetricSigner(
            new Signer\Blake2b(),
            InMemory::base64Encoded($this->testSecret),
        );
    }
}
