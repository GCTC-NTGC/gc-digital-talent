<?php

namespace App\GraphQL\Mutations;

use App\Models\PoolCandidate;

final class QualifyAndPlaceCandidate
{
    /**
     * Qualify operation for a candidate
     */
    public function __invoke($_, array $args)
    {
        $candidate = PoolCandidate::findOrFail($args['id']);
        $expiryDate = $args['expiryDate'];
        $placementType = $args['placementType'];
        $departmentId = $args['department']['connect']; // validator asserts this value is valid
        $pauseReferralsLength = $args['pauseReferralsLength'] ?? null;
        $pauseReferralsReason = $args['pauseReferralsReason'] ?? null;
        $resumeReferralsAt = $args['resumeReferralsAt'] ?? null;
        $placedStartDate = $args['placedStartDate'] ?? null;
        $placedEndDate = $args['placedEndDate'] ?? null;

        $candidate->disableLogging();
        $candidate->qualify($expiryDate);
        $candidate->place($placementType, $departmentId, $placedStartDate, $placedEndDate);
        if ($pauseReferralsLength && $pauseReferralsReason) {
            $candidate->pauseReferrals($pauseReferralsLength, $pauseReferralsReason, $resumeReferralsAt);
        }

        return $candidate;
    }
}
