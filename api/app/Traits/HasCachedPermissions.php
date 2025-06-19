<?php

namespace App\Traits;

use Illuminate\Support\Facades\Cache;

trait HasCachedPermissions
{
    /**
     * Check if the user has a specific permission within a team context, with caching.
     */
    public function isAbleToWithCache(string $permission, ?string $teamId = null): bool
    {
        // Generate a unique cache key
        $cacheKey = $this->generateCacheKey($permission, $teamId);

        // Check if the result is already cached
        return Cache::tags($this->generateCacheTags($teamId))->remember($cacheKey, now()->addMinutes(30), function () use ($permission, $teamId) {
            // Perform the actual permission check using Laratrust
            return $this->isAbleTo($permission, $teamId ? $this->getTeam($teamId) : null);
        });
    }

    /**
     * Generate a cache key for permission checks.
     */
    protected function generateCacheKey(string $permission, ?string $teamId): string
    {
        $teamKey = $teamId ? "team:{$teamId}" : 'team:none';

        return "permission:{$permission}:{$teamKey}";
    }

    /**
     * Generate cache tags for permission checks.
     */
    protected function generateCacheTags(?string $teamId): array
    {
        $tags = ["user:{$this->id}"];
        if ($teamId) {
            $tags[] = "team:{$teamId}";
        }

        return $tags;
    }

    /**
     * Clear cached permissions for a user and team.
     */
    public function clearPermissionCache(?string $teamId = null): void
    {
        $tags = $this->generateCacheTags($teamId);

        // Flush all cache entries related to the user and team
        Cache::tags($tags)->flush();
    }

    /**
     * Get the team model by ID.
     *
     * @return \App\Models\Team
     */
    protected function getTeam(string $teamId)
    {
        return \App\Models\Team::findOrFail($teamId);
    }
}
