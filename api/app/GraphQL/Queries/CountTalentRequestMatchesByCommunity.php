<?php

namespace App\GraphQL\Queries;

use App\Enums\TalentRequestSource;
use App\Models\Community;
use App\Models\CommunityInterest;
use App\Models\PoolCandidate;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

final class CountTalentRequestMatchesByCommunity
{
    /**
     * @param  array<string, mixed>  $args
     *
     * @disregard P1003 We are not using this var
     */
    public function __invoke($_, array $args): Collection
    {
        $filters = $args['where'] ?? [];
        // CommunityInterestBuilder::whereMatchesTalentRequest expects the applicant
        // filter directly, unlike PoolCandidateBuilder/UserBuilder which both accept
        // either shape and unwrap `applicantFilter` themselves.
        $applicantFilter = $filters['applicantFilter'] ?? $filters;
        $selected = TalentRequestSource::selected($applicantFilter['talentSources'] ?? null);

        // Build one (user_id, community_id, source) row per matching candidacy/interest,
        // then aggregate by community in a single grouped query below — avoids running
        // separate User::whereMatchesTalentRequest() counts per community (N+1).
        /** @var Builder[] $subQueries */
        $subQueries = [];

        // NOTE: PoolCandidateBuilder->whereMatchesTalentRequest will run twice,
        // since it is called here and again from within the call to $user->whereMatchesTalentRequest.
        // While redundant now, this prevents false positives when
        // alternative talent sources are introduced in the future (mirrors
        // CountTalentRequestMatchesByPool).
        if (in_array(TalentRequestSource::QUALIFIED_IN_POOL, $selected, true)) {
            $subQueries[] = PoolCandidate::query()
                ->whereMatchesTalentRequest($filters)
                ->whereHas('user', fn ($user) => $user->whereMatchesTalentRequest($filters))
                ->join('pools', 'pools.id', '=', 'pool_candidates.pool_id')
                ->whereNotNull('pools.community_id')
                ->select('pool_candidates.user_id', 'pools.community_id')
                ->selectRaw("'pool' as source");
        }

        if (in_array(TalentRequestSource::AT_LEVEL, $selected, true)) {
            $subQueries[] = CommunityInterest::query()
                ->whereMatchesTalentRequest($applicantFilter)
                ->whereHas('user', fn ($user) => $user->whereMatchesTalentRequest($filters))
                ->select('community_interests.user_id', 'community_interests.community_id')
                ->selectRaw("'interest' as source");
        }

        if (empty($subQueries)) {
            return collect();
        }

        $combined = array_shift($subQueries);
        foreach ($subQueries as $subQuery) {
            $combined->unionAll($subQuery);
        }

        $counts = DB::query()
            ->fromSub($combined, 'matches')
            ->selectRaw('community_id')
            ->selectRaw("count(distinct case when source = 'pool' then user_id end) as qualified_in_pool_count")
            ->selectRaw("count(distinct case when source = 'interest' then user_id end) as at_level_count")
            ->selectRaw('count(distinct user_id) as count')
            ->groupBy('community_id')
            ->get();

        $communities = Community::whereIn('id', $counts->pluck('community_id'))
            ->get()
            ->keyBy('id');

        return $counts->map(fn ($row) => (object) [
            'community' => $communities->get($row->community_id),
            'qualifiedInPoolCount' => (int) $row->qualified_in_pool_count,
            'atLevelCount' => (int) $row->at_level_count,
            'count' => (int) $row->count,
        ]);
    }
}
