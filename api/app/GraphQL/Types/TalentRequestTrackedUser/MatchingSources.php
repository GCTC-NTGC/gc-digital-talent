<?php

namespace App\GraphQL\Types\TalentRequestTrackedUser;

use App\Enums\TalentRequestSource;
use App\GraphQL\BatchLoaders\MatchingSourcesBatchLoader;
use App\Models\TalentRequestTrackedUser;
use GraphQL\Deferred;
use GraphQL\Type\Definition\ResolveInfo;
use Nuwave\Lighthouse\Execution\BatchLoader\BatchLoaderRegistry;

final class MatchingSources
{
    // each matching*Sources field name is the User relation name for that source
    public function __invoke(TalentRequestTrackedUser $trackedUser, array $args, $context, ResolveInfo $info): Deferred|iterable
    {
        $isImplemented = collect(TalentRequestSource::cases())
            ->contains(fn (TalentRequestSource $source) => $source->matchRelation() === $info->fieldName);

        if (! $isImplemented) {
            return [];
        }

        $filters = $trackedUser->talentRequest->applicantFilter?->toMatchFilters() ?? [];

        // Batch every row's lookup for this field into one query (issue #17468).
        $loader = BatchLoaderRegistry::instance(
            $info->path,
            fn () => new MatchingSourcesBatchLoader($info->fieldName, $filters),
        );

        return $loader->load($trackedUser);
    }
}
