<?php

namespace App\GraphQL\Types\TalentRequestTrackedUser;

use App\GraphQL\BatchLoaders\SourcesBatchLoader;
use App\Models\TalentRequestTrackedUser;
use GraphQL\Deferred;
use GraphQL\Type\Definition\ResolveInfo;
use Nuwave\Lighthouse\Execution\BatchLoader\BatchLoaderRegistry;

final class Sources
{
    public function __invoke(TalentRequestTrackedUser $trackedUser, array $args, $context, ResolveInfo $info): Deferred
    {
        $filters = $trackedUser->talentRequest->applicantFilter?->toMatchFilters() ?? [];

        $loader = BatchLoaderRegistry::instance(
            [...$info->path, $trackedUser->talent_request_id],
            fn () => new SourcesBatchLoader($filters),
        );

        return $loader->load($trackedUser);
    }
}
