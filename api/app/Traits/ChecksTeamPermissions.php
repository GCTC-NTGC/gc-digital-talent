<?php

declare(strict_types=1);

namespace App\Traits;

use App\Models\Pool;
use App\Models\Team;
use App\Models\User;

/**
 * Trait for centralizing team permission checks across policies.
 *
 * This trait provides methods for checking if a user has a specific permission
 * on any team related to a model (pool team, community team, or department team).
 * It includes per-request caching to improve performance when the same permission
 * check is performed multiple times during a single request.
 */
trait ChecksTeamPermissions
{
    /**
     * Per-request cache for permission checks.
     * Static variable is reset on each new PHP request.
     *
     * @var array<string, bool>
     */
    protected static array $teamPermissionCache = [];

    /**
     * Check if user has permission on any of the provided teams.
     *
     * @param  User  $user  The user to check permissions for
     * @param  array<Team|null>  $teams  Array of teams to check (null values are skipped)
     * @param  string  $permission  The permission to check
     * @return bool True if user has permission on any team, false otherwise
     */
    protected function checkTeamPermission(User $user, array $teams, string $permission): bool
    {
        foreach ($teams as $team) {
            if (is_null($team)) {
                continue;
            }

            $cacheKey = "{$user->id}_{$team->id}_{$permission}";

            if (! array_key_exists($cacheKey, static::$teamPermissionCache)) {
                static::$teamPermissionCache[$cacheKey] = $user->isAbleTo($permission, $team);
            }

            if (static::$teamPermissionCache[$cacheKey]) {
                return true;
            }
        }

        return false;
    }

    /**
     * Get teams from a Pool model for permission checking.
     *
     * Returns an array of teams associated with the pool (pool team, community team, department team).
     * Null values are included in the array and will be skipped during permission checking.
     *
     * @param  Pool  $pool  The pool to extract teams from
     * @return array<Team|null>
     */
    protected function getPoolTeams(Pool $pool): array
    {
        return [
            $pool->team,
            $pool->community?->team,
            $pool->department?->team,
        ];
    }

    /**
     * Clear the per-request team permission cache.
     *
     * Useful for testing scenarios where you need to reset the cache state.
     */
    public static function clearTeamPermissionCache(): void
    {
        static::$teamPermissionCache = [];
    }
}
