<?php

namespace Tests\Unit;

use App\Http\Middleware\RequestOriginLoggerMiddleware;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Contracts\Cache\Repository as Cache;
use Illuminate\Http\Request;
use Mockery;
use Psr\Log\LoggerInterface;
use Tests\TestCase;

class RequestOriginLoggerMiddlewareTest extends TestCase
{
    protected function requestWithUser(string $userId): Request
    {
        $request = Request::create('/graphql');

        $user = Mockery::mock(Authenticatable::class);
        $user->shouldReceive('getAuthIdentifier')->andReturn($userId);
        $user->id = $userId;
        $request->setUserResolver(fn () => $user);

        return $request;
    }

    public function testLogsOnFirstSighting(): void
    {
        $logger = Mockery::mock(LoggerInterface::class);
        $logger->shouldReceive('info')->once()->with('Session IP changed', [
            'XForwardedIP' => '1.2.3.4',
            'UserId' => 'user-1',
        ]);

        $cache = Mockery::mock(Cache::class);
        $cache->shouldReceive('get')->once()->with('last_x_forwarded_ip:user-1')->andReturn(null);
        $cache->shouldReceive('put')->once()->with('last_x_forwarded_ip:user-1', '1.2.3.4', Mockery::any());

        $request = $this->requestWithUser('user-1');
        $request->headers->set('X-Forwarded-For', '1.2.3.4');

        $middleware = new RequestOriginLoggerMiddleware($logger, $cache);
        $middleware->handle($request, fn ($req) => response('ok'));
    }

    public function testSkipsLoggingWhenIpUnchanged(): void
    {
        $logger = Mockery::mock(LoggerInterface::class);
        $logger->shouldNotReceive('info');

        $cache = Mockery::mock(Cache::class);
        $cache->shouldReceive('get')->once()->with('last_x_forwarded_ip:user-1')->andReturn('1.2.3.4');
        $cache->shouldNotReceive('put');

        $request = $this->requestWithUser('user-1');
        $request->headers->set('X-Forwarded-For', '1.2.3.4');

        $middleware = new RequestOriginLoggerMiddleware($logger, $cache);
        $middleware->handle($request, fn ($req) => response('ok'));
    }

    public function testSkipsLoggingWhenHeaderAbsent(): void
    {
        $logger = Mockery::mock(LoggerInterface::class);
        $logger->shouldNotReceive('info');

        $cache = Mockery::mock(Cache::class);
        $cache->shouldReceive('get')->once()->with('last_x_forwarded_ip:user-1')->andReturn(null);
        $cache->shouldNotReceive('put');

        $request = $this->requestWithUser('user-1');

        $middleware = new RequestOriginLoggerMiddleware($logger, $cache);
        $middleware->handle($request, fn ($req) => response('ok'));
    }

    public function testSkipsLoggingWhenNoUser(): void
    {
        $logger = Mockery::mock(LoggerInterface::class);
        $logger->shouldNotReceive('info');

        $cache = Mockery::mock(Cache::class);
        $cache->shouldNotReceive('get');
        $cache->shouldNotReceive('put');

        $request = Request::create('/graphql');
        $request->headers->set('X-Forwarded-For', '1.2.3.4');

        $middleware = new RequestOriginLoggerMiddleware($logger, $cache);
        $middleware->handle($request, fn ($req) => response('ok'));
    }
}
