<?php

namespace App\GraphQL\Queries;

use App\Enums\TalentRequestSource;
use App\Models\Community;
use App\Models\CommunityInterest;
use App\Models\PoolCandidate;
use App\Models\User;
use Illuminate\Support\Collection;

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

        $poolCommunityIds = in_array(TalentRequestSource::QUALIFIED_IN_POOL, $selected, true)
            ? PoolCandidate::query()
                ->whereMatchesTalentRequest($filters)
                ->whereHas('user', fn ($user) => $user->whereMatchesTalentRequest($filters))
                ->join('pools', 'pools.id', '=', 'pool_candidates.pool_id')
                ->whereNotNull('pools.community_id')
                ->distinct()
                ->pluck('pools.community_id')
            : collect();

        $interestCommunityIds = in_array(TalentRequestSource::AT_LEVEL, $selected, true)
            ? CommunityInterest::query()
                ->whereMatchesTalentRequest($applicantFilter)
                ->distinct()
                ->pluck('community_id')
            : collect();

        $communityIds = $poolCommunityIds->merge($interestCommunityIds)->unique()->values();

        return $communityIds->map(function ($communityId) use ($applicantFilter) {
            $scoped = array_merge($applicantFilter, ['community' => $communityId]);

            $qualifiedInPoolCount = User::query()->whereMatchesTalentRequest([
                'applicantFilter' => array_merge($scoped, ['talentSources' => [TalentRequestSource::QUALIFIED_IN_POOL->name]]),
            ])->count();

            $atLevelCount = User::query()->whereMatchesTalentRequest([
                'applicantFilter' => array_merge($scoped, ['talentSources' => [TalentRequestSource::AT_LEVEL->name]]),
            ])->count();

            // Uses the real (unforced) talentSources selection, so this is the
            // deduplicated OR-of-selected-sources total for this community.
            $count = User::query()->whereMatchesTalentRequest([
                'applicantFilter' => $scoped,
            ])->count();

            return (object) [
                'community' => Community::find($communityId),
                'qualifiedInPoolCount' => $qualifiedInPoolCount,
                'atLevelCount' => $atLevelCount,
                'count' => $count,
            ];
        });
    }
}
