<?php

namespace App\GraphQL\Types\TalentRequestTrackedUser;

use App\Enums\TalentRequestSource;
use App\Models\TalentRequestTrackedUser;
use GraphQL\Type\Definition\ResolveInfo;

final class MatchingSources
{
    // each matching*Sources field name is the User relation name for that source
    public function __invoke(TalentRequestTrackedUser $trackedUser, array $args, $context, ResolveInfo $info): iterable
    {
        $isImplemented = collect(TalentRequestSource::cases())
            ->contains(fn (TalentRequestSource $source) => $source->matchRelation() === $info->fieldName);

        if (! $isImplemented) {
            return [];
        }

        return $trackedUser->user->talentRequestSourceMatches(
            $info->fieldName,
            $trackedUser->talentRequest->applicantFilter?->toMatchFilters() ?? []
        );
    }
}
