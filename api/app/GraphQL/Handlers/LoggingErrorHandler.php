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

        // Log the error, including any structured detail (e.g. which validation rule failed)
        //
        // Extensions from any ProvidesExtensions exception are logged as-is, so avoid
        // putting raw user input into a validation message or it will end up in server logs too.
        // Not to do: 'email' => 'The value :input is not a valid email.'
        //   -> logs "The value jane.doe@personal-email.com is not a valid email."
        // To do: 'email' => 'The :attribute must be a valid email address.'
        //   -> logs "The email must be a valid email address." (or use a symbolic
        //   code like INVALID_COMMUNITY_DEPARTMENT_COMBO)
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
