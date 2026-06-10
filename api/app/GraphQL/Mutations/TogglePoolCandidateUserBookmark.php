<?php

namespace App\GraphQL\Mutations;

use App\Models\PoolCandidate;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

final class TogglePoolCandidateUserBookmark
{
    /**
     * Toggles a user's bookmarked pool candidate, return a boolean as to whether the bookmark exists or not at the end
     */
    public function __invoke($_, array $args)
    {
        /** @var User | null */
        $user = Auth::user();

        /** @var PoolCandidate */
        $poolCandidate = PoolCandidate::find($args['pool_candidate_id']);

        $user->poolCandidateBookmarks()->toggle($poolCandidate->id);
        return $poolCandidate;
    }
}
