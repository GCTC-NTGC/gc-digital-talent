<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

/**
 * Simulates the behavior of the production firewall
 */
class SimulateFirewallMiddleware
{
    const BANNED_CHARACTERS = [
        '💩',
    ];

    public function __construct() {}

    /**
     * @return mixed Any kind of response
     */
    public function handle(Request $request, Closure $next)
    {
        Log::debug('firewall handling');
        $content = (string) $request->getContent();

        foreach (SimulateFirewallMiddleware::BANNED_CHARACTERS as $bannedCharacter) {
            if (str_contains($content, $bannedCharacter)) {
                // Reconstructed from a screenshot. It would be good to get a real http response.
                return response("<html><head><title>Request Rejected</title></head><body><p>The requested URL was rejected. Please consult with your administrator.</p><p>Your support ID is: &lt;13923429753487111250&gt;</p><p><a href='javascript:history.back();'>[Go Back]</a></p></body></html>", 403);
            }
        }

        return $next($request);

    }
}
