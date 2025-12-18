<?php

namespace App\GraphQL\Mutations;

use App\Models\PoolCandidate;
use Illuminate\Support\Facades\Auth;

final class TogglePoolCandidateUserBookmark
{
    /**
     * Toggles a user's bookmarked pool candidate, return a boolean as to whether the bookmark exists or not at the end
     */
    public function __invoke($_, array $args)
    {
        /** @var \App\Models\User | null */
        $user = Auth::user();

        /** @var \App\Models\PoolCandidate */
        $poolCandidate = PoolCandidate::find($args['pool_candidate_id']);

        $executeToggle = $user->poolCandidateBookmarks()->toggle($poolCandidate->id);

        $isNowBookmarked = $executeToggle && $executeToggle['attached'] && count($executeToggle['attached']) > 0;

        return $isNowBookmarked;
    }
}
