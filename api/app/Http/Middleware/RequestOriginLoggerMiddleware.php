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
            $ip = null;
            $cacheKey = 'last_x_forwarded_ip:'.$user->getAuthIdentifier();
            $xForwardedFor = $request->header('X-Forwarded-For');
            $previous = $this->cache->get($cacheKey);

            if (! is_null($xForwardedFor)) {
                $ip = is_array($xForwardedFor) ? array_map(fn ($v) => $this->removePort($v), $xForwardedFor) : $this->removePort($xForwardedFor);

                if ($ip !== $previous) {
                    $this->logger->info('Session IP changed', [
                        'XForwardedIP' => $ip,
                        'UserId' => $user->id,
                    ]);
                    $this->cache->put($cacheKey, $ip, now()->addMinutes((int) config('session.lifetime')));
                }
            }
        }

        return $result;
    }

    private function removePort(?string $ip)
    {
        if (strpos($ip, ':') !== false) {
            return parse_url('http://'.$ip, PHP_URL_HOST);
        }

        return $ip;
    }
}
