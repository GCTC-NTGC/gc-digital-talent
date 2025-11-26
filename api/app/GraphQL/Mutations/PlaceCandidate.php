<?php

namespace App\GraphQL\Mutations;

use App\Models\PoolCandidate;

final class PlaceCandidate
{
    /**
     * Placing operation for a candidate
     */
    public function __invoke($_, array $args)
    {
        $candidate = PoolCandidate::findOrFail($args['id']);
        $placementType = $args['placementType'];
        $departmentId = $args['department']['connect']; // validator asserts this value is valid

        $candidate->place($placementType, $departmentId);
        $candidate->screening_stage = null;
        $candidate->assessment_step_id = null;

        $candidate->save();

        return $candidate;
    }
}
