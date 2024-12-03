<?php

namespace App\GraphQL\Mutations;

use App\Models\PoolCandidate;

final class TogglePoolCandidateBookmark
{
    /**
     * Toggles the pool candidates is_bookmarked.
     */
    public function __invoke($_, array $args)
    {
        $candidate = PoolCandidate::find($args['id']);
        $candidate->is_bookmarked = ! $candidate->is_bookmarked;
        $candidate->save();

        return $candidate->is_bookmarked;
    }
}
