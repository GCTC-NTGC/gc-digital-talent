<?php

namespace App\Http\Controllers;

use App\Services\DummyLoginProvider;
use App\Services\UserClaimsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

/**
 * The parts of dummy auth that have no OpenID equivalent. Only routed when
 * AUTH_PROVIDER=dummy, never in production.
 */
class DummyAuthController extends Controller
{
    public function __construct(
        protected DummyLoginProvider $loginProvider,
        protected UserClaimsService $userClaimsService,
    ) {}

    // lets scripts like Playwright and Locust log in without a browser
    public function token(Request $request): JsonResponse
    {
        $request->validate([
            'sub' => ['required', 'string'],
            'claims' => ['nullable', 'array'],
        ]);

        $login = $this->loginProvider->issue($request->input('sub'), $request->input('claims') ?? []);
        $this->userClaimsService->applyClaims($login->claims);

        return response()->json($login->tokens);
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
}
