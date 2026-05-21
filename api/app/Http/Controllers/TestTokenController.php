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
 *
 * Only reachable when TESTING_TOKEN_ENABLED=true. Never deployed to production.
 *
 * Usage:
 *   GET /testing/token?role=platform_admin   — first user with that role
 *   GET /testing/token?sub=<user-sub>        — specific user by sub
 */
class TestTokenController extends Controller
{
    public function issue(Request $request): JsonResponse
    {
        $user = $this->resolveUser($request);

        if (! $user) {
            return response()->json([
                'error' => 'No matching user found. Provide ?role=<role> or ?sub=<sub>.',
            ], 404);
        }

        $token = $this->mintToken($user->sub);

        return response()->json([
            'access_token' => $token,
            'refresh_token' => $token,
            'id_token' => $token,
            'user_sub' => $user->sub,
            'user_email' => $user->email,
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
