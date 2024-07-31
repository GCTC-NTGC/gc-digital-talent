<?php

namespace App\Checkers;

use App\Models\Permission;
use BackedEnum;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Request;
use Laratrust\Checkers\User\UserDefaultChecker;
use Laratrust\Helper;

// This class extends the default user checker to add additional checks for privileged permissions on unprotected requests
class ProtectedRequestUserChecker extends UserDefaultChecker
{
    // these are the role names with limited permissions that can safely be used on unprotected requests
    const LIMITED_ROLES = [
        'guest',
        'base_user',
        'applicant',
    ];

    // decide if it is safe for the current user to use the given role
    protected function isSafeToUseRole(string|array|BackedEnum $name): bool
    {
        $name = Helper::standardize($name);
        $isProtectedRequest = Request::get('isProtectedRequest');

        // if it's a protected request then any role is safe to use
        // if it's a limited (unprivileged) role then it's always safe to use
        return $isProtectedRequest || in_array($name, $this::LIMITED_ROLES);
    }

    // decide if it is safe for the current user to use the given permission
    protected function isSafeToUsePermission(string|array|BackedEnum $permission): bool
    {
        $permission = Helper::standardize($permission);
        $isProtectedRequest = Request::get('isProtectedRequest');

        $limitedPermissions =
        Cache::remember('limitedPermissions', 3600, function () {
            return
          Permission::whereHas('roles', function (Builder $query) {
              $query->whereIn('name', $this::LIMITED_ROLES);
          })->pluck('name')->toArray();
        });

        // if it's a protected request then any permission is safe to use
        // if it's a limited (unprivileged) permission then it's always safe to use
        return $isProtectedRequest || in_array($permission, $limitedPermissions);
    }

    public function currentUserHasRole(
        string|array|BackedEnum $name,
        mixed $team = null,
        bool $requireAll = false
    ): bool {
        if (! $this->isSafeToUseRole($name)) {
            Log::warning('Tried to unsafely use role '.strval($name));

            return false; // user effectively doesn't have role if it is unsafe to use it
        }

        return parent::currentUserHasRole($name, $team, $requireAll);
    }

    public function currentUserHasPermission(
        string|array|BackedEnum $permission,
        mixed $team = null,
        bool $requireAll = false
    ): bool {
        if (! $this->isSafeToUsePermission($permission)) {
            Log::warning('Tried to unsafely use permission '.strval($permission));

            return false; // user effectively doesn't have permission if it is unsafe to use it
        }

        return parent::currentUserHasPermission($permission, $team, $requireAll);
    }
}
