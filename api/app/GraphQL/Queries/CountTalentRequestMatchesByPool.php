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

        // count the matching users per pool: a candidacy that matches the request whose user
        // also matches it overall. Same scopes as talentRequestMatches, so the totals agree.
        return PoolCandidate::query()
            ->whereMatchesTalentRequest($filters)
            ->whereHas('user', fn ($user) => $user->whereMatchesTalentRequest($filters))
            ->with('pool')
            ->selectRaw('count(distinct user_id) as count, pool_id')
            ->groupBy('pool_id')
            ->get();
    }
}
