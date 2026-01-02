<?php

namespace App\GraphQL\Mutations;

use App\Models\PoolCandidate;

final class RevertFinalDecision
{
    /**
     * Reverting the qualify or disqualify candidate operations
     */
    public function __invoke($_, array $args)
    {
        $candidate = PoolCandidate::findOrFail($args['id']);

        $candidate->revertFinalDecision();

        return $candidate;
    }
}
