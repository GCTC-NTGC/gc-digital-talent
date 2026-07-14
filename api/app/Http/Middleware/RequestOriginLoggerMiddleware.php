<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
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

        Log::info('TEMP DEBUG azure test', [
            'XForwardedIP' => $request->header('X-Forwarded-For'),
        ]);

        if ($request->hasSession()) {
            $xForwardedFor = $request->header('X-Forwarded-For');
            $previous = $request->session()->get('last_x_forwarded_ip');

            if (! is_null($xForwardedFor) && $xForwardedFor !== $previous) {
                $this->logger->info('Session IP changed', [
                    'XForwardedIP' => $xForwardedFor,
                ]);
                $request->session()->put('last_x_forwarded_ip', $xForwardedFor);
            }
        }

        return $result;
    }
}
