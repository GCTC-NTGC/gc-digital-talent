<?php

namespace App\Services;

use App\Contracts\ClientAuthenticationService;
use Illuminate\Support\Str;
use Jose\Component\Core\AlgorithmManager;
use Jose\Component\Core\JWK;
use Jose\Component\Signature\Algorithm\RS256;
use Jose\Component\Signature\JWSBuilder;
use Jose\Component\Signature\Serializer\CompactSerializer;
use Psr\Clock\ClockInterface;
use RuntimeException;

class PrivateKeyJwtAuthenticationService implements ClientAuthenticationService
{
    public function __construct(
        private readonly string $clientId,
        private readonly ?string $jwkPath,
        private readonly ClockInterface $clock,
        private readonly int $assertionTtlSeconds,
    ) {}

    public function paramsFor(string $audience): array
    {
        return [
            'client_assertion_type' => 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
            'client_assertion' => $this->buildAssertion($audience),
        ];
    }

    // builds a signed private_key_jwt client assertion (RFC 7523) for the given audience
    private function buildAssertion(string $audience): string
    {
        if (! $this->jwkPath || ! file_exists($this->jwkPath)) {
            throw new RuntimeException("No client signing key found at '{$this->jwkPath}'. Run `php artisan oauth:generate-client-jwk`.");
        }

        $jwk = JWK::createFromJson(file_get_contents($this->jwkPath));
        $now = $this->clock->now()->getTimestamp();

        $payload = json_encode([
            'iss' => $this->clientId,
            'sub' => $this->clientId,
            'aud' => $audience,
            'jti' => (string) Str::uuid(),
            'iat' => $now,
            'exp' => $now + $this->assertionTtlSeconds,
        ]);

        $algorithmManager = new AlgorithmManager([new RS256()]);
        $jwsBuilder = new JWSBuilder($algorithmManager);

        $jws = $jwsBuilder->create()
            ->withPayload($payload)
            ->addSignature($jwk, [
                'alg' => 'RS256',
                'typ' => 'JWT',
                'kid' => $jwk->get('kid'),
            ])
            ->build();

        return (new CompactSerializer())->serialize($jws, 0);
    }
}
