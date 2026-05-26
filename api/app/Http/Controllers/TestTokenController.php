<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\TestBearerTokenService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Lcobucci\JWT\Configuration;
use Lcobucci\JWT\Signer;
use Lcobucci\JWT\Signer\Key\InMemory;

/**
 * Issues short-lived JWTs for test users without going through GCKey.
 * Only active when TESTING_TOKEN_ENABLED=true.
 *
 * Reachable via the proxied /refresh endpoint:
 *   GET /refresh?sub=<user-sub>  (X-Testing-Secret: <TESTING_ENDPOINT_SECRET>)
 */
class TestTokenController extends Controller
{
    public function issue(Request $request): JsonResponse
    {
        // Caller must supply the shared endpoint secret via X-Testing-Secret header
        $expectedSecret = config('testing.endpoint_secret');
        if (! $expectedSecret || ! hash_equals($expectedSecret, (string) $request->header('X-Testing-Secret', ''))) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $user = $this->resolveUser($request);

        if (! $user) {
            return response()->json([
                'error' => 'No matching user found. Provide ?role=<role> or ?sub=<sub>.',
            ], 404);
        }

        return response()->json([
            'access_token' => $this->mintToken($user->sub),
            'refresh_token' => $this->mintToken($user->sub),
            'id_token' => $this->mintToken($user->sub),
        ]);
    }

    private function resolveUser(Request $request): ?User
    {
        if ($sub = $request->query('sub')) {
            return User::where('sub', $sub)->first();
        }

        if ($role = $request->query('role')) {
            return User::whereHas('roles', fn ($q) => $q->where('name', $role))->first();
        }

        return null;
    }

    private function mintToken(string $sub): string
    {
        $config = Configuration::forSymmetricSigner(
            new Signer\Blake2b(),
            InMemory::base64Encoded(config('testing.jwt_secret')),
        );

        return $config->builder()
            ->issuedBy(TestBearerTokenService::TEST_ISSUER)
            ->issuedAt(now()->toDateTimeImmutable())
            ->expiresAt(now()->addHours(2)->toDateTimeImmutable())
            ->relatedTo($sub)
            ->getToken($config->signer(), $config->signingKey())
            ->toString();
    }
}
