<?php

namespace App\GraphQL\Mutations;

use App\Models\PoolCandidate;

final class PauseCandidateReferral
{
    /**
     * Pause referrals for a candidate
     */
    public function __invoke($_, array $args)
    {
        $candidate = PoolCandidate::findOrFail($args['id']);

        $referralPauseLength = $args['referralPause']['referralPauseLength'] ?? null;
        $referralPauseReason = $args['referralPause']['referralPauseReason'] ?? null;
        $referralUnpauseAt = $args['referralPause']['referralUnpauseAt'] ?? null;

        $candidate->pauseReferral($referralPauseLength, $referralPauseReason, $referralUnpauseAt);

        return $candidate;
    }
}
