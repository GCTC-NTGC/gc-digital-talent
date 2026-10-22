<?php

namespace App\Http\Controllers;

use App\Services\DummyBearerTokenService;
use App\Services\UserLoginService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

/**
 * Logs users in without any external auth provider: whoever is using it picks the
 * sub and claims. Only routed when AUTH_PROVIDER=dummy, never in production.
 */
class DummyAuthController extends Controller
{
    public function __construct(
        protected DummyBearerTokenService $tokenService,
        protected UserLoginService $userLoginService,
    ) {}

    public function login(Request $request)
    {
        $request->session()->put('from', $request->input('from'));
        $request->session()->put('devServer', $request->input('devServer'));

        return view('dummy_auth.login');
    }

    // the login form posts back to /login
    public function submitLogin(Request $request)
    {
        $request->validate(['sub' => ['required', 'string']]);
        $sub = $request->input('sub');
        $claims = $this->parseClaims($request->input('claims'));

        $token = $this->tokenService->issueToken($sub, $claims);

        return $this->userLoginService->completeLogin(
            $request,
            $this->tokenService->validateAndGetClaims($token),
            $this->tokenResponse($token),
        );
    }

    public function refresh()
    {
        return response('Dummy auth tokens do not expire and cannot be refreshed', 401);
    }

    // lets scripts like Playwright and Locust log in without a browser
    public function token(Request $request): JsonResponse
    {
        $request->validate([
            'sub' => ['required', 'string'],
            'claims' => ['nullable', 'array'],
        ]);

        $token = $this->tokenService->issueToken($request->input('sub'), $request->input('claims') ?? []);
        $this->userLoginService->applyClaims($this->tokenService->validateAndGetClaims($token));

        return response()->json($this->tokenResponse($token));
    }

    public function logout(Request $request)
    {
        // only redirect back into the app, so this can't be used as an open redirect
        $target = $request->query('post_logout_redirect_uri');
        $allowed = array_filter([config('app.url'), config('app.dev_url')]);
        if (! is_string($target) || ! Str::startsWith($target, array_map(fn ($url) => rtrim($url, '/').'/', $allowed))) {
            $target = config('app.url');
        }

        return redirect($target);
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

    /**
     * @return array<string, string>
     */
    private function tokenResponse(string $token): array
    {
        // the dummy token carries the claims, so it doubles as the id token
        return [
            'access_token' => $token,
            'id_token' => $token,
            'token_type' => 'Bearer',
        ];
    }
}
