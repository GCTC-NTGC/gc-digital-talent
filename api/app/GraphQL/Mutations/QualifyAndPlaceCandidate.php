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
        $departmentId = $args['departmentId'];

        $candidate->qualify($expiryDate);
        $candidate->place($placementType, $departmentId);
        $candidate->save();

        return $candidate;
    }
}
