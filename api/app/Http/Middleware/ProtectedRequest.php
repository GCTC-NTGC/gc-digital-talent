<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

/**
 * Notices if the request is a secure one that would have been
 * protected by the VPN.
 */
class ProtectedRequest
{
    /**
     * @return mixed Any kind of response
     */
    public function handle(Request $request, Closure $next)
    {
        if ($request->is('admin/*')) {
            $request->merge(['isProtectedRequest' => true]);
        }

        return $next($request);
    }
}
