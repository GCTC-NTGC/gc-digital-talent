<?php

namespace App\Http\Middleware;

use Closure;

class LocaleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $parsed_url = parse_url($request->fullUrl());

        if(array_key_exists('path', $parsed_url))
        {
            $path = $parsed_url['path'];
            if(strlen($path) > 3)
                config(['app.locale' => substr(parse_url($request->fullUrl())['path'], 1, 2)]);
        }
        return $next($request);
    }
}
