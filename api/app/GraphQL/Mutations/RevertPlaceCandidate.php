<?php

namespace App\GraphQL\Mutations;

use App\Enums\PoolCandidateStatus;
use App\Models\PoolCandidate;

final class RevertPlaceCandidate
{
    /**
     * Revert the placing operation for a candidate
     */
    public function __invoke($_, array $args)
    {
        $candidate = PoolCandidate::findOrFail($args['id']);

        $candidate->pool_candidate_status = PoolCandidateStatus::QUALIFIED_AVAILABLE->name;
        $candidate->placed_at = null;
        $candidate->placed_department_id = null;

        $candidate->save();

        return $candidate;
    }
}
