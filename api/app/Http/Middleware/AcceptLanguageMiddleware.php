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
     * Languages we support
     */
    private array $availableLocales = ['en', 'fr'];

    /**
     * @return mixed Any kind of response
     */
    public function handle(Request $request, Closure $next)
    {
        $locale = $request->getPreferredLanguage($this->availableLocales);
        if ($locale == 'en' || $locale == 'fr') {
            App::setLocale($locale);
        }

        return $next($request);
    }
}
