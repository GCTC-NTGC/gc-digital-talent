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

        // Extensions are logged as-is, so use ErrorCode values (ex. EMAIL_ADDRESS_IN_USE) for
        // validation messages, not raw user input (ex. jane.doe@personal-email.com), to avoid
        // leaking PII into server logs.
        $errorMessage = $error->getMessage();
        $extensions = $error->getExtensions();
        $context = $extensions ? ['extensions' => $extensions] : [];
        if (str_contains($errorMessage, 'query depth')) {
            // some errors need a higher logging level
            Log::error('GraphQL Error: '.$errorMessage, $context);
        } else {
            Log::info('GraphQL Error: '.$errorMessage, $context);
        }

        // Keep the pipeline going, last step formats the error into an array
        return $next($error);
    }
}
