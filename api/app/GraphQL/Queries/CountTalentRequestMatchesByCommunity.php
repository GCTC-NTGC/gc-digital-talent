<?php

namespace App\GraphQL\Queries;

use App\Enums\TalentRequestSource;
use App\Models\Community;
use App\Models\CommunityInterest;
use App\Models\PoolCandidate;
use App\Models\TalentNominationGroup;
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

        // The candidate filter below already establishes the qualifying candidacy, so the user
        // only needs its own attribute filters applied.
        if (in_array(TalentRequestSource::QUALIFIED_IN_POOL, $selected, true)) {
            $subQueries[] = PoolCandidate::query()
                ->whereMatchesTalentRequest($filters)
                ->whereHas('user', fn ($user) => $user->whereUserAttributesMatchTalentRequest($filters))
                ->join('pools', 'pools.id', '=', 'pool_candidates.pool_id')
                ->whereNotNull('pools.community_id')
                ->select('pool_candidates.user_id', 'pools.community_id')
                ->selectRaw("'pool' as source");
        }

        if (in_array(TalentRequestSource::AT_LEVEL, $selected, true)) {
            // whereMatchesTalentRequest already limits to users who fully match, so no second
            // user check is needed here.
            $subQueries[] = CommunityInterest::query()
                ->whereMatchesTalentRequest($applicantFilter)
                ->select('community_interests.user_id', 'community_interests.community_id')
                ->selectRaw("'interest' as source");
        }

        if (in_array(TalentRequestSource::ADVANCEMENT, $selected, true)) {
            // whereMatchesTalentRequest already limits to users who fully match, so no second
            // user check is needed here.
            $subQueries[] = TalentNominationGroup::query()
                ->whereMatchesTalentRequest($applicantFilter)
                ->join('talent_nomination_events', 'talent_nomination_events.id', '=', 'talent_nomination_groups.talent_nomination_event_id')
                ->select('talent_nomination_groups.nominee_id as user_id', 'talent_nomination_events.community_id')
                ->selectRaw("'advancement' as source");
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
