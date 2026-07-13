<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Psr\Log\LoggerInterface;

class RequestOriginLoggerMiddleware
{
    protected $logger;

    public function __construct(LoggerInterface $logger)
    {
        $this->logger = $logger;
    }

    public function handle(Request $request, Closure $next)
    {
        $result = $next($request);

        $this->logger->info('Request logged', [
            'XForwardedIP' => $request->header('X-Forwarded-For'),
        ]);

        return $result;
    }
}
