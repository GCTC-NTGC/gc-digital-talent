<?php

namespace App\Services;

use App\Contracts\ClientAuthenticationService;

class ClientSecretPostAuthenticationService implements ClientAuthenticationService
{
    public function __construct(
        private readonly ?string $clientSecret,
    ) {}

    public function paramsFor(string $audience): array
    {
        return [
            'client_secret' => $this->clientSecret ?? '',
        ];
    }
}
