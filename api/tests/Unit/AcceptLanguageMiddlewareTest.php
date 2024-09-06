<?php

namespace Tests\Unit;

use App\Http\Middleware\AcceptLanguageMiddleware;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Tests\TestCase;

class AcceptLanguageMiddlewareTest extends TestCase
{
    /**
     * @dataProvider provider
     */
    public function testLocaleSet($header, $expected): void
    {
        $request = Request::create(route('graphql'));
        if ($header) {
            $request->headers->set('Accept-Language', $header);
        } elseif ($header == 'unset') {
            $request->headers->remove('Accept-Language');
        }

        $next = function () {
            return response(App::getLocale());
        };

        $middleware = new AcceptLanguageMiddleware();
        $response = $middleware->handle($request, $next);

        $this->assertEquals($expected, $response->getContent());
    }

    public static function provider(): array
    {
        return [
            // NOTE: Browsers send by default so we should only change when we get a value we can handle
            'does not modify default value' => [false, 'en'],
            'does not modify unexpected value' => ['mt-MT;q=0.9,ta-IN;q=0.8,eu-ES;q=0.7', 'en'],
            'does not modify invalid value' => ['invalid-language-value', 'en'],
            // If the header does not exist, we should fallback to English
            'fallback to English when not set' => ['unset', 'en'],
            // Can get an expected locale out of a list of unexpected values
            'sets English from list' => ['mt-MT;q=0.9,en-US;q=0.8,eu-ES;q=0.7', 'en'],
            'sets French from list' => ['mt-MT;q=0.9,fr-LU;q=0.8,eu-ES;q=0.7', 'fr'],
            'weights by quality' => ['en;q=0.8,eu-ES;q=0.7,fr-LU;q=0.9;', 'fr'],
            // If a valid value is sent, make sure locale is updated
            'sets English' => ['en', 'en'],
            'sets French' => ['fr', 'fr'],
        ];
    }
}
