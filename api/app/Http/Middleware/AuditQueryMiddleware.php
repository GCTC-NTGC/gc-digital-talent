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

        $elevatedRoles =
        [
            'platform_admin',
            'community_admin',
            'community_recruiter',
            'community_talent_coordinator',
            'process_operator',
        ];

        if (! is_null($user)) {
            $applicableRoles = [];
            foreach ($elevatedRoles as $elevatedRole) {
                if ($user->hasRole($elevatedRole)) {
                    array_push($applicableRoles, $elevatedRole);
                }
            }

            if (! empty($applicableRoles) && (count($applicableRoles) > 0)) {
                $rolesString = implode(', ', $applicableRoles);

                $referer = request()->headers->get('referer');
                $message = 'Request from ['.$rolesString.'], '.$user['email'].', '.$referer.',';
                $requestContents = $request->getContent();

                // log request, other than notification queries
                if (! preg_match('/\"operationName\":\"NotificationCount\"/', $requestContents)) {
                    $this->logger->info(
                        $message.' '.$requestContents
                    );
                }
            }
        }

        return $next($request);
    }
}
