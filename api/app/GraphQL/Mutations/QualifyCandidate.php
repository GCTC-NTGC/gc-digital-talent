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
        $pauseReferralsLength = $args['pauseReferralsLength'] ?? null;
        $pauseReferralsReason = $args['pauseReferralsReason'] ?? null;
        $resumeReferralsAt = $args['resumeReferralsAt'] ?? null;

        $candidate->qualify($expiryDate);

        if ($pauseReferralsLength && $pauseReferralsReason) {
            $candidate->pauseReferrals($pauseReferralsLength, $pauseReferralsReason, $resumeReferralsAt);
        }

        return $candidate;
    }
}
