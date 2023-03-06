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
        if (!is_null($user) && ( $user->isAdmin() || $user->isPlatformAdmin() ))
        {
            $message = 'GraphQL request from admin user ['.$user['email'].']';
            $this->logger->info(
                $message,
                $request->json()->all()
            );
        }

        return $next($request);
    }
}
