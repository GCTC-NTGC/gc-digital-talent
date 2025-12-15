<?php

namespace App\GraphQL\Mutations;

use App\Models\PoolCandidate;

final class RevertPlaceCandidate
{
    /**
     * Revert the placing operation for a candidate
     */
    public function __invoke($_, array $args)
    {
        $candidate = PoolCandidate::findOrFail($args['id']);

        $candidate->revertPlacement();

        return $candidate;
    }
}
