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
        $path = $request->path();
        if (str_starts_with($path, 'admin/')) {
            $request->merge(['isProtectedRequest' => true]);
        }

        return $next($request);
    }
}
