<?php

namespace App\Builders;

use App\Contracts\TalentRequestMatchable;
use App\Enums\CommunityReferralStatus;
use App\Models\Community;
use App\Models\CommunityInterest;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Auth;

/**
 * @extends Builder<CommunityInterest>
 *
 * @mixin CommunityInterest
 */
class CommunityInterestBuilder extends Builder implements TalentRequestMatchable
{
    public function whereMatchesTalentRequest(?array $filters): self
    {
        $filters ??= [];
        $community = $filters['community'] ?? null;
        $communityId = is_array($community) ? ($community['id'] ?? null) : $community;

        return $this->where('referral_status', '!=', CommunityReferralStatus::NOT_REFERRED->name)
            ->where(function (Builder $q) use ($filters) {
                $q->orWhere(function (Builder $pendingQuery) use ($filters) {

                    $userIds = $this->atLevelUserIds($filters);

                    // Match the ids as one Postgres array value, so the number of ids has no limit.
                    $userIdArray = '{'.$userIds->implode(',').'}';

                    $pendingQuery->whereIn('referral_status', [CommunityReferralStatus::NEW->name, CommunityReferralStatus::PENDING->name])
                        ->whereRaw('community_interests.user_id = any(?::uuid[])', [$userIdArray]);
                })->orWhere(function (Builder $availableQuery) use ($filters) {
                    $qualifiedInClassifications = $filters['qualifiedInClassifications'] ?? null;

                    $userIds = $this->atLevelUserIds($filters, atRequestedClassification: false);
                    $userIdArray = '{'.$userIds->implode(',').'}';

                    $availableQuery->where('referral_status', CommunityReferralStatus::AVAILABLE_FOR_REFERRAL->name)
                        ->whereRaw('community_interests.user_id = any(?::uuid[])', [$userIdArray])
                        ->when($qualifiedInClassifications, function (Builder $query, array $classifications) {
                            $query->whereHas('referralClassification', $this->matchesAClassification($classifications));
                        });
                });
            })
            ->workStreams(array_column($filters['qualifiedInWorkStreams'] ?? [], 'id'))
            ->communities($communityId ? [$communityId] : null)
            ->where('consent_to_share_profile', true);
    }

    // Ids of the users who match "at level": verified gov employees at a requested classification
    // who also pass the request's user-level filters. Because these ids carry the full user match,
    // callers do not need a second user check.
    private function atLevelUserIds(array $filters, bool $atRequestedClassification = true)
    {
        $qualifiedInClassifications = $atRequestedClassification
            ? $filters['qualifiedInClassifications'] ?? null
            : null;

        return User::query()
            ->whereIsVerifiedGovEmployee()
            ->whereUserAttributesMatchTalentRequest($filters)
            ->when($qualifiedInClassifications, fn (Builder $query, array $classifications) => $query
                ->whereHas('currentClassification', $this->matchesAClassification($classifications)))
            ->pluck('id');
    }

    private function matchesAClassification(array $classifications): callable
    {
        return fn (Builder $query) => $query->where(function (Builder $anyOf) use ($classifications) {
            foreach ($classifications as $classification) {
                $anyOf->orWhere(fn (Builder $match) => $match
                    ->where('group', $classification['group'])
                    ->where('level', $classification['level']));
            }
        });
    }

    // scope the query to CommunityInterests the current user can view
    // own interest or belongs to your community and consentToShareProfile is TRUE
    public function whereAuthorizedToView(?array $args = null): self
    {
        /** @var User | null */
        $user = Auth::user();

        if (isset($args['userId'])) {
            $user = User::findOrFail($args['userId']);
        }

        // can see any community interest - return with no filters added
        if ($user?->isAbleTo('view-any-communityInterest')) {
            return $this;
        }

        // we might want to add some filters for some candidates
        $filterCountBefore = count($this->getQuery()->wheres);
        $this->where(function (Builder $query) use ($user) {

            // the user might be able to view their own interests
            if ($user?->isAbleTo('view-own-employeeProfile')) {
                $query->orWhere('user_id', $user->id);
            }

            // the user might be able to view their communities' interests
            if ($user?->isAbleTo('view-team-communityInterest')) {
                $query->orWhere(function (Builder $query) use ($user) {

                    // all community teams that the user is a member in
                    $allCommunityTeams = $user->rolesTeams()
                        ->where('teamable_type', Community::class)
                        ->get();

                    // filter community teams down to those where the user also has permission to see the interests
                    $viewPermissionCommunityTeams = $allCommunityTeams
                        ->filter(fn ($team) => $user->isAbleTo('view-team-communityInterest', $team));

                    $query->whereIn('community_id', $viewPermissionCommunityTeams->pluck('teamable_id')->toArray());
                    $query->where('consent_to_share_profile', true);
                });
            }
        });

        $filterCountAfter = count($this->getQuery()->wheres);
        if ($filterCountAfter > $filterCountBefore) {
            return $this;
        }

        // fall through - query will return nothing
        return $this->where('id', null);
    }
}
