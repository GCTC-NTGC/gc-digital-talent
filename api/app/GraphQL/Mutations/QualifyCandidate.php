<?php

namespace App\GraphQL\Mutations;

use App\Models\PoolCandidate;

final class QualifyCandidate
{
    /**
     * Qualify operation for a candidate
     */
    public function __invoke($_, array $args)
    {
        $candidate = PoolCandidate::findOrFail($args['id']);
        $expiryDate = $args['expiryDate'];

        $candidate->qualify($expiryDate);

        $candidate->screening_stage = null;
        $candidate->assessment_step_id = null;

        $candidate->save();

        return $candidate;
    }
}
