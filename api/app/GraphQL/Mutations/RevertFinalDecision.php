<?php

namespace App\GraphQL\Mutations;

use App\Enums\PoolCandidateStatus;
use App\Models\PoolCandidate;

final class RevertFinalDecision
{
    /**
     * Reverting the qualify or disqualify candidate operations
     *
     * @param  array{}  $args
     */
    public function __invoke($_, array $args)
    {
        $candidate = PoolCandidate::findOrFail($args['id']);

        $candidate->pool_candidate_status = PoolCandidateStatus::UNDER_ASSESSMENT->name;
        $candidate->expiry_date = null;
        $candidate->final_decision_at = null;

        $finalDecision = $candidate->computeFinalDecision();
        $candidate->computed_final_decision = $finalDecision['decision'];
        $candidate->computed_final_decision_weight = $finalDecision['weight'];

        $candidate->save();

        return $candidate;
    }
}
