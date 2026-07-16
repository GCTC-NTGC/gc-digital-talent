<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Contracts\Cache\Repository as Cache;
use Illuminate\Http\Request;
use Psr\Log\LoggerInterface;

class RequestOriginLoggerMiddleware
{
    protected $logger;

    protected $cache;

    public function __construct(LoggerInterface $logger, Cache $cache)
    {
        $this->logger = $logger;
        $this->cache = $cache;
    }

    public function handle(Request $request, Closure $next)
    {
        $result = $next($request);

        $user = $request->user();

        if ($user) {
            $cacheKey = 'last_x_forwarded_ip:'.$user->getAuthIdentifier();
            $xForwardedFor = $request->header('X-Forwarded-For');
            $previous = $this->cache->get($cacheKey);

            if (! is_null($xForwardedFor) && $xForwardedFor !== $previous) {
                $this->logger->info('Session IP changed', [
                    'XForwardedIP' => $xForwardedFor,
                ]);
                $this->cache->put($cacheKey, $xForwardedFor, now()->addMinutes((int) config('session.lifetime')));
            }
        }

        return $result;
    }
}
