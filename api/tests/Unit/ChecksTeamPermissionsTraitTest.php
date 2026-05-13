<?php

namespace Tests\Unit;

use App\Models\Community;
use App\Models\Department;
use App\Models\Pool;
use App\Models\User;
use App\Traits\ChecksTeamPermissions;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

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

        $this->community = Community::factory()->create();
        $this->department = Department::factory()->create();
        $this->adminUser = User::factory()->asAdmin()->create();

        $this->pool = Pool::factory()->create([
            'user_id' => $this->adminUser->id,
            'community_id' => $this->community->id,
            'department_id' => $this->department->id,
        ]);

        $this->guestUser = User::factory()->asGuest()->create();

        $this->processOperatorUser = User::factory()
            ->asApplicant()
            ->asProcessOperator($this->pool->id)
            ->create();

        $this->communityRecruiterUser = User::factory()
            ->asApplicant()
            ->asCommunityRecruiter($this->community->id)
            ->create();

        $this->policy = new TestPolicyWithChecksTeamPermissions();
    }

    public function testGetPoolTeamsReturnsArrayOfTeams(): void
    {
        $reflection = new \ReflectionClass($this->policy);
        $method = $reflection->getMethod('getPoolTeams');

        $this->pool->load(['team', 'community.team', 'department.team']);
        $teams = $method->invoke($this->policy, $this->pool);

        $this->assertIsArray($teams);
        $this->assertCount(3, $teams);
    }

    public static function permissionProvider(): array
    {
        return [
            'guest has no permission' => ['guestUser', false],
            'process operator has permission' => ['processOperatorUser', true],
            'community recruiter has permission' => ['communityRecruiterUser', true],
        ];
    }

    #[DataProvider('permissionProvider')]
    public function testCheckTeamPermissionLogic(string $userProp, bool $expected): void
    {
        $user = $this->{$userProp};
        $reflection = new \ReflectionClass($this->policy);

        $this->pool->load(['team', 'community.team', 'department.team']);
        $teams = $reflection->getMethod('getPoolTeams')->invoke($this->policy, $this->pool);

        $result = $reflection->getMethod('checkTeamPermission')
            ->invoke($this->policy, $user, $teams, 'view-team-draftPool');

        $this->assertEquals($expected, $result);
    }

    public function testCheckTeamPermissionReturnsFalseWhenTeamsAreNull(): void
    {
        $reflection = new \ReflectionClass($this->policy);
        $teams = [null, null, null];

        $result = $reflection->getMethod('checkTeamPermission')
            ->invoke($this->policy, $this->adminUser, $teams, 'view-team-draftPool');

        $this->assertFalse($result);
    }

    public function testCheckTeamPermissionCachesResults(): void
    {
        Cache::store('array')->clear();
        $reflection = new \ReflectionClass($this->policy);

        $this->pool->load(['team', 'community.team', 'department.team']);
        $teams = $reflection->getMethod('getPoolTeams')->invoke($this->policy, $this->pool);

        $permission = 'view-team-draftPool';
        $reflection->getMethod('checkTeamPermission')
            ->invoke($this->policy, $this->processOperatorUser, $teams, $permission);

        $cacheKey = $this->policy->cacheKey($this->processOperatorUser, $this->pool->team, $permission);
        $this->assertTrue(Cache::store('array')->has($cacheKey));
    }

    public function testClearCacheRemovesStoredPermissions(): void
    {
        $reflection = new \ReflectionClass($this->policy);
        $this->pool->load(['team', 'community.team', 'department.team']);
        $teams = $reflection->getMethod('getPoolTeams')->invoke($this->policy, $this->pool);

        $permission = 'view-team-draftPool';
        $reflection->getMethod('checkTeamPermission')
            ->invoke($this->policy, $this->processOperatorUser, $teams, $permission);

        $cacheKey = $this->policy->cacheKey($this->processOperatorUser, $this->pool->team, $permission);
        $this->assertTrue(Cache::store('array')->has($cacheKey));

        Cache::store('array')->clear();

        $this->assertFalse(Cache::store('array')->has($cacheKey));
    }
}
