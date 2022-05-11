<?php
namespace App\Services;

use DateInterval;
use Lcobucci\Clock\Clock;
use Lcobucci\JWT\Configuration;
use Lcobucci\JWT\Signer;
use Lcobucci\JWT\Signer\Key\InMemory;
use Lcobucci\JWT\UnencryptedToken;
use Lcobucci\JWT\Validation\Constraint\IssuedBy;
use Lcobucci\JWT\Validation\Constraint\RelatedTo;
use Lcobucci\JWT\Validation\Constraint\LooseValidAt;
use Lcobucci\JWT\Validation\Constraint\SignedWith;
use App\Services\Contracts\BearerTokenServiceInterface;

class LocalAuthBearerTokenService implements BearerTokenServiceInterface
{
    private string $issuer;
    private Configuration $config;
    private Clock $clock;
    private DateInterval $allowableClockSkew;

    function __construct(string $issuer, string $publicKey, Clock $clock, DateInterval $allowableClockSkew)
    {
        $this->issuer = $issuer;
        $this->config = Configuration::forAsymmetricSigner(
            new Signer\Rsa\Sha256(),
            InMemory::empty(), // Private key is only used for generating tokens, which is not being done here, therefore empty is used.
            InMemory::plainText($publicKey),
        );
        $this->clock = $clock;
        $this->allowableClockSkew = $allowableClockSkew;
    }

    /*
    * @returns DataSet
    */
    public function validateAndGetClaims(string $bearerToken)
    {
        $token = $this->config->parser()->parse($bearerToken);

        assert($token instanceof UnencryptedToken);
        $this->config->setValidationConstraints(
            new IssuedBy($this->issuer),
            new RelatedTo($token->claims()->get('sub')),
            new LooseValidAt($this->clock, $this->allowableClockSkew),
            new SignedWith($this->config->signer(), $this->config->verificationKey()),
        );
        $constraints = $this->config->validationConstraints();

        $this->config->validator()->assert($token, ...$constraints);

        return $token->claims();
    }
}
