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

        $referralPauseLength = $args['referralPauseLength'] ?? null;
        $referralPauseReason = $args['referralPauseReason'] ?? null;
        $referralUnpauseAt = $args['referralUnpauseAt'] ?? null;

        $candidate->pauseReferral($referralPauseLength, $referralPauseReason, $referralUnpauseAt);

        return $candidate;
    }
}
