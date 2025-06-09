<?php

namespace App\GraphQL\Handlers;

use Closure;
use GraphQL\Error\Error;
use Illuminate\Support\Facades\Log;
use Nuwave\Lighthouse\Execution\ErrorHandler;

class LoggingErrorHandler implements ErrorHandler
{
    public function __invoke(?Error $error, Closure $next): ?array
    {
        // pass nulls through
        if ($error === null) {
            return $next(null);
        }

        // Log the error
        $errorMessage = $error->getMessage();
        if (str_contains($errorMessage, 'query depth')) {
            // some errors need a higher logging level
            Log::error('GraphQL Error: '.$errorMessage);
        } else {
            Log::info('GraphQL Error: '.$errorMessage);
        }

        // Keep the pipeline going, last step formats the error into an array
        return $next($error);
    }
}
