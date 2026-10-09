<?php

namespace App\Services;

use App\Contracts\ClientAuthenticationService;
use App\Contracts\JoseService;
use Illuminate\Support\Str;
use Psr\Clock\ClockInterface;

class PrivateKeyJwtAuthenticationService implements ClientAuthenticationService
{
    public function __construct(
        private readonly string $clientId,
        private readonly JoseService $joseService,
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
        $now = $this->clock->now()->getTimestamp();

        $payload = [
            'iss' => $this->clientId,
            'sub' => $this->clientId,
            'aud' => $audience,
            'jti' => (string) Str::uuid(),
            'iat' => $now,
            'exp' => $now + $this->assertionTtlSeconds,
        ];

        $signature = $this->joseService->createSignature($payload);

        return $signature;
    }
}
