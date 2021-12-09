<?php
namespace App\Services;

use DateTimeZone;
use Exception;
use Lcobucci\Clock\SystemClock;
use Lcobucci\JWT\Configuration;
use Lcobucci\JWT\Signer;
use Lcobucci\JWT\Signer\Key\InMemory;
use Lcobucci\JWT\UnencryptedToken;
use Lcobucci\JWT\Validation\Constraint\IssuedBy;
use Lcobucci\JWT\Validation\Constraint\RelatedTo;
use Lcobucci\JWT\Validation\Constraint\LooseValidAt;
use Lcobucci\JWT\Validation\Constraint\SignedWith;
use App\Services\Contracts\BearerTokenServiceInterface;
use Lcobucci\JWT\Token\DataSet;

class LocalAuthBearerTokenService implements BearerTokenServiceInterface
{
    private string $issuer;
    private Configuration $config;
    private SystemClock $clock;

    function __construct(string $issuer, string $publicKey, string $timeZone)
    {
        $this->issuer = $issuer;
        $this->config = Configuration::forAsymmetricSigner(
            new Signer\Rsa\Sha256(),
            InMemory::empty(), // Private key is only used for generating tokens, which is not being done here, therefore empty is used.
            InMemory::plainText($publicKey),
        );
        $this->clock = new SystemClock(new DateTimeZone($timeZone));
    }

    public function validateAndGetClaims(string $bearerToken) : DataSet
    {
        $token = $this->config->parser()->parse($bearerToken);

        assert($token instanceof UnencryptedToken);
        $this->config->setValidationConstraints(
            new IssuedBy($this->issuer),
            new RelatedTo($token->claims()->get('sub')),
            new LooseValidAt($this->clock),
            new SignedWith($this->config->signer(), $this->config->verificationKey()),
        );
        $constraints = $this->config->validationConstraints();

        $this->config->validator()->assert($token, ...$constraints);

        return $token->claims();
    }
}
