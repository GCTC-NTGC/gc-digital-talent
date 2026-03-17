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
        $referralPauseLength = $args['referralPause']['referralPauseLength'] ?? null;
        $referralPauseReason = $args['referralPause']['referralPauseReason'] ?? null;
        $referralUnpauseAt = $args['referralPause']['referralUnpauseAt'] ?? null;

        $candidate->qualify($expiryDate);
        $candidate->pauseReferral($referralPauseLength, $referralPauseReason, $referralUnpauseAt);

        return $candidate;
    }
}
