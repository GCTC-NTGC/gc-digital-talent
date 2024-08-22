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
        $headerLocale = $request->header('Accept-Language', 'en');
        $locale = $this->getLocale($headerLocale);
        if ($locale == 'en' || $locale == 'fr') {
            App::setLocale($locale);
        }

        return $next($request);
    }

    private function getLocale(?string $header)
    {
        if (! $header) {
            return $this->availableLocales[0];
        }

        /**
         *  Parse header string into a $locale => $quality array
         *
         *  If a quality is not present, it defaults to highest priority
         *  We denote this by a decreasing value of 100, giving higher
         *  priority to locales that appear earlier in the string
         */
        $defaultQuality = 100;
        $localePairs = explode(',', $header);
        $weightedLocales = [];
        foreach ($localePairs as $pair) {
            $pairArr = explode(';', $pair);
            $quality = isset($pairArr[1]) ? str_replace('q=', '', $pairArr[1]) : null;
            $quality = $quality ? floatval($quality) : $defaultQuality--;

            $weightedLocales[$pairArr[0]] = $quality;
        }

        // Sort by quality in descending order
        arsort($weightedLocales);

        // Attempt to find a letter code that matches our
        // supported locales in order of priority
        $preferredLocale = $this->availableLocales[0];
        foreach (array_keys($weightedLocales) as $locale) {
            $twoLetter = substr($locale, 0, 2);
            if (in_array($twoLetter, $this->availableLocales)) {
                $preferredLocale = $twoLetter;
                break;
            }
        }

        return $preferredLocale;
    }
}
