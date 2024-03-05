<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Psr\Log\LoggerInterface;

/**
 * Logs slow running queries
 * based on Nuwave\Lighthouse\Support\Http\Middleware\LogGraphQLQueries.php;
 */
class SlowQueryLoggerMiddleware
{
    /**
     * @var \Psr\Log\LoggerInterface
     */
    protected $logger;

    public function __construct(LoggerInterface $logger)
    {
        $this->logger = $logger;
    }

    /**
     * @return mixed Any kind of response
     */
    public function handle(Request $request, Closure $next)
    {
        $start = hrtime(true);
        $result = $next($request);
        $end = hrtime(true);
        $elapsedSeconds = ($end - $start) / 1000000000;

        if ($elapsedSeconds > 5) {
            $this->logger->info(
                'Slow query',
                [
                    'request' => $request->json()->all(),
                    'elapsed_seconds' => $elapsedSeconds,
                ]
            );
        }

        return $result;
    }
}
