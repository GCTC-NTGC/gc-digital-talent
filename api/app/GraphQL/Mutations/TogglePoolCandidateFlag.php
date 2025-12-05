<?php

namespace App\GraphQL\Mutations;

use App\Models\PoolCandidate;

final class TogglePoolCandidateFlag
{
    /**
     * Toggles the pool candidates is_flagged.
     */
    public function __invoke($_, array $args)
    {
        $candidate = PoolCandidate::find($args['id']);
        $candidate->is_flagged = ! $candidate->is_flagged;
        $candidate->save();

        return $candidate->is_flagged;
    }
}
