<?php

namespace Tests\Unit\Policies;

use App\Models\Pool;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Exception;
use Illuminate\Auth\Access\Response;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Tests\TestCase;

class PolicyTestCase extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);

        Cache::store('array')->clear();
    }

    /**
     * Helper to safely convert Response|bool into a boolean value.
     *
     * Handles cases where we use Response::deny instead of a bool
     */
    protected function ensureBool(Response|bool $result): bool
    {
        return is_bool($result) ? $result : $result->allowed();
    }

    protected function createContextualUser(string $method, Pool $pool): User
    {
        if (in_array($method, ['asAdmin', 'asGuest', 'asApplicant'])) {
            return User::factory()->{$method}()->create();
        }

        $id = match ($method) {
            'asProcessOperator' => $pool->id,
            'asDepartmentAdmin', 'asDepartmentHRAdvisor' => $pool->department_id,
            'asCommunityRecruiter', 'asCommunityAdmin', 'asCommunityTalentCoordinator', 'asAdmin' => $pool->community_id,
            default => throw new Exception("Cannot create contextual user with method '{$method}' for pool '{$pool->id}'."),
        };

        return User::factory()->{$method}($id)->create();
    }

    /**
     * General provider for test cases map
     * for user factory role methods
     *
     * NOTE: Does not include talent coordinator since
     * they have fewer permissions not aligned with
     * this group
     */
    public static function allTeamRolesProvider(): array
    {
        return [
            'process operator' => ['asProcessOperator'],
            'community recruiter' => ['asCommunityRecruiter'],
            'community admin' => ['asCommunityAdmin'],
            'department admin' => ['asDepartmentAdmin'],
            'department HR advisor' => ['asDepartmentHRAdvisor'],
        ];
    }
}
