<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
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
        $referer = request()->headers->get('referer');
        if (! is_null($user) && $user->hasRole('platform_admin')) {
            $message = 'Request from platform admin, '.$user['email'].', referer: '.$referer.',';
            $this->logger->info(
                $message.' '.json_encode($request->json()->all())
            );
        }

        return $next($request);
    }
}
