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
        } else {
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
            'fallback to English when not set' => [false, 'en'],
            'sets English' => ['en', 'en'],
            'sets French' => ['fr', 'fr'],
        ];
    }
}
