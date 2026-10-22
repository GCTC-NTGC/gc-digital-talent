<?php

namespace App\GraphQL\Mutations;

use App\Models\PoolCandidate;

final class TogglePoolCandidateDashboardVisibility
{
    /**
     * Toggles the pool candidates is_dashboard_viewable
     */
    public function __invoke($_, array $args)
    {
        /** @var PoolCandidate */
        $candidate = PoolCandidate::findOrFail($args['id']);

        $candidate->toggleDashboardVisibility();

        return $candidate;
    }
}
