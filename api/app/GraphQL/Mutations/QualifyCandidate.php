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

        [$currentStepId] = $candidate->computeAssessmentStatus();
        $candidate->assessment_step_id = $currentStepId;

        $candidate->save();

        return $candidate;
    }
}
