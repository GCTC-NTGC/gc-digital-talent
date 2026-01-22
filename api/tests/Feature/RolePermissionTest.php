<?php

namespace Tests\Feature;

use App\Models\Community;
use App\Models\Permission;
use App\Models\Pool;
use App\Models\Role;
use App\Models\Team;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RolePermissionTest extends TestCase
{
    use RefreshDatabase;

    private $user;

    private $ownedTeam;

    private $unownedTeam;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);

        $this->user = User::create([
            'email' => 'role-permission@test.com',
            'sub' => 'role-permission@test.com',
        ]);

        $this->ownedTeam = Team::create([
            'name' => 'owned-team',
        ]);

        $this->unownedTeam = Team::create([
            'name' => 'unowned-team',
        ]);
    }

    /**
     * Test the Guest User Role
     *
     * @return void
     */
    public function testGuestRole()
    {
        $guestRole = Role::where('name', 'guest')->sole();
        $this->user->addRole($guestRole);

        $this->assertTrue($this->user->hasRole('guest'));
        $this->assertTrue($this->user->isAbleTo([
            'view-any-classification',
            'view-any-department',
            'view-any-genericJobTitle',
            'view-any-skill',
            'view-any-skillFamily',
            'view-any-publishedPool',
            'view-any-applicantCount',
            'create-any-searchRequest',
            'view-any-role',
            'view-any-community',
        ], true)); // The `true` as a second argument means user must have ALL permissions, instead of just one.

        $this->assertFalse(($this->user->isAbleTo('view-any-user')));

        $this->cleanup();
    }

    /**
     * Test the Base User Role
     *
     * @return void
     */
    public function testBaseUserRole()
    {
        $baseUserRole = Role::where('name', 'base_user')->sole();
        $this->user->addRole($baseUserRole);

        $this->assertTrue($this->user->hasRole('base_user'));
        $this->assertTrue($this->user->isAbleTo([
            'view-any-classification',
            'view-any-department',
            'view-any-genericJobTitle',
            'view-any-skill',
            'view-any-skillFamily',
            'view-own-user',
            'update-own-user',
            'view-any-publishedPool',
            'view-any-applicantCount',
            'create-any-searchRequest',
            'view-any-role',
            'view-any-community',
        ], true));

        $this->assertFalse(($this->user->isAbleTo('view-any-user')));

        $this->cleanup();
    }

    /**
     * Test the Applicant Role
     *
     * @return void
     */
    public function testApplicantRole()
    {
        $applicantRole = Role::where('name', 'applicant')->sole();
        $this->user->addRole($applicantRole);

        $this->assertTrue($this->user->hasRole('applicant'));
        $this->assertTrue($this->user->isAbleTo([
            'view-own-application',
            'view-own-applicationStatus',
            'view-own-applicationDecision',
            'view-own-applicationPlacement',
            'submit-own-draftApplication',
            'create-own-draftApplication',
            'delete-own-draftApplication',
            'archive-own-submittedApplication',
        ], true));

        $this->assertFalse(($this->user->isAbleTo('view-any-user')));

        $this->cleanup();
    }

    /**
     * Test the Platform Admin role
     *
     * @return void
     */
    public function testPlatformAdminRole()
    {
        $superAdminRole = Role::where('name', 'platform_admin')->sole();
        $this->user->addRole($superAdminRole);

        $this->assertTrue($this->user->hasRole('platform_admin'));
        $this->assertTrue($this->user->isAbleTo([
            'create-any-classification',
            'view-any-classification',
            'update-any-classification',
            'delete-any-classification',
            'create-any-department',
            'view-any-department',
            'update-any-department',
            'delete-any-department',
            'create-any-genericJobTitle',
            'view-any-genericJobTitle',
            'update-any-genericJobTitle',
            'delete-any-genericJobTitle',
            'create-any-skill',
            'view-any-skill',
            'update-any-skill',
            'delete-any-skill',
            'create-any-skillFamily',
            'view-any-skillFamily',
            'update-any-skillFamily',
            'delete-any-skillFamily',
            'create-any-community',
            'view-any-community',
            'update-any-community',
            'delete-any-community',
            'create-any-user',
            'view-any-user',
            'view-any-userBasicInfo',
            'update-any-user',
            'update-any-userSub',
            'delete-any-user',
            'view-any-applicantProfile',
            'view-any-pool',
            'view-any-assessmentPlan',
            'create-any-application',
            'assign-any-role',
            'view-any-submittedApplication',
            'view-any-applicationStatus',
            'view-any-applicationAssessment',
            'view-any-applicationDecision',
            'view-any-applicationPlacement',
            'view-any-searchRequest',
            'view-any-announcement',
            'update-any-announcement',
            'update-any-platformAdminMembership',
            'update-any-communityRecruiterMembership',
            'update-any-communityAdminMembership',
            'update-any-processOperatorMembership',
            'view-any-communityTeamMembers',
            'view-any-poolTeamMembers',
        ], true));

        $this->cleanup();
    }

    /**
     * Test the Process Operator Role
     *
     * @return void
     */
    public function testProcessOperatorRole()
    {
        $pool = Pool::factory()
            ->draft()
            ->create();
        $otherPool = Pool::factory()
            ->draft()
            ->create();
        $processOperator = User::factory()
            ->asProcessOperator($pool->id)
            ->create();
        $processOperator->removeRole('base_user'); // isolate process_operator

        $permissionsToCheck = [
            'view-team-applicantProfile',
            'view-team-draftPool',
            'update-team-draftPool',
            'view-team-assessmentPlan',
            'update-team-assessmentPlan',
            'view-team-submittedApplication',
            'view-team-applicationStatus',
            'view-team-applicationAssessment',
            'update-team-applicationAssessment',
            'view-team-applicationDecision',
            'update-team-applicationDecision',
            'view-team-applicationPlacement',
            'view-team-poolTeamMembers',
            'view-team-poolActivityLog',
        ];
        $allPermissions = Permission::all()->pluck('name')->toArray();
        $notPossessedPermissions = array_diff($allPermissions, $permissionsToCheck);

        $this->assertTrue($processOperator->hasRole('process_operator', $pool->team));
        $this->assertTrue($processOperator->isAbleTo($permissionsToCheck, $pool->team, true));

        $this->assertFalse($processOperator->hasRole('process_operator', $otherPool->team));
        $this->assertFalse($processOperator->isAbleTo($permissionsToCheck, $otherPool->team, false));

        // negative assertion of permissions, fail if any possessed
        $this->assertFalse($processOperator->isAbleTo($notPossessedPermissions, false));

        $this->cleanup();
    }

    /**
     * Test the Community Recruiter Role
     *
     * @return void
     */
    public function testCommunityRecruiterRole()
    {
        $community = Community::factory()->create();
        $otherCommunity = Community::factory()->create();
        $communityRecruiter = User::factory()
            ->asCommunityRecruiter($community->id)
            ->create();
        $communityRecruiter->removeRole('base_user'); // isolate community_recruiter

        $permissionsToCheck = [
            'view-any-userBasicInfo',
            'view-team-applicantProfile',
            'view-team-draftPool',
            'create-team-draftPool',
            'update-team-draftPool',
            'delete-team-draftPool',
            'archive-team-publishedPool',
            'view-team-assessmentPlan',
            'update-team-assessmentPlan',
            'view-team-submittedApplication',
            'view-team-applicationStatus',
            'view-team-applicationAssessment',
            'update-team-applicationAssessment',
            'view-team-applicationDecision',
            'update-team-applicationDecision',
            'view-team-applicationPlacement',
            'update-team-applicationPlacement',
            'view-team-searchRequest',
            'update-team-searchRequest',
            'delete-team-searchRequest',
            'view-team-communityTeamMembers',
            'view-team-poolTeamMembers',
            'update-team-processOperatorMembership',
            'view-team-communityInterest',
            'view-team-communityTalent',
            'view-team-employeeWFA',
            'view-team-poolActivityLog',
        ];
        $allPermissions = Permission::all()->pluck('name')->toArray();
        $notPossessedPermissions = array_diff($allPermissions, $permissionsToCheck);

        $this->assertTrue($communityRecruiter->hasRole('community_recruiter', $community->team));
        $this->assertTrue($communityRecruiter->isAbleTo($permissionsToCheck, $community->team, true));

        $this->assertFalse($communityRecruiter->hasRole('community_recruiter', $otherCommunity->team));
        $this->assertFalse($communityRecruiter->isAbleTo($permissionsToCheck, $otherCommunity->team, false));

        // negative assertion of permissions, fail if any possessed
        $this->assertFalse($communityRecruiter->isAbleTo($notPossessedPermissions, false));

        $this->cleanup();
    }

    /**
     * Test the Community Admin Role
     *
     * @return void
     */
    public function testCommunityAdminRole()
    {
        $community = Community::factory()->create();
        $otherCommunity = Community::factory()->create();
        $communityAdmin = User::factory()
            ->asCommunityAdmin($community->id)
            ->create();
        $communityAdmin->removeRole('base_user'); // isolate community_admin

        $permissionsToCheck = [
            'view-any-userBasicInfo',
            'view-team-applicantProfile',
            'view-team-draftPool',
            'create-team-draftPool',
            'update-team-draftPool',
            'delete-team-draftPool',
            'archive-team-publishedPool',
            'view-team-assessmentPlan',
            'update-team-assessmentPlan',
            'view-team-submittedApplication',
            'view-team-applicationStatus',
            'view-team-applicationAssessment',
            'update-team-applicationAssessment',
            'view-team-applicationDecision',
            'update-team-applicationDecision',
            'view-team-applicationPlacement',
            'update-team-applicationPlacement',
            'view-team-searchRequest',
            'update-team-searchRequest',
            'delete-team-searchRequest',
            'view-team-communityTeamMembers',
            'view-team-poolTeamMembers',
            'update-team-processOperatorMembership',
            'publish-team-draftPool',
            'update-team-publishedPool',
            'view-team-communityInterest',
            'view-team-communityTalent',
            'update-team-community',
            'update-team-communityRecruiterMembership',
            'create-team-talentNominationEvent',
            'update-team-talentNominationEvent',
            'update-team-communityTalentCoordinatorMembership',
        ];
        $allPermissions = Permission::all()->pluck('name')->toArray();
        $notPossessedPermissions = array_diff($allPermissions, $permissionsToCheck);

        $this->assertTrue($communityAdmin->hasRole('community_admin', $community->team));
        $this->assertTrue($communityAdmin->isAbleTo($permissionsToCheck, $community->team, true));

        $this->assertFalse($communityAdmin->hasRole('community_admin', $otherCommunity->team));
        $this->assertFalse($communityAdmin->isAbleTo($permissionsToCheck, $otherCommunity->team, false));

        // negative assertion of permissions, fail if any possessed
        $this->assertFalse($communityAdmin->isAbleTo($notPossessedPermissions, false));

        $this->cleanup();
    }

    /**
     * Test the Community Talent Coordinator Role
     *
     * @return void
     */
    public function testCommunityTalentCoordinator()
    {
        $community = Community::factory()->create();
        $otherCommunity = Community::factory()->create();
        $communityTalentCoordinator = User::factory()
            ->asCommunityTalentCoordinator($community->id)
            ->create();
        $communityTalentCoordinator->removeRole('base_user'); // isolate community_talent_coordinator

        $permissionsToCheck = [
            'create-team-talentNominationEvent',
            'update-team-talentNominationEvent',
            'view-team-communityInterest',
            'view-team-communityTalent',
            'view-team-communityTeamMembers',
            'view-team-talentNomination',
            'update-team-talentNominationGroup',
            'view-team-talentNominationGroup',
        ];
        $allPermissions = Permission::all()->pluck('name')->toArray();
        $notPossessedPermissions = array_diff($allPermissions, $permissionsToCheck);

        $this->assertTrue($communityTalentCoordinator->hasRole('community_talent_coordinator', $community->team));
        $this->assertTrue($communityTalentCoordinator->isAbleTo($permissionsToCheck, $community->team, true));

        $this->assertFalse($communityTalentCoordinator->hasRole('community_talent_coordinator', $otherCommunity->team));
        $this->assertFalse($communityTalentCoordinator->isAbleTo($permissionsToCheck, $otherCommunity->team, false));

        // negative assertion of permissions, fail if any possessed
        $this->assertFalse($communityTalentCoordinator->isAbleTo($notPossessedPermissions, false));

        $this->cleanup();
    }

    /**
     * Test Strict Team Check
     *
     * @return void
     */
    public function testStrictTeamCheck()
    {
        $processOperatorRole = Role::where('name', 'process_operator')->sole();
        $this->user->addRole(
            $processOperatorRole,
            $this->ownedTeam
        );

        $guestRole = Role::where('name', 'guest')->sole();
        $this->user->addRole($guestRole);

        $guestPermission = 'view-any-skill';
        $teamPermission = 'view-team-draftPool';

        // This should be true because even though the role is associated with a team context, we're asking about the permission outside of a team context.
        // NOTE: this will fail if team_strict_check is true in the laratrust config.
        $this->assertTrue($this->user->isAbleTo($teamPermission, null));

        // This should be true because we're asking about the permission without a team context, and the user only has this permission outside of a team context anyway.
        // That means this should pass regardless whether team_strict_check is true or false.
        $this->assertTrue($this->user->isAbleTo($guestPermission, null));

        // This should be true because the user has this permission in the team context
        $this->assertTrue($this->user->isAbleTo($teamPermission, $this->ownedTeam));

        // This should be false because the user only has this permission outside of a team context
        $this->assertFalse($this->user->isAbleTo($guestPermission, $this->ownedTeam));
    }

    private function cleanup()
    {
        // Remove all roles from a user
        $this->user->syncRoles([]);
    }
}
