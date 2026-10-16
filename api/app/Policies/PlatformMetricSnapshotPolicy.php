<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;
use Illuminate\Auth\Access\Response;

/**
 * Authorizes reading platform-wide metrics.
 *
 * Only viewAny exists. Snapshots are never addressed individually — the query
 * always serves the latest readable one — so there is no per-record decision to
 * make, and the permission is deliberately platform-wide rather than scoped to a
 * team or community.
 */
class PlatformMetricSnapshotPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view platform metrics.
     *
     * @return Response|bool
     */
    public function viewAny(User $user)
    {
        return $user->isAbleTo('view-any-platformMetrics');
    }
}
