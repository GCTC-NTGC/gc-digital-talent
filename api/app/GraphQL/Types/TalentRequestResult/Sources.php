<?php

namespace App\GraphQL\Types\TalentRequestResult;

use App\Enums\TalentRequestSource;
use App\Models\User;

final class Sources
{
    public function __invoke(User $user): array
    {
        $sources = [];

        if (isset($user->has_prequalified_source) && $user->has_prequalified_source) {
            $sources[] = TalentRequestSource::QUALIFIED_IN_POOL->name;
        }

        return $sources;
    }
}
