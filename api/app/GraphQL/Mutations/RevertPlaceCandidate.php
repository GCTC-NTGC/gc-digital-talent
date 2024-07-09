<?php

namespace App\GraphQL\Mutations;

use App\Enums\PoolCandidateStatus;
use App\Models\PoolCandidate;

final class RevertPlaceCandidate
{
    /**
     * Revert the placing operation for a candidate
     *
     * @param  array{}  $args
     */
    public function __invoke($_, array $args)
    {
        $candidate = PoolCandidate::findOrFail($args['id']);

        $candidate->pool_candidate_status = PoolCandidateStatus::QUALIFIED_AVAILABLE->name;
        $candidate->placed_at = null;
        $candidate->placed_department_id = null;

        $finalDecicion = $candidate->computeFinalDecision();
        $candidate->computed_final_decision = $finalDecicion['decision'];
        $candidate->computed_final_decision_weight = $finalDecicion['weight'];

        $candidate->save();

        return $candidate;
    }
}
