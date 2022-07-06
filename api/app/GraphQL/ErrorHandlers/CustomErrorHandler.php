<?php

namespace App\GraphQL\ErrorHandlers;

use Closure;
use GraphQL\Error\Error;
use Illuminate\Support\Facades\Log;
use Nuwave\Lighthouse\Execution\ErrorHandler;
use Nuwave\Lighthouse\Exceptions\RendersErrorsExtensions;

/**
 * Handle Exceptions that implement Nuwave\Lighthouse\Exceptions\RendersErrorsExtensions
 * and add extra content from them to the 'extensions' key of the Error that is rendered
 * to the User.
 */
class CustomErrorHandler implements ErrorHandler
{
    public function __invoke(?Error $error, Closure $next): ?array
    {


        // // Error handlers are instantiated once per query
        // $this->errorCount++;

        // Keep the pipeline going, last step formats the error into an array
        return $next($error);
    }
    public static function handle(Error $error, Closure $next): array
    {
        Log::error('GRAPHQL Error: '.$error->message);
        $underlyingException = $error->getPrevious();

        if ($underlyingException instanceof RendersErrorsExtensions) {
            // Reconstruct the error, passing in the extensions of the underlying exception
            $error = new Error( // @phpstan-ignore-line TODO remove after graphql-php upgrade
                "nBrindas error",
                $error->nodes,
                $error->getSource(),
                $error->getPositions(),
                $error->getPath(),
                $underlyingException,
                $underlyingException->extensionsContent()
            );
        }

        return $next($error);
    }
}
