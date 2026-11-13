<?php

namespace App\Services;

use App\Contracts\LoginProvider;
use App\ValueObjects\LoginResult;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

/**
 * Logs users in without any external auth provider: whoever is using it picks the
 * sub and claims. Only bound when AUTH_PROVIDER=dummy, never in production.
 */
class DummyLoginProvider implements LoginProvider
{
    public function __construct(private DummyBearerTokenService $tokenService) {}

    public function startLogin(Request $request): Response
    {
        return response()->view('dummy_auth.login');
    }

    public function finishLogin(Request $request): LoginResult
    {
        $request->validate(['sub' => ['required', 'string']]);

        return $this->issue($request->input('sub'), $this->parseClaims($request->input('claims')));
    }

    // the refresh token is just a dummy token, so reissue it with the same sub and claims
    public function refresh(string $refreshToken): ?array
    {
        try {
            $claims = $this->tokenService->validateAndGetClaims($refreshToken);
        } catch (Throwable) {
            return null;
        }

        return $this->issue($claims->get('sub'), $claims->all())->tokens;
    }

    /**
     * Log in as any user without the form.
     *
     * @param  array<string, mixed>  $claims  extra claims, e.g. given_name or email
     */
    public function issue(string $sub, array $claims = []): LoginResult
    {
        $claims = $this->tokenService->claimsFor($sub, $claims);
        $token = $this->tokenService->tokenFor($claims);

        // the dummy token carries the claims, so it doubles as the id and refresh tokens
        return new LoginResult($claims, [
            'access_token' => $token,
            'id_token' => $token,
            'refresh_token' => $token,
            'token_type' => 'Bearer',
        ]);
    }

    /**
     * Parse the form's claims textarea, which holds a JSON object.
     *
     * @return array<string, mixed>
     */
    private function parseClaims(?string $claims): array
    {
        if ($claims === null) {
            return [];
        }
        $claims = json_decode($claims, true);
        if (! is_array($claims) || (array_is_list($claims) && $claims !== [])) {
            throw ValidationException::withMessages(['claims' => 'Claims must be a JSON object.']);
        }

        return $claims;
    }
}
