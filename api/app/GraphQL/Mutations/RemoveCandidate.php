<?php

namespace App\GraphQL\Mutations;

use App\Models\PoolCandidate;

final class RemoveCandidate
{
    /**
     * Marks a candidate as removed from the pool
     */
    public function __invoke($_, array $args)
    {
        $candidate = PoolCandidate::find($args['id']);

        $reason = $args['removalReason'] ?? null;
        $other = $args['removalReasonOther'] ?? null;

        $candidate->remove($reason, $other);

        return $candidate;
    }
}
