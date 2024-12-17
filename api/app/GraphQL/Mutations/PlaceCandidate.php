<?php

namespace App\GraphQL\Mutations;

use App\Enums\PlacementType;
use App\Models\PoolCandidate;
use Carbon\Carbon;

final class PlaceCandidate
{
    /**
     * Placing operation for a candidate
     */
    public function __invoke($_, array $args)
    {
        $candidate = PoolCandidate::findOrFail($args['id']);
        $placementType = $args['placementType'];
        $now = Carbon::now();
        $departmentId = $args['departmentId'];

        $candidate->pool_candidate_status = $placementType;
        $candidate->placed_at = $now;
        $candidate->placed_department_id = $departmentId;

        $finalDecision = $candidate->computeFinalDecision();
        $candidate->computed_final_decision = $finalDecision['decision'];
        $candidate->computed_final_decision_weight = $finalDecision['weight'];

        if ($placementType === PlacementType::PLACED_TERM->name || $placementType === PlacementType::PLACED_INDETERMINATE->name) {
            $candidate->suspended_at = $now;
        } else {
            $candidate->suspended_at = null;
        }

        $candidate->save();

        return $candidate;
    }
}
