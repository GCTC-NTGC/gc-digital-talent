<?php

namespace App\GraphQL\Mutations;

use App\Models\PoolCandidate;
use Carbon\Carbon;

final class PlaceCandidate
{
    /**
     * Placing operation for a candidate
     *
     * @param  array{}  $args
     */
    public function __invoke($_, array $args)
    {
        $candidate = PoolCandidate::findOrFail($args['id']);
        $placementType = $args['placementType'];
        $now = Carbon::now();
        $departmentId = $args['departmentId'];

        $candidate->pool_candidate_status = $placementType;
        $candidate->placed_at = $now;
        $candidate->placed_department_id = $departmentId;
        $candidate->save();

        return $candidate;
    }
}
