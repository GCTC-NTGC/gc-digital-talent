<?php

namespace Tests\Unit;

use App\Models\Community;
use App\Models\CommunityDevelopmentProgram;
use App\Models\Department;
use App\Models\DevelopmentProgram;
use App\Models\Pool;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class CommunityDevelopmentProgramPolicyTest extends TestCase
{
    use RefreshDatabase;
    use WithFaker;

    protected $guestUser;

    protected $applicantUser;

    protected $processOperatorUser;

    protected $communityRecruiterUser;

    protected $communityAdminUser;

    protected $communityTalentCoordinatorUser;

    protected $departmentAdmin;

    protected $departmentHRAdvisor;

    protected $adminUser;

    protected $community;

    protected $otherCommunity;

    protected $teamPool;

    protected $unOwnedPool;

    protected $department;

    protected $otherDepartment;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);

        $this->guestUser = User::factory()
            ->asGuest()
            ->create([
                'email' => 'guest-user@test.com',
                'sub' => 'guest-user@test.com',
            ]);

        $this->applicantUser = User::factory()
            ->asApplicant()
            ->create([
                'email' => 'applicant-user@test.com',
                'sub' => 'applicant-user@test.com',
            ]);

        $this->department = Department::factory()->create();
        $this->otherDepartment = Department::factory()->create();

        $this->community = Community::factory()->create();
        $this->otherCommunity = Community::factory()->create();

        $this->adminUser = User::factory()
            ->asApplicant()
            ->asAdmin()
            ->create([
                'email' => 'platform-admin-user@test.com',
                'sub' => 'platform-admin-user@test.com',
            ]);

        $this->teamPool = Pool::factory()->create([
            'user_id' => $this->adminUser->id,
            'community_id' => $this->community->id,
            'department_id' => $this->department->id,
        ]);

        $this->processOperatorUser = User::factory()
            ->asApplicant()
            ->asProcessOperator($this->teamPool->id)
            ->create([
                'email' => 'process-operator-user@test.com',
            ]);

        $this->communityRecruiterUser = User::factory()
            ->asApplicant()
            ->asCommunityRecruiter($this->community->id)
            ->create([
                'email' => 'community-recruiter-user@test.com',
            ]);

        $this->communityAdminUser = User::factory()
            ->asApplicant()
            ->asCommunityAdmin($this->community->id)
            ->create([
                'email' => 'community-admin-user@test.com',
            ]);

        $this->communityTalentCoordinatorUser = User::factory()
            ->asCommunityTalentCoordinator($this->community->id)
            ->create([
                'email' => 'talent-coordinator@test.com',
            ]);

        $this->unOwnedPool = Pool::factory([
            'community_id' => $this->otherCommunity->id,
            'department_id' => $this->otherDepartment->id,
        ])->create();

        $this->departmentAdmin = User::factory()
            ->asDepartmentAdmin($this->department->id)
            ->create();

        $this->departmentHRAdvisor = User::factory()
            ->asDepartmentHRAdvisor($this->department->id)
            ->create();
    }

    /**
     * Assert that only community admin and community talent coordinator may create
     * Community/team dependent
     *
     * @return void
     */
    public function testCreate()
    {
        $developmentProgramId = DevelopmentProgram::factory()->create()->id;

        $createCommunityDevelopmentProgramInput = [
            'community_id' => $this->community->id,
            'development_program_id' => $developmentProgramId,
        ];
        $otherCreateCommunityDevelopmentProgramInput = [
            'community_id' => $this->otherCommunity->id,
            'development_program_id' => $developmentProgramId,
        ];

        $this->assertFalse($this->guestUser->can('create', [CommunityDevelopmentProgram::class, $createCommunityDevelopmentProgramInput]));
        $this->assertFalse($this->applicantUser->can('create', [CommunityDevelopmentProgram::class, $createCommunityDevelopmentProgramInput]));
        $this->assertFalse($this->adminUser->can('create', [CommunityDevelopmentProgram::class, $createCommunityDevelopmentProgramInput]));
        $this->assertFalse($this->processOperatorUser->can('create', [CommunityDevelopmentProgram::class, $createCommunityDevelopmentProgramInput]));
        $this->assertFalse($this->communityRecruiterUser->can('create', [CommunityDevelopmentProgram::class, $createCommunityDevelopmentProgramInput]));

        $this->assertTrue($this->communityAdminUser->can('create', [CommunityDevelopmentProgram::class, $createCommunityDevelopmentProgramInput]));
        $this->assertTrue($this->communityTalentCoordinatorUser->can('create', [CommunityDevelopmentProgram::class, $createCommunityDevelopmentProgramInput]));

        $this->assertFalse($this->departmentAdmin->can('create', [CommunityDevelopmentProgram::class, $createCommunityDevelopmentProgramInput]));
        $this->assertFalse($this->departmentHRAdvisor->can('create', [CommunityDevelopmentProgram::class, $createCommunityDevelopmentProgramInput]));

        // cannot do so for other communities
        $this->assertFalse($this->communityAdminUser->can('create', [CommunityDevelopmentProgram::class, $otherCreateCommunityDevelopmentProgramInput]));
        $this->assertFalse($this->communityTalentCoordinatorUser->can('create', [CommunityDevelopmentProgram::class, $otherCreateCommunityDevelopmentProgramInput]));
    }

    /**
     * Assert that only community admin and community talent coordinator may update
     * Community/team dependent
     *
     * @return void
     */
    public function testUpdate()
    {
        $developmentProgramId = DevelopmentProgram::factory()->create()->id;

        $record = CommunityDevelopmentProgram::create([
            'community_id' => $this->community->id,
            'development_program_id' => $developmentProgramId,
        ]);
        $otherRecord = CommunityDevelopmentProgram::create([
            'community_id' => $this->otherCommunity->id,
            'development_program_id' => $developmentProgramId,
        ]);

        $this->assertFalse($this->guestUser->can('update', $record));
        $this->assertFalse($this->applicantUser->can('update', $record));
        $this->assertFalse($this->adminUser->can('update', $record));
        $this->assertFalse($this->processOperatorUser->can('update', $record));
        $this->assertFalse($this->communityRecruiterUser->can('update', $record));

        $this->assertTrue($this->communityAdminUser->can('update', $record));
        $this->assertTrue($this->communityTalentCoordinatorUser->can('update', $record));

        $this->assertFalse($this->departmentAdmin->can('update', $record));
        $this->assertFalse($this->departmentHRAdvisor->can('update', $record));

        // cannot do so for other communities
        $this->assertFalse($this->communityAdminUser->can('update', $otherRecord));
        $this->assertFalse($this->communityTalentCoordinatorUser->can('update', $otherRecord));
    }

    /**
     * Assert that only community admin and community talent coordinator may delete
     * Community/team dependent
     *
     * @return void
     */
    public function testDelete()
    {
        $developmentProgramId = DevelopmentProgram::factory()->create()->id;

        $record = CommunityDevelopmentProgram::create([
            'community_id' => $this->community->id,
            'development_program_id' => $developmentProgramId,
        ]);
        $otherRecord = CommunityDevelopmentProgram::create([
            'community_id' => $this->otherCommunity->id,
            'development_program_id' => $developmentProgramId,
        ]);

        $this->assertFalse($this->guestUser->can('delete', $record));
        $this->assertFalse($this->applicantUser->can('delete', $record));
        $this->assertFalse($this->adminUser->can('delete', $record));
        $this->assertFalse($this->processOperatorUser->can('delete', $record));
        $this->assertFalse($this->communityRecruiterUser->can('delete', $record));

        $this->assertTrue($this->communityAdminUser->can('delete', $record));
        $this->assertTrue($this->communityTalentCoordinatorUser->can('delete', $record));

        $this->assertFalse($this->departmentAdmin->can('delete', $record));
        $this->assertFalse($this->departmentHRAdvisor->can('delete', $record));

        // cannot do so for other communities
        $this->assertFalse($this->communityAdminUser->can('delete', $otherRecord));
        $this->assertFalse($this->communityTalentCoordinatorUser->can('delete', $otherRecord));
    }
}
