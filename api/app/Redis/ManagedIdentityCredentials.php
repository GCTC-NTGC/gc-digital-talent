<?php

namespace App\Redis;

use App\Contracts\ManagedIdentityService;
use RuntimeException;

/* Redis login for the app's managed identity: username is the identity's object id, password is an Entra token. */
class ManagedIdentityCredentials
{
    public const RESOURCE = 'https://redis.azure.com';

    public function __construct(protected ManagedIdentityService $identityService) {}

    /**
     * @return array{username: string, password: string}
     */
    public function get(): array
    {
        $token = $this->identityService->getAccessToken(self::RESOURCE);

        // the object id is the token's oid claim, so each slot's identity logs in as itself without extra config
        $payload = json_decode(base64_decode(strtr(explode('.', $token)[1] ?? '', '-_', '+/')), true);
        $oid = is_array($payload) ? ($payload['oid'] ?? null) : null;

        if (! is_string($oid) || $oid === '') {
            throw new RuntimeException('Managed identity token for Redis has no oid claim. REDIS_USE_MANAGED_IDENTITY only works inside an Azure app service with a managed identity.');
        }

        return ['username' => $oid, 'password' => $token];
    }
}
