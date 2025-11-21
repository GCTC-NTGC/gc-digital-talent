<?php

namespace App\Models;

use Database\Helpers\TeamHelpers;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Auth;
use Spatie\Activitylog\Models\Activity as SpatieActivity;

class Activity extends SpatieActivity
{
    protected $keyType = 'string';

    public function scopeAuthorizedToViewPoolActivity(Builder $query)
    {
        /** @var \App\Models\User | null */
        $user = Auth::user();

        $query->where('subject_type', Pool::class);

        if ($user?->isAbleTo('view-any-poolActivityLog')) {
            return $query;
        }

        if ($user?->isAbleTo('view-team-poolActivityLog')) {
            $teamIds = TeamHelpers::getTeamIdsForPermission($user, 'view-team-poolActivityLog');

            return $query->whereHasMorph(
                'subject',
                [Pool::class],
                function ($poolQuery) use ($teamIds) {
                    return $poolQuery->where(function (Builder $query) use ($teamIds) {
                        $query->orWhereHas('team', function (Builder $query) use ($teamIds) {
                            return $query->whereIn('id', $teamIds);
                        })->orWhereHas('community.team', function (Builder $query) use ($teamIds) {
                            return $query->whereIn('id', $teamIds);
                        });
                    });
                }
            );
        }

        return $query->where('id', null);
    }
}
