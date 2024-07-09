<?php

namespace App\GraphQL\Mutations;

use App\Enums\PoolCandidateStatus;
use App\Models\PoolCandidate;
use Carbon\Carbon;

final class QualifyCandidate
{
    /**
     * Qualify operation for a candidate
     *
     * @param  array{}  $args
     */
    public function __invoke($_, array $args)
    {
        $candidate = PoolCandidate::findOrFail($args['id']);
        $expiryDate = $args['expiryDate'];
        $now = Carbon::now();

        $candidate->pool_candidate_status = PoolCandidateStatus::QUALIFIED_AVAILABLE->name;
        $candidate->expiry_date = $expiryDate;
        $candidate->final_decision_at = $now;
        $candidate->save();

        $finalDecicion = $candidate->computeFinalDecision();
        $candidate->computed_final_decision = $finalDecicion['decision'];
        $candidate->computed_final_decision_weight = $finalDecicion['weight'];

        return $candidate;
    }
}
