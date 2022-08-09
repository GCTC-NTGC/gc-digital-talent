<?php

namespace App\GraphQL\Handlers;

use Closure;
use GraphQL\Error\Error;
use Nuwave\Lighthouse\Execution\ErrorHandler;
use Illuminate\Support\Facades\Log;

class LoggingErrorHandler implements ErrorHandler
{
    public function __invoke(?Error $error, Closure $next): ?array
    {
        // pass nulls through
        if (null === $error) {
            return $next(null);
        }

        // Log the error
        Log::info('GraphQL Error: '.$error->getMessage());

        // Keep the pipeline going, last step formats the error into an array
        return $next($error);
    }
}
