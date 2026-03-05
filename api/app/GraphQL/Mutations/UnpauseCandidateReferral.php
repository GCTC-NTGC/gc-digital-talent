<?php

namespace App\GraphQL\Mutations;

use App\Models\PoolCandidate;

final class UnpauseCandidateReferral
{
    /**
     * Unpause referrals for a candidate
     */
    public function __invoke($_, array $args)
    {
        $candidate = PoolCandidate::findOrFail($args['id']);

        $candidate->unpauseReferral();

        return $candidate;
    }
}
