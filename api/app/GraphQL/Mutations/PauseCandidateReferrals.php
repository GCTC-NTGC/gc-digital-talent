<?php

namespace App\GraphQL\Mutations;

use App\Models\PoolCandidate;

final class PauseCandidateReferrals
{
    /**
     * Pause referrals for a candidate
     */
    public function __invoke($_, array $args)
    {
        $candidate = PoolCandidate::findOrFail($args['id']);

        $pauseReferralsLength = $args['pauseReferralsLength'] ?? null;
        $pauseReferralsReason = $args['pauseReferralsReason'] ?? null;
        $resumeReferralsAt = $args['resumeReferralsAt'] ?? null;

        $candidate->pauseReferrals($pauseReferralsLength, $pauseReferralsReason, $resumeReferralsAt);

        return $candidate;
    }
}
