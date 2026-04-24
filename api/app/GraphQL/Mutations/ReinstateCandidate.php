<?php

namespace App\GraphQL\Mutations;

use App\Models\PoolCandidate;

final class ReinstateCandidate
{
    /**
     * Marks a candidate as removed from the pool
     */
    public function __invoke($_, array $args)
    {
        $candidate = PoolCandidate::find($args['id']);

        $candidate->reinstate();

        return $candidate;
    }
}
