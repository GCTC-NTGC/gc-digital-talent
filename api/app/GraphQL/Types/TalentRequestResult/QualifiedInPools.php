<?php

namespace App\GraphQL\Types\TalentRequestResult;

use App\Models\User;
use Illuminate\Support\Collection;

final class QualifiedInPools
{
    // Only the pools the user qualified in that matched the request. $user->poolCandidates is
    // already constrained to matching candidacies by the eager-load in whereMatchesTalentRequest,
    // so this is the matching pools, not the user's full pool set.
    public function __invoke(User $user): Collection
    {
        return $user->poolCandidates
            ->map(fn ($candidate) => $candidate->pool)
            ->filter()
            ->unique('id')
            ->values();
    }
}
