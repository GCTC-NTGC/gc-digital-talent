<?php

namespace App\Checkers;

use App\Models\Permission;
use BackedEnum;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\Route;
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
    protected function isSafeToUseRole(string|array|BackedEnum $name, bool $requireAll = false): bool
    {
        $name = Helper::standardize($name);

        $isProtectedRequest = Request::get('isProtectedRequest');
        $isNotRoutedRequest = is_null(Route::current());

        $isLimitedRole = $this->isLimited($name, $this::LIMITED_ROLES, $requireAll);

        return
            $isProtectedRequest      // if it's a protected request then any role is safe to use
            || $isLimitedRole        // if it's a limited (unprivileged) role then it's always safe to use
            || $isNotRoutedRequest;  // if it's not a routed request (Tinker, scheduled job) then any role is safe to use
    }

    // decide if it is safe for the current user to use the given permission
    protected function isSafeToUsePermission(string|array|BackedEnum $permission, bool $requireAll = false): bool
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

        $isLimitedPermission = $this->isLimited($permission, $limitedPermissions, $requireAll);
        $isNotRoutedRequest = is_null(Route::current());

        return $isProtectedRequest  // if it's a protected request then any permission is safe to use
        || $isLimitedPermission     // if it's a limited (unprivileged) permission then it's always safe to use
        || $isNotRoutedRequest;     // if it's not a routed request (Tinker, scheduled job) then any role is safe to use
    }

    public function currentUserHasRole(
        string|array|BackedEnum $name,
        mixed $team = null,
        bool $requireAll = false
    ): bool {
        if (! $this->isSafeToUseRole($name, $requireAll)) {
            Log::debug('Tried to unsafely use role '.json_encode($name));

            return false; // user effectively doesn't have role if it is unsafe to use it
        }

        return parent::currentUserHasRole($name, $team, $requireAll);
    }

    public function currentUserHasPermission(
        string|array|BackedEnum $permission,
        mixed $team = null,
        bool $requireAll = false
    ): bool {
        if (! $this->isSafeToUsePermission($permission, $requireAll)) {
            Log::debug('Tried to unsafely use permission '.json_encode($permission));

            return false; // user effectively doesn't have permission if it is unsafe to use it
        }

        return parent::currentUserHasPermission($permission, $team, $requireAll);
    }

    private function isLimited(string|array|BackedEnum $needle, array $haystack, bool $requireAll = false)
    {
        $needleCollection = collect(Arr::wrap($needle));
        $haystackCollection = collect($haystack);
        $compareFn = fn (string $name) => $haystackCollection->contains($name);

        if ($requireAll) {
            return $needleCollection->every($compareFn);
        }

        return $needleCollection->some($compareFn);
    }
}
