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
    public function test_guest_role()
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
        ], true)); // The `true` as a second argument means user must have ALL permissions, instead of just one.

        $this->assertFalse(($this->user->isAbleTo('view-any-user')));

        $this->cleanup();
    }

    /**
     * Test the Base User Role
     *
     * @return void
     */
    public function test_base_user_role()
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
        ], true));

        $this->assertFalse(($this->user->isAbleTo('view-any-user')));

        $this->cleanup();
    }

    /**
     * Test the Applicant Role
     *
     * @return void
     */
    public function test_applicant_role()
    {
        $applicantRole = Role::where('name', 'applicant')->sole();
        $this->user->addRole($applicantRole);

        $this->assertTrue($this->user->hasRole('applicant'));
        $this->assertTrue($this->user->isAbleTo([
            'view-own-application',
            'submit-own-application',
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
    public function test_pool_operator_role()
    {
        $poolOperatorRole = Role::where('name', 'pool_operator')->sole();
        $this->user->addRole(
            $poolOperatorRole,
            $this->ownedTeam
        );

        $permissionsToCheck = [
            'view-team-pool',
            'create-team-pool',
            'update-team-draftPool',
            'update-team-poolClosingDate',
            'delete-team-draftPool',
            'view-team-submittedApplication',
            'update-team-applicationStatus',
            'view-team-teamMembers',
            'view-team-applicantProfile',
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
    public function test_request_responder_role()
    {
        $requestResponderRole = Role::where('name', 'request_responder')->sole();
        $this->user->addRole($requestResponderRole);

        $permissionsToCheck = [
            'view-any-submittedApplication',
            'view-any-searchRequest',
            'update-any-searchRequest',
            'delete-any-searchRequest',
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
    public function test_platform_admin_role()
    {
        $superAdminRole = Role::where('name', 'platform_admin')->sole();
        $this->user->addRole($superAdminRole);

        $this->assertTrue($this->user->hasRole('platform_admin'));
        $this->assertTrue($this->user->isAbleTo([
            'create-any-classification',
            'update-any-classification',
            'delete-any-classification',
            'create-any-department',
            'update-any-department',
            'delete-any-department',
            'create-any-genericJobTitle',
            'update-any-genericJobTitle',
            'delete-any-genericJobTitle',
            'create-any-skill',
            'update-any-skill',
            'delete-any-skill',
            'create-any-skillFamily',
            'update-any-skillFamily',
            'delete-any-skillFamily',
            'create-any-user',
            'view-any-user',
            'view-any-userBasicInfo',
            'update-any-user',
            'update-any-userSub',
            'delete-any-user',
            'view-any-pool',
            'publish-any-pool',
            'create-any-application',
            'view-any-teamMembers',
            'create-any-team',
            'update-any-team',
            'delete-any-team',
            'assign-any-role',
        ], true));

        $this->cleanup();
    }

    /**
     * Test the Community Manager Role
     *
     * @return void
     */
    public function test_community_manager_role()
    {
        $communityManager = Role::where('name', 'community_manager')->sole();
        $this->user->addRole($communityManager);

        $permissionsToCheck = [
            'view-any-userBasicInfo',
            'view-any-pool',
            'publish-any-pool',
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
    public function test_strict_team_check()
    {
        $poolOperatorRole = Role::where('name', 'pool_operator')->sole();
        $this->user->addRole(
            $poolOperatorRole,
            $this->ownedTeam
        );

        $guestRole = Role::where('name', 'guest')->sole();
        $this->user->addRole($guestRole);

        $guestPermission = 'view-any-skill';
        $teamPermission = 'view-team-pool';

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
