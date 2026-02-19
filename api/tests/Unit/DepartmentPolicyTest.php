<?php

namespace Tests\Unit;

use App\Models\Community;
use App\Models\Department;
use App\Models\Pool;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class DepartmentPolicyTest extends TestCase
{
    use RefreshDatabase;
    use WithFaker;

    protected $guest;

    protected $applicant;

    protected $otherApplicant;

    protected $platformAdmin;

    protected $processOperator;

    protected $communityRecruiter;

    protected $communityAdmin;

    protected $communityTalentCoordinator;

    protected $departmentAdmin;

    protected $departmentHRAdvisor;

    protected $pool;

    protected $community;

    protected $otherCommunity;

    protected $department;

    protected $otherDepartment;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);

        $this->guest = User::factory()
            ->asGuest()
            ->create([
                'email' => 'guest-user@test.com',
                'sub' => 'guest-user@test.com',
            ]);

        $this->applicant = User::factory()
            ->asApplicant()
            ->create([
                'email' => 'applicant-user@test.com',
                'sub' => 'applicant-user@test.com',
            ]);

        $this->otherApplicant = User::factory()
            ->asApplicant()
            ->create([
                'email' => 'other-applicant-user@test.com',
                'sub' => 'other-applicant-user@test.com',
            ]);

        $this->pool = Pool::factory()->create();
        $this->community = Community::factory()->create();
        $this->otherCommunity = Community::factory()->create();

        $this->platformAdmin = User::factory()
            ->asAdmin()
            ->create([
                'email' => 'admin-user@test.com',
                'sub' => 'admin-user@test.com',
            ]);

        $this->processOperator = User::factory()
            ->asProcessOperator($this->pool->id)
            ->create();

        $this->communityRecruiter = User::factory()
            ->asCommunityRecruiter($this->community->id)
            ->create();

        $this->communityAdmin = User::factory()
            ->asCommunityAdmin($this->community->id)
            ->create();

        $this->communityTalentCoordinator = User::factory()
            ->asCommunityTalentCoordinator($this->community->id)
            ->create();

        $this->department = Department::factory()->create();
        $this->otherDepartment = Department::factory()->create();

        $this->departmentAdmin = User::factory()
            ->asDepartmentAdmin($this->department->id)
            ->create();

        $this->departmentHRAdvisor = User::factory()
            ->asDepartmentHRAdvisor($this->department->id)
            ->create();
    }

    /**
     * Platform Admin can view the team members of any department
     * Department Admin and Department Advisor only their department
     *
     * @return void
     */
    public function testViewTeamMembers()
    {
        $this->assertFalse($this->guest->can('viewTeamMembers', $this->department));
        $this->assertFalse($this->applicant->can('viewTeamMembers', $this->department));
        $this->assertFalse($this->otherApplicant->can('viewTeamMembers', $this->department));
        $this->assertFalse($this->processOperator->can('viewTeamMembers', $this->department));
        $this->assertFalse($this->communityAdmin->can('viewTeamMembers', $this->department));
        $this->assertFalse($this->communityRecruiter->can('viewTeamMembers', $this->department));
        $this->assertFalse($this->communityTalentCoordinator->can('viewTeamMembers', $this->department));

        $this->assertTrue($this->platformAdmin->can('viewTeamMembers', $this->department));
        $this->assertTrue($this->departmentAdmin->can('viewTeamMembers', $this->department));
        $this->assertTrue($this->departmentHRAdvisor->can('viewTeamMembers', $this->department));

        // For otherDepartment
        $this->assertTrue($this->platformAdmin->can('viewTeamMembers', $this->otherDepartment));
        $this->assertFalse($this->departmentAdmin->can('viewTeamMembers', $this->otherDepartment));
        $this->assertFalse($this->departmentHRAdvisor->can('viewTeamMembers', $this->otherDepartment));
    }
}
