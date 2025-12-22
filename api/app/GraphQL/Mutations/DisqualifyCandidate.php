<?php

namespace App\GraphQL\Mutations;

use App\Models\PoolCandidate;

final class DisqualifyCandidate
{
    /**
     * Disqualify operation for a candidate
     */
    public function __invoke($_, array $args)
    {
        $candidate = PoolCandidate::findOrFail($args['id']);
        $reason = $args['reason'];

        $candidate->disqualify($reason);

        return $candidate;
    }
}
