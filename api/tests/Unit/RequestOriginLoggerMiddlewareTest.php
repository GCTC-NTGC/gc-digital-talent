<?php

namespace Tests\Unit;

use App\Http\Middleware\RequestOriginLoggerMiddleware;
use Illuminate\Http\Request;
use Illuminate\Session\ArraySessionHandler;
use Illuminate\Session\Store;
use Mockery;
use Psr\Log\LoggerInterface;
use Tests\TestCase;

class RequestOriginLoggerMiddlewareTest extends TestCase
{
    protected function requestWithSession(): Request
    {
        $request = Request::create('/graphql');
        $request->setLaravelSession(new Store('test-session', new ArraySessionHandler(120)));

        return $request;
    }

    public function testLogsOnFirstSighting(): void
    {
        $logger = Mockery::mock(LoggerInterface::class);
        $logger->shouldReceive('info')->once()->with('Session IP changed', [
            'XForwardedIP' => '1.2.3.4',
        ]);

        $request = $this->requestWithSession();
        $request->headers->set('X-Forwarded-For', '1.2.3.4');

        $middleware = new RequestOriginLoggerMiddleware($logger);
        $middleware->handle($request, fn ($req) => response('ok'));
    }

    public function testSkipsLoggingWhenIpUnchanged(): void
    {
        $logger = Mockery::mock(LoggerInterface::class);
        $logger->shouldNotReceive('info');

        $request = $this->requestWithSession();
        $request->headers->set('X-Forwarded-For', '1.2.3.4');
        $request->session()->put('last_x_forwarded_ip', '1.2.3.4');

        $middleware = new RequestOriginLoggerMiddleware($logger);
        $middleware->handle($request, fn ($req) => response('ok'));
    }

    public function testSkipsLoggingWhenHeaderAbsent(): void
    {
        $logger = Mockery::mock(LoggerInterface::class);
        $logger->shouldNotReceive('info');

        $request = $this->requestWithSession();

        $middleware = new RequestOriginLoggerMiddleware($logger);
        $middleware->handle($request, fn ($req) => response('ok'));
    }

    public function testSkipsLoggingWhenNoSession(): void
    {
        $logger = Mockery::mock(LoggerInterface::class);
        $logger->shouldNotReceive('info');

        $request = Request::create('/graphql');
        $request->headers->set('X-Forwarded-For', '1.2.3.4');

        $middleware = new RequestOriginLoggerMiddleware($logger);
        $middleware->handle($request, fn ($req) => response('ok'));
    }
}
