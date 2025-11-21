<?php

namespace Database\Helpers;

use App\Models\User;
use Illuminate\Support\Facades\DB;

class TeamHelpers
{
    /**
     * Get the team ID for a team based permission where
     * the user has that permission.
     */
    public static function getTeamIdsForPermission(User $user, string $permission)
    {
        return DB::table('role_user')
            ->join('roles', 'roles.id', '=', 'role_user.role_id')
            ->join('permission_role', 'roles.id', '=', 'permission_role.role_id')
            ->join('permissions', 'permission_role.permission_id', '=', 'permissions.id')
            ->where('role_user.user_id', $user->id)
            ->where('permissions.name', $permission)
            ->pluck('role_user.team_id')
            ->unique()
            ->toArray();
    }
}
