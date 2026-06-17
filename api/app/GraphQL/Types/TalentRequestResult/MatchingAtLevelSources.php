<?php

namespace App\GraphQL\Types\TalentRequestResult;

use App\Models\User;

final class MatchingAtLevelSources
{
    // no AT_LEVEL sources are computed yet
    public function __invoke(User $user): array
    {
        return [];
    }
}
