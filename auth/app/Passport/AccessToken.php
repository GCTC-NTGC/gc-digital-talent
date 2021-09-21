<?php

namespace App\Passport;

use App\Models\User;
use DateTimeImmutable;
use League\OAuth2\Server\CryptKey;
use Lcobucci\JWT\Signer\Rsa\Sha256;
use Laravel\Passport\Bridge\AccessToken as BaseToken;
use Lcobucci\JWT\Configuration;
use Lcobucci\JWT\Signer\Key\InMemory;

class AccessToken extends BaseToken {

    /**
     * @var CryptKey
     */
    private $privateKey;

    /**
     * @var Configuration
     */
    private $jwtConfiguration;

    /**
     * Set the private key used to encrypt this access token.
     */
    public function setPrivateKey(CryptKey $privateKey)
    {
        $this->privateKey = $privateKey;
    }

    /**
     * Initialise the JWT Configuration.
     */
    public function initJwtConfiguration()
    {
        $this->jwtConfiguration = Configuration::forAsymmetricSigner(
            new Sha256(),
            InMemory::plainText($this->privateKey->getKeyContents(), $this->privateKey->getPassPhrase() ?? ''),
            InMemory::plainText('')
        );
    }

     /**
     * Generate a string representation from the access token
     */
    public function __toString()
    {
        return $this->convertToJWT()->toString();
    }

	/**
     * OVERRIDE
     * Generate a JWT from the access token
     *
     * @return Token
     */
    private function convertToJWT()
    {
        $this->initJwtConfiguration();
        // default identifier is the model id, but we want to use email instead as access token identifier (ie "sub" field).
        $email = User::find($this->getClient()->getIdentifier())->email;
        return $this->jwtConfiguration->builder()
                ->issuedBy(env("APP_URL"))
                ->permittedFor($this->getClient()->getIdentifier())
                ->identifiedBy($email)
                ->issuedAt(new DateTimeImmutable())
                ->canOnlyBeUsedAfter(new DateTimeImmutable())
                ->expiresAt($this->getExpiryDateTime())
                ->relatedTo((string) $this->getUserIdentifier())
                ->withClaim('scopes', $this->getScopes())
                ->getToken($this->jwtConfiguration->signer(), $this->jwtConfiguration->signingKey());
	}
}
