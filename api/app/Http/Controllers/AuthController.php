<?php

namespace App\Http\Controllers;

use App\Contracts\LoginProvider;
use App\Services\UserClaimsService;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function __construct(
        protected LoginProvider $loginProvider,
        protected UserClaimsService $userClaimsService,
    ) {}

    public function login(Request $request)
    {
        $request->session()->put(
            'from',
            $request->input('from')
        );

        $request->session()->put(
            'devServer',
            $request->input('devServer')
        );

        return $this->loginProvider->startLogin($request);
    }

    public function authCallback(Request $request)
    {
        $login = $this->loginProvider->finishLogin($request);

        $newUserCreated = $this->userClaimsService->applyClaims($login->claims);

        // start with token payload
        $authCallbackResponseQuery = $login->tokens;

        $from = $request->session()->pull('from');

        if ($from != filter_var($from, FILTER_SANITIZE_URL)) {
            $from = null;
        } // Contains unsanitary characters. Throw it away.
        if (substr($from, 0, 1) != '/') {
            $from = null;
        } // Does not start with / so it's not a relative url. Don't want an open redirect vulnerability. Throw it away.

        if ($newUserCreated) {
            // new user, go to registration
            if (strlen($from) > 0) {
                $authCallbackResponseQuery['from'] = $from;
            }
            $navigateToUri = config('oauth.post_login_registration_redirect');
        } else {
            // existing user, go where they want
            $appUrl = config('app.url');
            $navigateToUri = strlen($from) > 0 ? $appUrl.$from : config('oauth.post_login_redirect');
        }

        // duplicate logic for running with watch mode
        if ($request->session()->pull('devServer')) {
            if ($newUserCreated) {
                // new user, go to registration
                if (strlen($from) > 0) {
                    $authCallbackResponseQuery['from'] = $from;
                }
                $navigateToUri = config('oauth.dev_post_login_registration_redirect');
            } else {
                // existing user, go where they want
                $appUrl = config('app.dev_url');
                $navigateToUri = strlen($from) > 0 ? $appUrl.$from : config('oauth.dev_post_login_redirect');
            }
        }

        return redirect($navigateToUri.'?'.http_build_query($authCallbackResponseQuery));
    }

    public function refresh(Request $request)
    {
        // POST body only - GET query-param support was removed in #17832 so refresh tokens don't end up in URL/access logs
        $refreshToken = $request->post('refresh_token');
        if (! is_string($refreshToken) || $refreshToken === '') {
            return response('Failed to get token', 400);
        }

        $tokens = $this->loginProvider->refresh($refreshToken);
        if ($tokens === null) {
            return response('Failed to get token', 400);
        }

        return response()->json($tokens);
    }

    // generates an allow-list of auth callbacks for our domain
    public function sectorIdentifier(Request $request)
    {
        $callbackUrls = [
            // our actual auth callback
            config('oauth.redirect_uri'),
        ];

        // temporarily allow callback to the migration tool
        if (config('oauth.migration_tool_callback')) {
            $callbackUrls[] = config('oauth.migration_tool_callback');
        }

        return response(json_encode($callbackUrls, JSON_UNESCAPED_SLASHES))
            ->withHeaders([
                'Content-Type' => 'application/json; charset=utf-8',
            ]);
    }
}
