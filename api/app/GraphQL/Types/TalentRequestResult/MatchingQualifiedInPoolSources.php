<?php

namespace App\GraphQL\Types\TalentRequestResult;

use App\Models\User;
use Illuminate\Support\Collection;

final class MatchingQualifiedInPoolSources
{
    // poolCandidates is eager-loaded already constrained to the matched, view-authorized candidacies
    public function __invoke(User $user): Collection
    {
        return $user->poolCandidates;
    }
}
