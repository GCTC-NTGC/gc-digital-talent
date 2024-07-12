<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Psr\Log\LoggerInterface;

/**
 * Logs every incoming GraphQL query.
 * based on Nuwave\Lighthouse\Support\Http\Middleware\LogGraphQLQueries.php;
 */
class AuditQueryMiddleware
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
        $user = $request->user();
        if (! is_null($user) && $user->hasRole('platform_admin')) {
            $referer = request()->headers->get('referer');
            $message = 'Request from platform admin, '.$user['email'].', '.$referer.',';
            $this->logger->info(
                $message.' '.$request->getContent()
            );
        }

        // TESTING - DO NOT MERGE
        if (! App::isProduction()) {
            sleep(5);
        }

        return $next($request);
    }
}
