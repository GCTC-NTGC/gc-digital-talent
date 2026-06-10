<?php

namespace App\GraphQL\Types\TalentRequestResult;

use App\Models\User;

final class MatchingAdvancementSources
{
    // no ADVANCEMENT sources are computed yet
    public function __invoke(User $user): array
    {
        return [];
    }
}
