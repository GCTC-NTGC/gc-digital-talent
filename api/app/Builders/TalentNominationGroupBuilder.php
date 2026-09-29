<?php

namespace App\Builders;

use App\Contracts\TalentNominationGroupMatchable;
use App\Enums\TalentNominationGroupDecision;
use App\Models\TalentNominationGroup;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Query\Builder as QueryBuilder;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

/**
 * @extends Builder<TalentNominationGroup>
 *
 * @mixin TalentNominationGroup
 */
class TalentNominationGroupBuilder extends Builder implements TalentNominationGroupMatchable
{
    // TalentRequestSource::matchMethod() routes ADVANCEMENT/LATERAL_MOVEMENT to these two.
    public function whereMatchesTalentRequestForAdvancement(?array $filters): self
    {
        return $this->whereMatchesTalentRequestForNominationType($filters, 'advancement');
    }

    public function whereMatchesTalentRequestForLateralMovement(?array $filters): self
    {
        return $this->whereMatchesTalentRequestForNominationType($filters, 'lateral_movement');
    }

    // Shared query for both methods above — a TalentNominationGroup row holds decision, expiry,
    // and classifications for both nomination types on the same table, differing only by column
    // prefix and classifications relation name.
    private function whereMatchesTalentRequestForNominationType(?array $filters, string $nominationType): self
    {
        $filters ??= [];
        $community = $filters['community'] ?? null;
        $communityId = is_array($community) ? ($community['id'] ?? null) : $community;
        $qualifiedInClassifications = $filters['qualifiedInClassifications'] ?? null;
        $classificationsRelation = Str::camel($nominationType).'Classifications';

        $nomineeIds = $this->matchingNomineeIds($filters);

        // Match the ids as one Postgres array value, so the number of ids has no limit.
        $nomineeIdArray = '{'.$nomineeIds->implode(',').'}';

        return $this
            ->whereRaw('talent_nomination_groups.nominee_id = any(?::uuid[])', [$nomineeIdArray])
            ->where("{$nominationType}_decision", TalentNominationGroupDecision::APPROVED->name)
            // A past referral_expiry_date excludes the match — "current or past" in the source
            // ticket actually meant "not yet expired" (confirmed with product).
            ->whereDate("{$nominationType}_referral_expiry_date", '>=', now())
            ->whereExists(function (QueryBuilder $query) {
                $query->select('community_interests.id')
                    ->from('community_interests')
                    ->join('talent_nomination_events', 'talent_nomination_events.community_id', '=', 'community_interests.community_id')
                    ->whereColumn('talent_nomination_events.id', 'talent_nomination_groups.talent_nomination_event_id')
                    ->whereColumn('community_interests.user_id', 'talent_nomination_groups.nominee_id')
                    ->where('community_interests.consent_to_share_profile', true);
            })
            ->when($communityId, function (Builder $query) use ($communityId) {
                $query->whereHas('talentNominationEvent', fn ($eventQuery) => $eventQuery->where('community_id', $communityId));
            })
            ->when($qualifiedInClassifications, function (Builder $query, array $classifications) use ($classificationsRelation) {
                $query->whereHas($classificationsRelation, function (Builder $classQuery) use ($classifications) {
                    $classQuery->where(function (Builder $q) use ($classifications) {
                        foreach ($classifications as $classification) {
                            $q->orWhere(function (Builder $q) use ($classification) {
                                $q->where('group', $classification['group'])
                                    ->where('level', $classification['level']);
                            });
                        }
                    });
                });
            });
    }

    // Same for every nomination type, so safe to memoize per request.
    private function matchingNomineeIds(array $filters)
    {
        $cacheKey = 'matchingNomineeIds:'.md5(serialize($filters));

        return Cache::memo('array')->remember($cacheKey, null, function () use ($filters) {
            $community = $filters['community'] ?? null;
            $communityId = is_array($community) ? ($community['id'] ?? null) : $community;
            $workStreamIds = array_column($filters['qualifiedInWorkStreams'] ?? [], 'id');

            return User::query()
                ->whereIsVerifiedGovEmployee()
                ->whereUserAttributesMatchTalentRequest($filters)
                ->whereHas('communityInterests', function (Builder $query) use ($communityId, $workStreamIds) {
                    /** @var CommunityInterestBuilder $query */
                    $query->communities($communityId ? [$communityId] : null)
                        ->workStreams($workStreamIds)
                        // The interest row establishing eligibility must itself be consenting —
                        // it's the evidence for the match, so another interest's consent doesn't
                        // cover it.
                        ->where('consent_to_share_profile', true);
                })
                ->pluck('id');
        });
    }

    // scope the query to TalentNominationGroups the current user can view
    public function whereAuthorizedToView(?array $args = null): self
    {
        $this->authorizedToView($args);

        return $this;
    }
}
