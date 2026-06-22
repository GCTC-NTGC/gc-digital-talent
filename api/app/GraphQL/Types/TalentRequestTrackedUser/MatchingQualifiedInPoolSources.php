<?php

namespace App\GraphQL\Types\TalentRequestTrackedUser;

use App\Models\TalentRequestTrackedUser;
use Illuminate\Support\Collection;

final class MatchingQualifiedInPoolSources
{
    // qualifiedPoolCandidates is pre-loaded by scopeWithMatchingQualifiedInPoolSources
    public function __invoke(TalentRequestTrackedUser $trackedUser): Collection
    {
        return $trackedUser->qualifiedPoolCandidates;
    }
}
