<?php

namespace App\Builders;

use App\Contracts\TalentRequestMatchable;
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
        $qualifiedInClassifications = $filters['qualifiedInClassifications'] ?? null;

        if (! empty($qualifiedInClassifications)) {
            $this->whereHas('user', function (UserBuilder $userQuery) use ($qualifiedInClassifications) {
                $userQuery->whereHas('currentClassification', function (Builder $classQuery) use ($qualifiedInClassifications) {
                    $classQuery->where(function (Builder $q) use ($qualifiedInClassifications) {
                        foreach ($qualifiedInClassifications as $classification) {
                            $q->orWhere(function (Builder $q) use ($classification) {
                                $q->where('group', $classification['group'])
                                    ->where('level', $classification['level']);
                            });
                        }
                    });
                })->whereIsVerifiedGovEmployee();
            });
        }

        $community = $filters['community'] ?? null;
        $communityId = is_array($community) ? ($community['id'] ?? null) : $community;

        $this->workStreams(array_column($filters['qualifiedInWorkStreams'] ?? [], 'id'));
        $this->communities($communityId ? [$communityId] : null);
        $this->where('consent_to_share_profile', true);

        return $this;
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
