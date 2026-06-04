<?php

namespace App\GraphQL\Types\TalentRequestResult;

use App\Enums\TalentRequestSource;
use App\Models\User;

final class Sources
{
    // The sources that made this user a match. Today every match comes via a qualified,
    // talent-searchable candidacy (PREQUALIFIED); AT_LEVEL / ADVANCEMENT are added once
    // their community-interest / nomination data is wired as additional sources.
    public function __invoke(User $user): array
    {
        return [TalentRequestSource::PREQUALIFIED->name];
    }
}
