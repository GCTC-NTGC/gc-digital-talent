<?php

namespace App\Support;

use App\Models\Permission;
use BackedEnum;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\Route;

// Decides if a role or permission may be used on the current request: privileged ones only on protected requests
class ProtectedRequestGuard
{
    // these are the role names with limited permissions that can safely be used on unprotected requests
    const LIMITED_ROLES = [
        'base_user',
    ];

    // decide if it is safe for the current user to use the given role
    public static function isSafeToUseRole(string|array|BackedEnum $name, bool $requireAll = false): bool
    {
        $name = self::standardize($name);

        $isProtectedRequest = Request::instance()->attributes->get('isProtectedRequest');
        $isNotRoutedRequest = is_null(Route::current());

        $isLimitedRole = self::isLimited($name, self::LIMITED_ROLES, $requireAll);

        return
            $isProtectedRequest      // if it's a protected request then any role is safe to use
            || $isLimitedRole        // if it's a limited (unprivileged) role then it's always safe to use
            || $isNotRoutedRequest;  // if it's not a routed request (Tinker, scheduled job) then any role is safe to use
    }

    // decide if it is safe for the current user to use the given permission
    public static function isSafeToUsePermission(string|array|BackedEnum $permission, bool $requireAll = false): bool
    {
        $permission = self::standardize($permission);

        $isProtectedRequest = Request::instance()->attributes->get('isProtectedRequest');
        $limitedPermissions =
        Cache::remember('limitedPermissions', 3600, function () {
            return
          Permission::whereHas('roles', function (Builder $query) {
              $query->whereIn('name', self::LIMITED_ROLES);
          })->pluck('name')->toArray();
        });

        $isLimitedPermission = self::isLimited($permission, $limitedPermissions, $requireAll);
        $isNotRoutedRequest = is_null(Route::current());

        return $isProtectedRequest  // if it's a protected request then any permission is safe to use
        || $isLimitedPermission     // if it's a limited (unprivileged) permission then it's always safe to use
        || $isNotRoutedRequest;     // if it's not a routed request (Tinker, scheduled job) then any role is safe to use
    }

    // enums to their values and pipe-separated names to a list, as Laratrust 8's Helper::standardize did
    private static function standardize(string|array|BackedEnum $value): string|array
    {
        if ($value instanceof BackedEnum) {
            return $value->value;
        }

        if (is_array($value)) {
            return array_map(fn ($item) => $item instanceof BackedEnum ? $item->value : $item, $value);
        }

        return str_contains($value, '|') ? explode('|', $value) : $value;
    }

    private static function isLimited(string|array|BackedEnum $needle, array $haystack, bool $requireAll = false)
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
