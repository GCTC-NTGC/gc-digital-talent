<?php

namespace Tests\Unit\Policies;

use App\Models\Community;
use App\Models\Department;
use App\Models\Pool;
use App\Models\TalentRequest;
use App\Models\User;
use App\Policies\TalentRequestPolicy;
use PHPUnit\Framework\Attributes\DataProvider;

class TalentRequestPolicyTest extends PolicyTestCase
{
    protected TalentRequestPolicy $policy;

    protected Community $primaryCommunity;

    protected Pool $primaryPool;

    protected function setUp(): void
    {
        parent::setUp();
        $this->policy = new TalentRequestPolicy();
        $this->primaryCommunity = Community::factory()->create();
        $this->primaryPool = Pool::factory()
            ->for($this->primaryCommunity)
            ->for(Department::factory()->create())
            ->create();
    }

    public static function teamScopedMethodsProvider(): array
    {
        return [
            'update' => ['update'],
            'delete' => ['delete'],
        ];
    }

    private function createTeamRoleUser(string $factoryMethod, ?Pool $pool = null): User
    {
        return $this->createContextualUser($factoryMethod, $pool ?? $this->primaryPool);
    }

    private function createTalentRequest(?Community $community = null, ?User $owner = null): TalentRequest
    {
        return TalentRequest::factory()->create([
            'community_id' => ($community ?? $this->primaryCommunity)->id,
            'user_id' => $owner?->id,
        ]);
    }

    private function createCommunityWithoutTeam(): Community
    {
        $community = Community::factory()->create();
        $community->team()->delete();

        return $community->fresh();
    }

    private function hasSearchRequestTeamPermission(string $factoryMethod): bool
    {
        return in_array($factoryMethod, ['asCommunityRecruiter', 'asCommunityAdmin']);
    }

    // --- viewAny() ---

    public function testViewAnyReturnsTrueForPlatformAdmin(): void
    {
        $admin = User::factory()->asAdmin()->create();
        $this->assertTrue($this->ensureBool($this->policy->viewAny($admin)));
    }

    public function testViewAnyReturnsFalseForCommunityRecruiter(): void
    {
        $recruiter = User::factory()->asCommunityRecruiter($this->primaryCommunity->id)->create();
        $this->assertFalse($this->ensureBool($this->policy->viewAny($recruiter)));
    }

    // --- view() ---

    public function testViewReturnsTrueForViewAnyPermission(): void
    {
        $request = $this->createTalentRequest();
        $admin = User::factory()->asAdmin()->create();
        $this->assertTrue($this->ensureBool($this->policy->view($admin, $request)));
    }

    public function testViewReturnsTrueForViewOwnPermissionWhenOwner(): void
    {
        $owner = User::factory()->asApplicant()->create();
        $request = $this->createTalentRequest(owner: $owner);
        $this->assertTrue($this->ensureBool($this->policy->view($owner, $request)));
    }

    public function testViewReturnsFalseForViewOwnPermissionWhenNotOwner(): void
    {
        $owner = User::factory()->asApplicant()->create();
        $otherApplicant = User::factory()->asApplicant()->create();
        $request = $this->createTalentRequest(owner: $owner);
        $this->assertFalse($this->ensureBool($this->policy->view($otherApplicant, $request)));
    }

    #[DataProvider('allTeamRolesProvider')]
    public function testViewReturnsExpectedForTeamPermissionOnSameCommunity(string $factoryMethod): void
    {
        $request = $this->createTalentRequest();
        $user = $this->createTeamRoleUser($factoryMethod);
        $this->assertSame(
            $this->hasSearchRequestTeamPermission($factoryMethod),
            $this->ensureBool($this->policy->view($user, $request)),
        );
    }

    #[DataProvider('allTeamRolesProvider')]
    public function testViewReturnsFalseForTeamPermissionOnDifferentCommunity(string $factoryMethod): void
    {
        $request = $this->createTalentRequest();
        $otherPool = Pool::factory()
            ->for(Community::factory()->create())
            ->for(Department::factory()->create())
            ->create();
        $user = $this->createTeamRoleUser($factoryMethod, $otherPool);
        $this->assertFalse($this->ensureBool($this->policy->view($user, $request)));
    }

    public function testViewReturnsFalseWhenCommunityHasNoTeam(): void
    {
        $communityWithoutTeam = $this->createCommunityWithoutTeam();
        $request = $this->createTalentRequest($communityWithoutTeam);
        $applicant = User::factory()->asApplicant()->create();
        $this->assertFalse($this->ensureBool($this->policy->view($applicant, $request)));
    }

    // --- create() ---

    public function testCreateAlwaysReturnsTrue(): void
    {
        $this->assertTrue($this->ensureBool($this->policy->create(null)));

        $applicant = User::factory()->asApplicant()->create();
        $this->assertTrue($this->ensureBool($this->policy->create($applicant)));
    }

    // --- update() / delete() ---

    #[DataProvider('teamScopedMethodsProvider')]
    public function testTeamScopedMethodsReturnFalseForPlatformAdmin(string $method): void
    {
        $request = $this->createTalentRequest();
        $admin = User::factory()->asAdmin()->create();
        $this->assertFalse($this->ensureBool($this->policy->{$method}($admin, $request)));
    }

    #[DataProvider('allTeamRolesProvider')]
    public function testUpdateReturnsExpectedForTeamPermissionOnSameCommunity(string $factoryMethod): void
    {
        $request = $this->createTalentRequest();
        $user = $this->createTeamRoleUser($factoryMethod);
        $this->assertSame(
            $this->hasSearchRequestTeamPermission($factoryMethod),
            $this->ensureBool($this->policy->update($user, $request)),
        );
    }

    #[DataProvider('allTeamRolesProvider')]
    public function testDeleteReturnsExpectedForTeamPermissionOnSameCommunity(string $factoryMethod): void
    {
        $request = $this->createTalentRequest();
        $user = $this->createTeamRoleUser($factoryMethod);
        $this->assertSame(
            $this->hasSearchRequestTeamPermission($factoryMethod),
            $this->ensureBool($this->policy->delete($user, $request)),
        );
    }

    #[DataProvider('allTeamRolesProvider')]
    public function testUpdateReturnsFalseForTeamPermissionOnDifferentCommunity(string $factoryMethod): void
    {
        $request = $this->createTalentRequest();
        $otherPool = Pool::factory()
            ->for(Community::factory()->create())
            ->for(Department::factory()->create())
            ->create();
        $user = $this->createTeamRoleUser($factoryMethod, $otherPool);
        $this->assertFalse($this->ensureBool($this->policy->update($user, $request)));
    }

    #[DataProvider('allTeamRolesProvider')]
    public function testDeleteReturnsFalseForTeamPermissionOnDifferentCommunity(string $factoryMethod): void
    {
        $request = $this->createTalentRequest();
        $otherPool = Pool::factory()
            ->for(Community::factory()->create())
            ->for(Department::factory()->create())
            ->create();
        $user = $this->createTeamRoleUser($factoryMethod, $otherPool);
        $this->assertFalse($this->ensureBool($this->policy->delete($user, $request)));
    }

    #[DataProvider('allTeamRolesProvider')]
    public function testUpdateReturnsFalseWhenCommunityHasNoTeam(string $factoryMethod): void
    {
        $communityWithoutTeam = $this->createCommunityWithoutTeam();
        $request = $this->createTalentRequest($communityWithoutTeam);
        $user = $this->createTeamRoleUser($factoryMethod);
        $this->assertFalse($this->ensureBool($this->policy->update($user, $request)));
    }

    #[DataProvider('allTeamRolesProvider')]
    public function testDeleteReturnsFalseWhenCommunityHasNoTeam(string $factoryMethod): void
    {
        $communityWithoutTeam = $this->createCommunityWithoutTeam();
        $request = $this->createTalentRequest($communityWithoutTeam);
        $user = $this->createTeamRoleUser($factoryMethod);
        $this->assertFalse($this->ensureBool($this->policy->delete($user, $request)));
    }

    // --- restore() ---

    #[DataProvider('allTeamRolesProvider')]
    public function testRestoreReturnsFalseForTeamRoles(string $factoryMethod): void
    {
        $user = $this->createTeamRoleUser($factoryMethod);
        $request = $this->createTalentRequest();
        $this->assertFalse($this->ensureBool($this->policy->restore($user, $request)));
    }

    public function testRestoreReturnsFalseForPlatformAdmin(): void
    {
        $request = $this->createTalentRequest();
        $admin = User::factory()->asAdmin()->create();
        $this->assertFalse($this->ensureBool($this->policy->restore($admin, $request)));
    }

    // --- forceDelete() ---

    public function testForceDeleteAlwaysReturnsFalse(): void
    {
        $request = $this->createTalentRequest();
        $admin = User::factory()->asAdmin()->create();
        $this->assertFalse($this->ensureBool($this->policy->forceDelete($admin, $request)));
    }
}
