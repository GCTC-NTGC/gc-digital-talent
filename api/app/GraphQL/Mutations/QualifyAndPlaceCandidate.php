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
        $referralPauseLength = $args['referralPause']['referralPauseLength'] ?? null;
        $referralPauseReason = $args['referralPause']['referralPauseReason'] ?? null;
        $referralUnpauseAt = $args['referralPause']['referralUnpauseAt'] ?? null;

        $candidate->disableLogging();
        $candidate->qualify($expiryDate);
        $candidate->place($placementType, $departmentId);
        $candidate->pauseReferral($referralPauseLength, $referralPauseReason, $referralUnpauseAt);

        return $candidate;
    }
}
