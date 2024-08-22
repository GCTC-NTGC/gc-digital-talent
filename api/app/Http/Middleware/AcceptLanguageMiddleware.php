<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;

/**
 * Sets the application locale based on
 * the `Accept-Language` header
 *
 * REF: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Language
 */
class AcceptLanguageMiddleware
{
    /**
     * @return mixed Any kind of response
     */
    public function handle(Request $request, Closure $next)
    {
        $locale = $request->header('Accept-Language', 'en') ?? '';
        App::setLocale($locale);

        return $next($request);
    }
}
