<?php

namespace Tests\Unit;

use App\Models\Community;
use App\Models\Department;
use App\Models\Pool;
use App\Models\User;
use App\Traits\ChecksTeamPermissions;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Test class that uses the ChecksTeamPermissions trait for testing
 */
class TestPolicyWithChecksTeamPermissions
{
    use ChecksTeamPermissions;
}

class ChecksTeamPermissionsTraitTest extends TestCase
{
    use RefreshDatabase;

    protected User $adminUser;

    protected User $guestUser;

    protected User $processOperatorUser;

    protected User $communityRecruiterUser;

    protected Pool $pool;

    protected Community $community;

    protected Department $department;

    protected TestPolicyWithChecksTeamPermissions $policy;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);
        // Create community and department
        $this->community = Community::factory()->create();
        $this->department = Department::factory()->create();
        // Create admin user
        $this->adminUser = User::factory()
            ->asAdmin()
            ->create([
                'email' => 'admin@test.com',
                'sub' => 'admin@test.com',
            ]);
        // Create pool with community and department
        $this->pool = Pool::factory()->create([
            'user_id' => $this->adminUser->id,
            'community_id' => $this->community->id,
            'department_id' => $this->department->id,
        ]);
        // Create guest user
        $this->guestUser = User::factory()
            ->asGuest()
            ->create([
                'email' => 'guest@test.com',
                'sub' => 'guest@test.com',
            ]);
        // Create process operator user for the pool
        $this->processOperatorUser = User::factory()
            ->asApplicant()
            ->asProcessOperator($this->pool->id)
            ->create([
                'email' => 'process-operator@test.com',
                'sub' => 'process-operator@test.com',
            ]);
        // Create community recruiter user
        $this->communityRecruiterUser = User::factory()
            ->asApplicant()
            ->asCommunityRecruiter($this->community->id)
            ->create([
                'email' => 'community-recruiter@test.com',
                'sub' => 'community-recruiter@test.com',
            ]);
        $this->policy = new TestPolicyWithChecksTeamPermissions();
    }

    protected function tearDown(): void
    {
        // Clear the cache after each test to ensure isolation
        TestPolicyWithChecksTeamPermissions::clearTeamPermissionCache();
        parent::tearDown();
    }

    public function testGetPoolTeamsReturnsArrayOfTeams(): void
    {
        // Use reflection to access protected method
        $reflection = new \ReflectionClass($this->policy);
        $method = $reflection->getMethod('getPoolTeams');
        // Load pool with teams
        $this->pool->load(['team', 'community.team', 'department.team']);
        $teams = $method->invoke($this->policy, $this->pool);
        $this->assertIsArray($teams);
        $this->assertCount(3, $teams);
    }

    public function testCheckTeamPermissionReturnsFalseForUserWithNoTeamPermission(): void
    {
        // Use reflection to access protected method
        $reflection = new \ReflectionClass($this->policy);
        $method = $reflection->getMethod('checkTeamPermission');
        // Load pool with teams
        $this->pool->load(['team', 'community.team', 'department.team']);
        $getPoolTeamsMethod = $reflection->getMethod('getPoolTeams');
        $teams = $getPoolTeamsMethod->invoke($this->policy, $this->pool);
        $result = $method->invoke($this->policy, $this->guestUser, $teams, 'view-team-draftPool');
        $this->assertFalse($result);
    }

    public function testCheckTeamPermissionReturnsTrueForProcessOperatorOnPoolTeam(): void
    {
        // Use reflection to access protected method
        $reflection = new \ReflectionClass($this->policy);
        $method = $reflection->getMethod('checkTeamPermission');
        // Load pool with teams
        $this->pool->load(['team', 'community.team', 'department.team']);
        $getPoolTeamsMethod = $reflection->getMethod('getPoolTeams');
        $teams = $getPoolTeamsMethod->invoke($this->policy, $this->pool);
        $result = $method->invoke($this->policy, $this->processOperatorUser, $teams, 'view-team-draftPool');
        $this->assertTrue($result);
    }

    public function testCheckTeamPermissionReturnsTrueForCommunityRecruiterOnCommunityTeam(): void
    {
        // Use reflection to access protected method
        $reflection = new \ReflectionClass($this->policy);
        $method = $reflection->getMethod('checkTeamPermission');
        // Load pool with teams
        $this->pool->load(['team', 'community.team', 'department.team']);
        $getPoolTeamsMethod = $reflection->getMethod('getPoolTeams');
        $teams = $getPoolTeamsMethod->invoke($this->policy, $this->pool);
        $result = $method->invoke($this->policy, $this->communityRecruiterUser, $teams, 'view-team-draftPool');
        $this->assertTrue($result);
    }

    public function testCheckTeamPermissionSkipsNullTeams(): void
    {
        // Use reflection to access protected method
        $reflection = new \ReflectionClass($this->policy);
        $method = $reflection->getMethod('checkTeamPermission');
        // Test with array containing nulls
        $teamsWithNulls = [null, null, null];
        $result = $method->invoke($this->policy, $this->adminUser, $teamsWithNulls, 'view-team-draftPool');
        $this->assertFalse($result);
    }

    public function testCheckTeamPermissionCachesResults(): void
    {
        // Clear the cache first
        TestPolicyWithChecksTeamPermissions::clearTeamPermissionCache();
        // Use reflection to access protected method and cache property
        $reflection = new \ReflectionClass($this->policy);
        $method = $reflection->getMethod('checkTeamPermission');
        $cacheProperty = $reflection->getProperty('teamPermissionCache');
        // Load pool with teams
        $this->pool->load(['team', 'community.team', 'department.team']);
        $getPoolTeamsMethod = $reflection->getMethod('getPoolTeams');
        $teams = $getPoolTeamsMethod->invoke($this->policy, $this->pool);
        // Call the method
        $method->invoke($this->policy, $this->processOperatorUser, $teams, 'view-team-draftPool');
        // Check that the cache was populated
        $cache = $cacheProperty->getValue($this->policy);
        $this->assertNotEmpty($cache);
    }

    public function testClearTeamPermissionCacheClearsCache(): void
    {
        // Use reflection to access protected method and cache property
        $reflection = new \ReflectionClass($this->policy);
        $method = $reflection->getMethod('checkTeamPermission');
        $cacheProperty = $reflection->getProperty('teamPermissionCache');
        // Load pool with teams
        $this->pool->load(['team', 'community.team', 'department.team']);
        $getPoolTeamsMethod = $reflection->getMethod('getPoolTeams');
        $teams = $getPoolTeamsMethod->invoke($this->policy, $this->pool);
        // Call the method to populate cache
        $method->invoke($this->policy, $this->processOperatorUser, $teams, 'view-team-draftPool');
        // Clear the cache
        TestPolicyWithChecksTeamPermissions::clearTeamPermissionCache();
        // Check that the cache is empty
        $cache = $cacheProperty->getValue($this->policy);
        $this->assertEmpty($cache);
    }
}
