<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

use App\Models\Role;
use App\Models\Team;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;

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
            'name' => 'owned-team'
        ]);

        $this->unownedTeam = Team::create([
            'name' => 'unowned-team'
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
        $this->user->attachRole($guestRole);

        $this->assertTrue($this->user->hasRole('guest'));
        $this->assertTrue($this->user->isAbleTo([
            'view-any-classification',
            'view-any-department',
            'view-any-skill',
            'view-any-skillFamily',
            'view-any-publishedPoolAdvertisement',
            'view-any-applicantCount',
            'create-any-searchRequest',
            'view-any-team'
        ], true));

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
        $this->user->attachRole($baseUserRole);

        $this->assertTrue($this->user->hasRole('base_user'));
        $this->assertTrue($this->user->isAbleTo([
            'view-own-user',
            'update-own-user',
        ], true));

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
        $this->user->attachRole($applicantRole);

        $this->assertTrue($this->user->hasRole('applicant'));
        $this->assertTrue($this->user->isAbleTo([
            'view-own-application',
            'submit-own-application',
            'create-own-draftApplication',
            'delete-own-draftApplication',
            'archive-own-submittedApplication',
        ], true));

        $this->cleanup();
    }

    /**
     * Test the Team Admin Role
     *
     * @return void
     */
    public function test_team_admin_role()
    {
        $teamAdminRole = Role::where('name', 'team_admin')->sole();
        $this->user->attachRole(
            $teamAdminRole,
            $this->ownedTeam
        );

        $permissionsToCheck = [
            'view-any-userBasicInfo',
            'view-team-pool',
            'create-team-pool',
            'publish-team-pool',
            'update-team-draftPool',
            'delete-team-draftPool',
            'update-team-poolClosingDate',
            'view-team-submittedApplication',
            'view-team-applicantProfile',
            'update-team-applicationStatus',
            'view-team-searchRequest',
            'update-team-searchRequest',
            'delete-team-searchRequest',
            'view-team-teamUsersBasicInfo',
            'update-team-team',
            'view-any-role',
            'assign-team-role',
        ];

        $this->assertTrue($this->user->hasRole('team_admin',  $this->ownedTeam));
        $this->assertTrue($this->user->isAbleTo($permissionsToCheck, $this->ownedTeam, true));

        $this->assertFalse($this->user->hasRole('team_admin',  $this->unownedTeam));
        $this->assertFalse($this->user->isAbleTo($permissionsToCheck, $this->unownedTeam));

        $this->cleanup();
    }

    /**
     * Test the Applicant Role
     *
     * @return void
     */
    public function test_super_admin_role()
    {
        $superAdminRole = Role::where('name', 'super_admin')->sole();
        $this->user->attachRole($superAdminRole);

        $this->assertTrue($this->user->hasRole('super_admin'));
        $this->assertTrue($this->user->isAbleTo([
            'create-any-classification',
            'update-any-classification',
            'delete-any-classification',
            'create-any-department',
            'update-any-department',
            'delete-any-department',
            'create-any-skill',
            'update-any-skill',
            'delete-any-skill',
            'create-any-skillFamily',
            'update-any-skillFamily',
            'delete-any-skillFamily',
            'view-any-user',
            'update-any-user',
            'delete-any-user',
            'view-any-userBasicInfo',
            'view-any-teamUsersBasicInfo',
            'create-any-team',
            'update-any-team',
            'delete-any-team',
            'view-any-role',
            'assign-any-role',
            'update-any-role',
        ], true));

        $this->cleanup();
    }

    private function cleanup()
    {
        // Remove all roles from a user
        $this->user->syncRoles([]);
    }
}
