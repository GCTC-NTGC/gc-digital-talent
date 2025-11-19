<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
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
            $teamIds = DB::table('role_user')
                ->join('roles', 'roles.id', '=', 'role_user.role_id')
                ->join('permission_role', 'roles.id', '=', 'permission_role.role_id')
                ->join('permissions', 'permission_role.permission_id', '=', 'permissions.id')
                ->where('role_user.user_id', $user->id)
                ->where('permissions.name', 'view-team-poolActivityLog')
                ->pluck('role_user.team_id')
                ->unique()
                ->toArray();

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
