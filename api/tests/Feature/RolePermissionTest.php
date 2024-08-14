<?php

namespace Tests\Feature;

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
            'view-any-team',
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
            'view-any-team',
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
     * Test the Pool Operator Role
     *
     * @return void
     */
    public function testPoolOperatorRole()
    {
        $poolOperatorRole = Role::where('name', 'pool_operator')->sole();
        $this->user->addRole(
            $poolOperatorRole,
            $this->ownedTeam
        );

        $permissionsToCheck = [
            'view-team-draftPool',
            'create-team-draftPool',
            'update-team-draftPool',
            'delete-team-draftPool',
            'view-team-submittedApplication',
            'view-team-applicationStatus',
            'update-team-applicationStatus',
            'view-team-applicationAssessment',
            'update-team-applicationAssessment',
            'view-team-applicationDecision',
            'update-team-applicationDecision',
            'view-team-applicationPlacement',
            'update-team-applicationPlacement',
            'view-team-teamMembers',
            'view-team-applicantProfile',
            'view-team-assessmentPlan',
            'update-team-assessmentPlan',
        ];

        $this->assertTrue($this->user->hasRole('pool_operator', $this->ownedTeam));
        $this->assertTrue($this->user->isAbleTo($permissionsToCheck, $this->ownedTeam, true));

        $this->assertFalse($this->user->hasRole('pool_operator', $this->unownedTeam));
        $this->assertFalse($this->user->isAbleTo($permissionsToCheck, $this->unownedTeam));

        $this->cleanup();
    }

    /**
     * Test the Request Responder Role
     *
     * @return void
     */
    public function testRequestResponderRole()
    {
        $requestResponderRole = Role::where('name', 'request_responder')->sole();
        $this->user->addRole($requestResponderRole);

        $permissionsToCheck = [
            'view-any-submittedApplication',
            'view-any-applicationStatus',
            'update-any-applicationStatus',
            'view-any-applicationAssessment',
            'update-any-applicationAssessment',
            'view-any-applicationDecision',
            'view-any-applicationPlacement',
            'update-any-applicationDecision',
            'update-any-applicationPlacement',
            'view-any-searchRequest',
            'update-any-searchRequest',
            'delete-any-searchRequest',
            'view-any-assessmentPlan',
        ];

        $this->assertTrue($this->user->hasRole('request_responder'));
        $this->assertTrue($this->user->isAbleTo($permissionsToCheck, true));
        $this->assertTrue(($this->user->isAbleTo('view-any-user')));

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
            'view-any-teamMembers',
            'create-any-team',
            'update-any-team',
            'delete-any-team',
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
     * Test the Community Manager Role
     *
     * @return void
     */
    public function testCommunityManagerRole()
    {
        $communityManager = Role::where('name', 'community_manager')->sole();
        $this->user->addRole($communityManager);

        $permissionsToCheck = [
            'view-any-userBasicInfo',
            'view-any-pool',
            'publish-any-draftPool',
            'view-any-teamMembers',
            'create-any-team',
            'update-any-team',
            'delete-any-team',
            'assign-any-teamRole',
        ];

        $this->assertTrue($this->user->hasRole('community_manager'));
        $this->assertTrue($this->user->isAbleTo($permissionsToCheck, true));

        $this->cleanup();
    }

    /**
     * Test Strict Team Check
     *
     * @return void
     */
    public function testStrictTeamCheck()
    {
        $poolOperatorRole = Role::where('name', 'pool_operator')->sole();
        $this->user->addRole(
            $poolOperatorRole,
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
