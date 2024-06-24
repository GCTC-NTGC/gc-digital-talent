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
        "\u{202F}", // https://symbl.cc/en/202F/
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
                return response("<html><head><title>Request Rejected</title></head><body>The requested URL was rejected.<a href='javascript:history.back();'>[Go Back]</a></body></html>", 403);
            }
        }

        return $next($request);

    }
}
