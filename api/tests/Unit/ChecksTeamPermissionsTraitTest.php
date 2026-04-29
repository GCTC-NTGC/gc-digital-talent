<?php

namespace Tests\Unit;

use App\Models\Community;
use App\Models\Department;
use App\Models\Pool;
use App\Models\User;
use App\Traits\ChecksTeamPermissions;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
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

    /**
     * This test remains separate because it validates the data structure
     * returned by the getPoolTeams method specifically.
     */
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
            'guest has no permission' => ['guestUser', true, false],
            'process operator has permission' => ['processOperatorUser', true, true],
            'community recruiter has permission' => ['communityRecruiterUser', true, true],
            'null teams return false' => ['adminUser', false, false],
        ];
    }

    #[DataProvider('permissionProvider')]
    public function testCheckTeamPermissionLogic(string $userProp, bool $usePoolTeams, bool $expected): void
    {
        $user = $this->{$userProp};
        $reflection = new \ReflectionClass($this->policy);
        $checkMethod = $reflection->getMethod('checkTeamPermission');

        if ($usePoolTeams) {
            $this->pool->load(['team', 'community.team', 'department.team']);
            $getTeamsMethod = $reflection->getMethod('getPoolTeams');
            $teams = $getTeamsMethod->invoke($this->policy, $this->pool);
        } else {
            $teams = [null, null, null];
        }

        $result = $checkMethod->invoke($this->policy, $user, $teams, 'view-team-draftPool');

        $this->assertEquals($expected, $result);
    }

    public function testCheckTeamPermissionCachesResults(): void
    {
        TestPolicyWithChecksTeamPermissions::clearTeamPermissionCache();
        $reflection = new \ReflectionClass($this->policy);
        $cacheProperty = $reflection->getProperty('teamPermissionCache');

        $this->pool->load(['team', 'community.team', 'department.team']);
        $teams = $reflection->getMethod('getPoolTeams')->invoke($this->policy, $this->pool);

        $reflection->getMethod('checkTeamPermission')
            ->invoke($this->policy, $this->processOperatorUser, $teams, 'view-team-draftPool');

        $this->assertNotEmpty($cacheProperty->getValue($this->policy));
    }

    public function testClearTeamPermissionCacheClearsCache(): void
    {
        $reflection = new \ReflectionClass($this->policy);
        $cacheProperty = $reflection->getProperty('teamPermissionCache');

        $this->pool->load(['team', 'community.team', 'department.team']);
        $teams = $reflection->getMethod('getPoolTeams')->invoke($this->policy, $this->pool);

        $reflection->getMethod('checkTeamPermission')
            ->invoke($this->policy, $this->processOperatorUser, $teams, 'view-team-draftPool');

        TestPolicyWithChecksTeamPermissions::clearTeamPermissionCache();

        $this->assertEmpty($cacheProperty->getValue($this->policy));
    }
}
