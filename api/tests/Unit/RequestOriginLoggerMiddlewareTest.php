<?php

namespace Tests\Unit;

use App\Http\Middleware\RequestOriginLoggerMiddleware;
use Illuminate\Http\Request;
use Mockery;
use Psr\Log\LoggerInterface;
use Tests\TestCase;

class RequestOriginLoggerMiddlewareTest extends TestCase
{
    public function testLogsXForwardedIp(): void
    {
        $logger = Mockery::mock(LoggerInterface::class);
        $logger->shouldReceive('info')->once()->with('Request logged', [
            'XForwardedIP' => '1.2.3.4',
        ]);

        $request = Request::create('/graphql');
        $request->headers->set('X-Forwarded-For', '1.2.3.4');

        $middleware = new RequestOriginLoggerMiddleware($logger);
        $middleware->handle($request, fn ($req) => response('ok'));
    }
}
