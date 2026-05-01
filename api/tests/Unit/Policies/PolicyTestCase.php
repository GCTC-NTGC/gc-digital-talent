<?php

namespace Tests\Unit\Policies;

use App\Models\Pool;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Auth\Access\Response;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PolicyTestCase extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);
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
            default => $pool->community_id,
        };

        return User::factory()->{$method}($id)->create();
    }
}
