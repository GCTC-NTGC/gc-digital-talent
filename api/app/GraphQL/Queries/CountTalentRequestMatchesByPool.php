<?php

namespace App\GraphQL\Queries;

use App\Models\PoolCandidate;
use Illuminate\Support\Collection;

final class CountTalentRequestMatchesByPool
{
    /**
     * @param  array<string, mixed>  $args
     *
     * @disregard P1003 We are not using this var
     */
    public function __invoke($_, array $args): Collection
    {
        $filters = $args['where'] ?? [];

        // NOTE: PoolCandidateBuilder->whereMatchesTalentRequest will run twice,
        // since it is called here and again from within the call to $user->whereMatchesTalentRequest.
        // While redundant now, this prevents false positives when
        // alternative talent sources are introduced in the future.
        return PoolCandidate::query()
            ->whereMatchesTalentRequest($filters)
            ->whereHas('user', fn ($user) => $user->whereMatchesTalentRequest($filters))
            ->with('pool')
            ->selectRaw('count(distinct user_id) as count, pool_id')
            ->groupBy('pool_id')
            ->get();
    }
}
