<?php

namespace App\GraphQL\Mutations;

use App\Models\PoolCandidate;
use Carbon\Carbon;

final class DisqualifyCandidate
{
    /**
     * Disqualify operation for a candidate
     */
    public function __invoke($_, array $args)
    {
        $candidate = PoolCandidate::findOrFail($args['id']);
        $reason = $args['reason'];
        $now = Carbon::now();

        $candidate->pool_candidate_status = $reason;
        $candidate->final_decision_at = $now;
        $candidate->screening_stage = null;
        $candidate->assessment_step_id = null;

        $candidate->save();

        return $candidate;
    }
}
