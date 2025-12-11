<?php

namespace App\GraphQL\Mutations;

use App\Models\PoolCandidate;
use Illuminate\Support\Facades\Auth;

final class TogglePoolCandidateUserBookmark
{
    /**
     * Toggles a user's bookmarked pool candidate
     */
    public function __invoke($_, array $args)
    {
        /** @var \App\Models\User | null */
        $user = Auth::user();

        /** @var \App\Models\PoolCandidate */
        $poolCandidate = PoolCandidate::find($args['pool_candidate_id']);

        $user->poolCandidateBookmarks()->toggle($poolCandidate->id);

        return $poolCandidate;
    }
}
