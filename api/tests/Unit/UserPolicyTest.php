<?php

namespace Tests\Unit;

use App\Models\Community;
use App\Models\CommunityInterest;
use App\Models\Department;
use App\Models\Pool;
use App\Models\PoolCandidate;
use App\Models\Role;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class UserPolicyTest extends TestCase
{
    use RefreshDatabase;
    use WithFaker;

    protected $baseUser;

    protected $otherBaseUser;

    protected $employee;

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

        $this->baseUser = User::factory()
            ->create([
                'email' => 'base-user@test.com',
                'sub' => 'base-user@test.com',
            ]);

        $this->otherBaseUser = User::factory()
            ->create([
                'email' => 'other-base-user@test.com',
                'sub' => 'other-base-user@test.com',
            ]);

        $this->employee = User::factory()
            ->withGovEmployeeProfile()
            ->create();

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
     * Only Platform Admin should be able to viewAny
     *
     * @return void
     */
    public function testViewAny()
    {
        $this->assertFalse($this->baseUser->can('viewAny', User::class));
        $this->assertTrue($this->platformAdmin->can('viewAny', User::class));

        $this->assertFalse($this->processOperator->can('viewAny', User::class));
        $this->assertFalse($this->communityRecruiter->can('viewAny', User::class));
        $this->assertFalse($this->communityAdmin->can('viewAny', User::class));
        $this->assertFalse($this->communityTalentCoordinator->can('viewAny', User::class));
        $this->assertFalse($this->departmentAdmin->can('viewAny', User::class));
        $this->assertFalse($this->departmentHRAdvisor->can('viewAny', User::class));
    }

    /**
     * Platform Admin, own user, can always view. Others situational
     *
     * @return void
     */
    public function testView()
    {
        $this->assertTrue($this->baseUser->can('view', $this->baseUser));
        $this->assertFalse($this->otherBaseUser->can('view', $this->baseUser));
        $this->assertTrue($this->platformAdmin->can('view', $this->baseUser));

        // cannot view regular user
        $this->assertFalse($this->processOperator->can('view', $this->baseUser));
        $this->assertFalse($this->communityRecruiter->can('view', $this->baseUser));
        $this->assertFalse($this->communityAdmin->can('view', $this->baseUser));
        $this->assertFalse($this->communityTalentCoordinator->can('view', $this->baseUser));
        $this->assertFalse($this->departmentAdmin->can('view', $this->baseUser));
        $this->assertFalse($this->departmentHRAdvisor->can('view', $this->baseUser));

        $this->pool->community_id = $this->community->id;
        $this->pool->department_id = $this->department->id;
        $this->pool->save();
        $newApplication = PoolCandidate::factory()->create(
            [
                'submitted_at' => config('constants.past_date'),
                'pool_id' => $this->pool->id,
                'user_id' => $this->baseUser->id,
            ]
        );

        // can now view applicant as they have an application attached to $pool within $community and $department
        $this->assertTrue($this->processOperator->can('view', $this->baseUser));
        $this->assertTrue($this->communityRecruiter->can('view', $this->baseUser));
        $this->assertTrue($this->communityAdmin->can('view', $this->baseUser));
        $this->assertTrue($this->departmentAdmin->can('view', $this->baseUser));
        $this->assertTrue($this->departmentHRAdvisor->can('view', $this->baseUser));

        PoolCandidate::truncate();
        CommunityInterest::factory()->create([
            'user_id' => $this->employee->id,
            'community_id' => $this->community->id,
            'consent_to_share_profile' => true,
        ]);

        // recruiter/coordinator/admin but not process operator can view employee as they are a community talent (CommunityInterest with consent, verified employee)
        $this->assertTrue($this->communityRecruiter->can('view', $this->employee));
        $this->assertTrue($this->communityTalentCoordinator->can('view', $this->employee));
        $this->assertTrue($this->communityAdmin->can('view', $this->employee));
        $this->assertFalse($this->processOperator->can('view', $this->employee));
        $this->assertFalse($this->departmentAdmin->can('view', $this->employee));
        $this->assertFalse($this->departmentHRAdvisor->can('view', $this->employee));

        CommunityInterest::factory()->create([
            'user_id' => $this->baseUser->id,
            'community_id' => $this->community->id,
            'consent_to_share_profile' => true,
        ]);

        // recruiter/coordinator/admin cannot view applicant as a community talent because they are not a verified gov employee
        $this->assertFalse($this->communityRecruiter->can('view', $this->baseUser));
        $this->assertFalse($this->communityTalentCoordinator->can('view', $this->baseUser));
        $this->assertFalse($this->communityAdmin->can('view', $this->baseUser));
    }

    /**
     * Only Platform Admins and the own user should be able to update
     *
     * @return void
     */
    public function testUpdate()
    {
        $this->assertTrue($this->baseUser->can('update', $this->baseUser));
        $this->assertFalse($this->otherBaseUser->can('update', $this->baseUser));
        $this->assertTrue($this->platformAdmin->can('update', $this->baseUser));

        $this->assertFalse($this->processOperator->can('update', $this->baseUser));
        $this->assertFalse($this->communityRecruiter->can('update', $this->baseUser));
        $this->assertFalse($this->communityAdmin->can('update', $this->baseUser));
        $this->assertFalse($this->communityTalentCoordinator->can('update', $this->baseUser));
        $this->assertFalse($this->departmentAdmin->can('update', $this->baseUser));
        $this->assertFalse($this->departmentHRAdvisor->can('update', $this->baseUser));
    }

    /**
     * Only Platform Admins can update sub values
     *
     * @return void
     */
    public function testUpdateSub()
    {
        $this->assertFalse($this->baseUser->can('updateSub', $this->baseUser));
        $this->assertTrue($this->platformAdmin->can('updateSub', $this->baseUser));

        $this->assertFalse($this->processOperator->can('updateSub', $this->baseUser));
        $this->assertFalse($this->communityRecruiter->can('updateSub', $this->baseUser));
        $this->assertFalse($this->communityAdmin->can('updateSub', $this->baseUser));
        $this->assertFalse($this->communityTalentCoordinator->can('updateSub', $this->baseUser));
        $this->assertFalse($this->departmentAdmin->can('updateSub', $this->baseUser));
        $this->assertFalse($this->departmentHRAdvisor->can('updateSub', $this->baseUser));
    }

    /**
     * Only Platform Admins can delete users, and not themselves.
     *
     * @return void
     */
    public function testDelete()
    {
        $this->assertFalse($this->baseUser->can('delete', $this->baseUser));
        $this->assertTrue($this->platformAdmin->can('delete', $this->baseUser));
        $this->assertFalse($this->platformAdmin->can('delete', $this->platformAdmin));

        $this->assertFalse($this->processOperator->can('delete', $this->baseUser));
        $this->assertFalse($this->communityRecruiter->can('delete', $this->baseUser));
        $this->assertFalse($this->communityAdmin->can('delete', $this->baseUser));
        $this->assertFalse($this->communityTalentCoordinator->can('delete', $this->baseUser));
        $this->assertFalse($this->departmentAdmin->can('delete', $this->baseUser));
        $this->assertFalse($this->departmentHRAdvisor->can('delete', $this->baseUser));
    }

    /**
     * Only Platform Admins can always update Process Operator
     * Community Admin,Community Recruiter, Department Admin, and Department HR Advisor situational
     *
     * @return void
     */
    public function testCanUpdateProcessOperatorRole()
    {
        $processOperatorId = Role::where('name', 'process_operator')->sole()->id;

        $policyArgsForAttach = [
            User::class,
            [
                'id' => $this->otherBaseUser->id,
                'roleAssignmentsInput' => [
                    'attach' => [
                        [
                            'roleId' => $processOperatorId,
                            'teamId' => $this->pool->team->id,
                        ],
                    ],
                ],
            ],
        ];
        $policyArgsForDetach = [
            User::class,
            [
                'id' => $this->otherBaseUser->id,
                'roleAssignmentsInput' => [
                    'detach' => [
                        [
                            'roleId' => $processOperatorId,
                            'teamId' => $this->pool->team->id,
                        ],
                    ],
                ],
            ],
        ];

        $this->assertFalse($this->baseUser->can('updateRoles', $policyArgsForAttach));
        $this->assertFalse($this->baseUser->can('updateRoles', $policyArgsForDetach));
        $this->assertTrue($this->platformAdmin->can('updateRoles', $policyArgsForAttach));
        $this->assertTrue($this->platformAdmin->can('updateRoles', $policyArgsForDetach));

        $this->assertFalse($this->processOperator->can('updateRoles', $policyArgsForAttach));
        $this->assertFalse($this->processOperator->can('updateRoles', $policyArgsForDetach));
        $this->assertFalse($this->communityRecruiter->can('updateRoles', $policyArgsForAttach));
        $this->assertFalse($this->communityRecruiter->can('updateRoles', $policyArgsForDetach));
        $this->assertFalse($this->communityAdmin->can('updateRoles', $policyArgsForAttach));
        $this->assertFalse($this->communityAdmin->can('updateRoles', $policyArgsForDetach));
        $this->assertFalse($this->communityTalentCoordinator->can('updateRoles', $policyArgsForAttach));
        $this->assertFalse($this->communityTalentCoordinator->can('updateRoles', $policyArgsForDetach));
        $this->assertFalse($this->departmentAdmin->can('updateRoles', $policyArgsForAttach));
        $this->assertFalse($this->departmentAdmin->can('updateRoles', $policyArgsForDetach));
        $this->assertFalse($this->departmentHRAdvisor->can('updateRoles', $policyArgsForAttach));
        $this->assertFalse($this->departmentHRAdvisor->can('updateRoles', $policyArgsForDetach));

        $this->pool->community_id = $this->community->id;
        $this->pool->save();

        // once the pool is in their community, recruiter and admin can assign but operator can never do so
        // this changes nothing for department
        $this->assertFalse($this->processOperator->can('updateRoles', $policyArgsForAttach));
        $this->assertFalse($this->processOperator->can('updateRoles', $policyArgsForDetach));
        $this->assertTrue($this->communityRecruiter->can('updateRoles', $policyArgsForAttach));
        $this->assertTrue($this->communityRecruiter->can('updateRoles', $policyArgsForDetach));
        $this->assertTrue($this->communityAdmin->can('updateRoles', $policyArgsForAttach));
        $this->assertTrue($this->communityAdmin->can('updateRoles', $policyArgsForDetach));
        $this->assertFalse($this->departmentAdmin->can('updateRoles', $policyArgsForAttach));
        $this->assertFalse($this->departmentAdmin->can('updateRoles', $policyArgsForDetach));
        $this->assertFalse($this->departmentHRAdvisor->can('updateRoles', $policyArgsForAttach));
        $this->assertFalse($this->departmentHRAdvisor->can('updateRoles', $policyArgsForDetach));

        $this->pool->department_id = $this->department->id;
        $this->pool->save();

        // once the pool is associated with the test department, department roles can assign process operators to it
        $this->assertTrue($this->departmentAdmin->can('updateRoles', $policyArgsForAttach));
        $this->assertTrue($this->departmentAdmin->can('updateRoles', $policyArgsForDetach));
        $this->assertTrue($this->departmentHRAdvisor->can('updateRoles', $policyArgsForAttach));
        $this->assertTrue($this->departmentHRAdvisor->can('updateRoles', $policyArgsForDetach));
    }

    /**
     * Only Platform Admins can always update Community Recruiter, Community Admin can do so in some cases
     *
     * @return void
     */
    public function testCanUpdateCommunityRecruiterRole()
    {
        $communityRecruiterId = Role::where('name', 'community_recruiter')->sole()->id;

        $policyArgsForAttach = [
            User::class,
            [
                'id' => $this->otherBaseUser->id,
                'roleAssignmentsInput' => [
                    'attach' => [
                        [
                            'roleId' => $communityRecruiterId,
                            'teamId' => $this->community->team->id,
                        ],
                    ],
                ],
            ],
        ];
        $policyArgsForDetach = [
            User::class,
            [
                'id' => $this->otherBaseUser->id,
                'roleAssignmentsInput' => [
                    'detach' => [
                        [
                            'roleId' => $communityRecruiterId,
                            'teamId' => $this->community->team->id,
                        ],
                    ],
                ],
            ],
        ];

        $this->assertFalse($this->baseUser->can('updateRoles', $policyArgsForAttach));
        $this->assertFalse($this->baseUser->can('updateRoles', $policyArgsForDetach));
        $this->assertTrue($this->platformAdmin->can('updateRoles', $policyArgsForAttach));
        $this->assertTrue($this->platformAdmin->can('updateRoles', $policyArgsForDetach));

        $this->assertFalse($this->processOperator->can('updateRoles', $policyArgsForAttach));
        $this->assertFalse($this->processOperator->can('updateRoles', $policyArgsForDetach));
        $this->assertFalse($this->communityRecruiter->can('updateRoles', $policyArgsForAttach));
        $this->assertFalse($this->communityRecruiter->can('updateRoles', $policyArgsForDetach));
        $this->assertTrue($this->communityAdmin->can('updateRoles', $policyArgsForAttach));
        $this->assertTrue($this->communityAdmin->can('updateRoles', $policyArgsForDetach));
        $this->assertFalse($this->communityTalentCoordinator->can('updateRoles', $policyArgsForAttach));
        $this->assertFalse($this->communityTalentCoordinator->can('updateRoles', $policyArgsForDetach));
        $this->assertFalse($this->departmentAdmin->can('updateRoles', $policyArgsForAttach));
        $this->assertFalse($this->departmentAdmin->can('updateRoles', $policyArgsForDetach));
        $this->assertFalse($this->departmentHRAdvisor->can('updateRoles', $policyArgsForAttach));
        $this->assertFalse($this->departmentHRAdvisor->can('updateRoles', $policyArgsForDetach));

        // Community Admin could assign within their community, but not for a different community
        $otherCommunity = Community::factory()->create();
        $this->assertFalse($this->communityAdmin->can('updateRoles',
            [
                User::class,
                [
                    'id' => $this->otherBaseUser->id,
                    'roleAssignmentsInput' => [
                        'detach' => [
                            [
                                'roleId' => $communityRecruiterId,
                                'teamId' => $otherCommunity->team->id,
                            ],
                        ],
                    ],
                ],
            ]
        ));
        $this->assertFalse($this->communityAdmin->can('updateRoles',
            [
                User::class,
                [
                    'id' => $this->otherBaseUser->id,
                    'roleAssignmentsInput' => [
                        'detach' => [
                            [
                                'roleId' => $communityRecruiterId,
                                'teamId' => $otherCommunity->team->id,
                            ],
                        ],
                    ],
                ],
            ]
        ));
    }

    /**
     * Only Platform Admins can update Community Admin
     *
     * @return void
     */
    public function testCanUpdateCommunityAdminRole()
    {
        $communityAdminId = Role::where('name', 'community_admin')->sole()->id;

        $policyArgsForAttach = [
            User::class,
            [
                'id' => $this->otherBaseUser->id,
                'roleAssignmentsInput' => [
                    'attach' => [
                        [
                            'roleId' => $communityAdminId,
                            'teamId' => $this->community->team->id,
                        ],
                    ],
                ],
            ],
        ];
        $policyArgsForDetach = [
            User::class,
            [
                'id' => $this->otherBaseUser->id,
                'roleAssignmentsInput' => [
                    'detach' => [
                        [
                            'roleId' => $communityAdminId,
                            'teamId' => $this->community->team->id,
                        ],
                    ],
                ],
            ],
        ];

        $this->assertFalse($this->baseUser->can('updateRoles', $policyArgsForAttach));
        $this->assertFalse($this->baseUser->can('updateRoles', $policyArgsForDetach));
        $this->assertTrue($this->platformAdmin->can('updateRoles', $policyArgsForAttach));
        $this->assertTrue($this->platformAdmin->can('updateRoles', $policyArgsForDetach));

        $this->assertFalse($this->processOperator->can('updateRoles', $policyArgsForAttach));
        $this->assertFalse($this->processOperator->can('updateRoles', $policyArgsForDetach));
        $this->assertFalse($this->communityRecruiter->can('updateRoles', $policyArgsForAttach));
        $this->assertFalse($this->communityRecruiter->can('updateRoles', $policyArgsForDetach));
        $this->assertFalse($this->communityAdmin->can('updateRoles', $policyArgsForAttach));
        $this->assertFalse($this->communityAdmin->can('updateRoles', $policyArgsForDetach));
        $this->assertFalse($this->communityTalentCoordinator->can('updateRoles', $policyArgsForAttach));
        $this->assertFalse($this->communityTalentCoordinator->can('updateRoles', $policyArgsForDetach));
        $this->assertFalse($this->departmentAdmin->can('updateRoles', $policyArgsForAttach));
        $this->assertFalse($this->departmentAdmin->can('updateRoles', $policyArgsForDetach));
        $this->assertFalse($this->departmentHRAdvisor->can('updateRoles', $policyArgsForAttach));
        $this->assertFalse($this->departmentHRAdvisor->can('updateRoles', $policyArgsForDetach));
    }

    /**
     * Only Platform Admins can update any Community Talent Coordinator, Community Admin can do so for team only
     *
     * @return void
     */
    public function testCanUpdateCommunityTalentCoordinatorRole()
    {
        $communityTalentCoordinatorId = Role::where('name', 'community_talent_coordinator')->sole()->id;

        $policyArgsForAttach = [
            User::class,
            [
                'id' => $this->otherBaseUser->id,
                'roleAssignmentsInput' => [
                    'attach' => [
                        [
                            'roleId' => $communityTalentCoordinatorId,
                            'teamId' => $this->community->team->id,
                        ],
                    ],
                ],
            ],
        ];
        $policyArgsForDetach = [
            User::class,
            [
                'id' => $this->otherBaseUser->id,
                'roleAssignmentsInput' => [
                    'detach' => [
                        [
                            'roleId' => $communityTalentCoordinatorId,
                            'teamId' => $this->community->team->id,
                        ],
                    ],
                ],
            ],
        ];

        // same community, so Community Admin able to too
        $this->assertFalse($this->baseUser->can('updateRoles', $policyArgsForAttach));
        $this->assertFalse($this->baseUser->can('updateRoles', $policyArgsForDetach));
        $this->assertFalse($this->processOperator->can('updateRoles', $policyArgsForAttach));
        $this->assertFalse($this->processOperator->can('updateRoles', $policyArgsForDetach));
        $this->assertFalse($this->communityRecruiter->can('updateRoles', $policyArgsForAttach));
        $this->assertFalse($this->communityRecruiter->can('updateRoles', $policyArgsForDetach));
        $this->assertFalse($this->communityTalentCoordinator->can('updateRoles', $policyArgsForAttach));
        $this->assertFalse($this->communityTalentCoordinator->can('updateRoles', $policyArgsForDetach));
        $this->assertFalse($this->departmentAdmin->can('updateRoles', $policyArgsForAttach));
        $this->assertFalse($this->departmentAdmin->can('updateRoles', $policyArgsForDetach));
        $this->assertFalse($this->departmentHRAdvisor->can('updateRoles', $policyArgsForAttach));
        $this->assertFalse($this->departmentHRAdvisor->can('updateRoles', $policyArgsForDetach));

        $this->assertTrue($this->platformAdmin->can('updateRoles', $policyArgsForAttach));
        $this->assertTrue($this->platformAdmin->can('updateRoles', $policyArgsForDetach));
        $this->assertTrue($this->communityAdmin->can('updateRoles', $policyArgsForAttach));
        $this->assertTrue($this->communityAdmin->can('updateRoles', $policyArgsForDetach));

        $policyArgsForAttach = [
            User::class,
            [
                'id' => $this->otherBaseUser->id,
                'roleAssignmentsInput' => [
                    'attach' => [
                        [
                            'roleId' => $communityTalentCoordinatorId,
                            'teamId' => $this->otherCommunity->team->id,
                        ],
                    ],
                ],
            ],
        ];
        $policyArgsForDetach = [
            User::class,
            [
                'id' => $this->otherBaseUser->id,
                'roleAssignmentsInput' => [
                    'detach' => [
                        [
                            'roleId' => $communityTalentCoordinatorId,
                            'teamId' => $this->otherCommunity->team->id,
                        ],
                    ],
                ],
            ],
        ];

        // different community, so ony Platform Admin able to
        $this->assertTrue($this->platformAdmin->can('updateRoles', $policyArgsForAttach));
        $this->assertTrue($this->platformAdmin->can('updateRoles', $policyArgsForDetach));
        $this->assertFalse($this->communityAdmin->can('updateRoles', $policyArgsForAttach));
        $this->assertFalse($this->communityAdmin->can('updateRoles', $policyArgsForDetach));
    }

    /**
     * Only the user should be able to wipe their work email information
     *
     * @return void
     */
    public function testRemoveWorkEmailInformation()
    {
        $this->assertTrue($this->baseUser->can('removeWorkEmailInformation', $this->baseUser));

        $this->assertFalse($this->otherBaseUser->can('removeWorkEmailInformation', $this->baseUser));
        $this->assertFalse($this->processOperator->can('removeWorkEmailInformation', $this->baseUser));
        $this->assertFalse($this->communityRecruiter->can('removeWorkEmailInformation', $this->baseUser));
        $this->assertFalse($this->communityAdmin->can('removeWorkEmailInformation', $this->baseUser));
        $this->assertFalse($this->communityTalentCoordinator->can('removeWorkEmailInformation', $this->baseUser));
        $this->assertFalse($this->platformAdmin->can('removeWorkEmailInformation', $this->baseUser));
        $this->assertFalse($this->departmentAdmin->can('removeWorkEmailInformation', $this->baseUser));
        $this->assertFalse($this->departmentHRAdvisor->can('removeWorkEmailInformation', $this->baseUser));
    }

    /**
     * Only Platform Admins can update Department Admin
     *
     * @return void
     */
    public function testCanUpdateDepartmentAdminRole()
    {
        $departmentAdminId = Role::where('name', 'department_admin')->sole()->id;

        $policyArgsForAttach = [
            User::class,
            [
                'id' => $this->otherBaseUser->id,
                'roleAssignmentsInput' => [
                    'attach' => [
                        [
                            'roleId' => $departmentAdminId,
                            'teamId' => $this->community->team->id,
                        ],
                    ],
                ],
            ],
        ];
        $policyArgsForDetach = [
            User::class,
            [
                'id' => $this->otherBaseUser->id,
                'roleAssignmentsInput' => [
                    'detach' => [
                        [
                            'roleId' => $departmentAdminId,
                            'teamId' => $this->community->team->id,
                        ],
                    ],
                ],
            ],
        ];

        $this->assertFalse($this->baseUser->can('updateRoles', $policyArgsForAttach));
        $this->assertFalse($this->baseUser->can('updateRoles', $policyArgsForDetach));
        $this->assertTrue($this->platformAdmin->can('updateRoles', $policyArgsForAttach));
        $this->assertTrue($this->platformAdmin->can('updateRoles', $policyArgsForDetach));

        $this->assertFalse($this->processOperator->can('updateRoles', $policyArgsForAttach));
        $this->assertFalse($this->processOperator->can('updateRoles', $policyArgsForDetach));
        $this->assertFalse($this->communityRecruiter->can('updateRoles', $policyArgsForAttach));
        $this->assertFalse($this->communityRecruiter->can('updateRoles', $policyArgsForDetach));
        $this->assertFalse($this->communityAdmin->can('updateRoles', $policyArgsForAttach));
        $this->assertFalse($this->communityAdmin->can('updateRoles', $policyArgsForDetach));
        $this->assertFalse($this->communityTalentCoordinator->can('updateRoles', $policyArgsForAttach));
        $this->assertFalse($this->communityTalentCoordinator->can('updateRoles', $policyArgsForDetach));
        $this->assertFalse($this->departmentAdmin->can('updateRoles', $policyArgsForAttach));
        $this->assertFalse($this->departmentAdmin->can('updateRoles', $policyArgsForDetach));
        $this->assertFalse($this->departmentHRAdvisor->can('updateRoles', $policyArgsForAttach));
        $this->assertFalse($this->departmentHRAdvisor->can('updateRoles', $policyArgsForDetach));
    }

    /**
     * Only Platform Admins and Department Admin can update Department Advisor, the latter depends on team
     *
     * @return void
     */
    public function testCanUpdateDepartmentHRAdvisorRole()
    {
        $departmentAdvisorId = Role::where('name', 'department_hr_advisor')->sole()->id;

        $policyArgsForAttach = [
            User::class,
            [
                'id' => $this->otherBaseUser->id,
                'roleAssignmentsInput' => [
                    'attach' => [
                        [
                            'roleId' => $departmentAdvisorId,
                            'teamId' => $this->department->team->id,
                        ],
                    ],
                ],
            ],
        ];
        $policyArgsForDetach = [
            User::class,
            [
                'id' => $this->otherBaseUser->id,
                'roleAssignmentsInput' => [
                    'detach' => [
                        [
                            'roleId' => $departmentAdvisorId,
                            'teamId' => $this->department->team->id,
                        ],
                    ],
                ],
            ],
        ];

        $this->assertFalse($this->baseUser->can('updateRoles', $policyArgsForAttach));
        $this->assertFalse($this->baseUser->can('updateRoles', $policyArgsForDetach));
        $this->assertTrue($this->platformAdmin->can('updateRoles', $policyArgsForAttach));
        $this->assertTrue($this->platformAdmin->can('updateRoles', $policyArgsForDetach));
        $this->assertTrue($this->departmentAdmin->can('updateRoles', $policyArgsForAttach));
        $this->assertTrue($this->departmentAdmin->can('updateRoles', $policyArgsForDetach));

        $this->assertFalse($this->processOperator->can('updateRoles', $policyArgsForAttach));
        $this->assertFalse($this->processOperator->can('updateRoles', $policyArgsForDetach));
        $this->assertFalse($this->communityRecruiter->can('updateRoles', $policyArgsForAttach));
        $this->assertFalse($this->communityRecruiter->can('updateRoles', $policyArgsForDetach));
        $this->assertFalse($this->communityAdmin->can('updateRoles', $policyArgsForAttach));
        $this->assertFalse($this->communityAdmin->can('updateRoles', $policyArgsForDetach));
        $this->assertFalse($this->communityTalentCoordinator->can('updateRoles', $policyArgsForAttach));
        $this->assertFalse($this->communityTalentCoordinator->can('updateRoles', $policyArgsForDetach));
        $this->assertFalse($this->departmentHRAdvisor->can('updateRoles', $policyArgsForAttach));
        $this->assertFalse($this->departmentHRAdvisor->can('updateRoles', $policyArgsForDetach));

        // argument for other department
        $policyArgsForAttach = [
            User::class,
            [
                'id' => $this->otherBaseUser->id,
                'roleAssignmentsInput' => [
                    'attach' => [
                        [
                            'roleId' => $departmentAdvisorId,
                            'teamId' => $this->otherDepartment->team->id,
                        ],
                    ],
                ],
            ],
        ];
        $policyArgsForDetach = [
            User::class,
            [
                'id' => $this->otherBaseUser->id,
                'roleAssignmentsInput' => [
                    'detach' => [
                        [
                            'roleId' => $departmentAdvisorId,
                            'teamId' => $this->otherDepartment->team->id,
                        ],
                    ],
                ],
            ],
        ];

        // only platform admin can now
        $this->assertTrue($this->platformAdmin->can('updateRoles', $policyArgsForAttach));
        $this->assertTrue($this->platformAdmin->can('updateRoles', $policyArgsForDetach));
        $this->assertFalse($this->departmentAdmin->can('updateRoles', $policyArgsForAttach));
        $this->assertFalse($this->departmentAdmin->can('updateRoles', $policyArgsForDetach));
        $this->assertFalse($this->departmentHRAdvisor->can('updateRoles', $policyArgsForAttach));
        $this->assertFalse($this->departmentHRAdvisor->can('updateRoles', $policyArgsForDetach));
    }

    /**
     * Able to viewAnyUserWorkEmail
     * Only Platform Admins, Community Recruiter, Community Admin, Department Admin, and Department Advisor
     *
     * @return void
     */
    public function testViewAnyUserWorkEmail()
    {
        $this->assertFalse($this->baseUser->can('viewAnyUserWorkEmail', $this->baseUser));
        $this->assertTrue($this->platformAdmin->can('viewAnyUserWorkEmail', $this->baseUser));

        $this->assertFalse($this->processOperator->can('viewAnyUserWorkEmail', $this->baseUser));
        $this->assertTrue($this->communityRecruiter->can('viewAnyUserWorkEmail', $this->baseUser));
        $this->assertTrue($this->communityAdmin->can('viewAnyUserWorkEmail', $this->baseUser));
        $this->assertFalse($this->communityTalentCoordinator->can('viewAnyUserWorkEmail', $this->baseUser));
        $this->assertTrue($this->departmentAdmin->can('viewAnyUserWorkEmail', $this->baseUser));
        $this->assertTrue($this->departmentHRAdvisor->can('viewAnyUserWorkEmail', $this->baseUser));
    }

    /**
     * Able to updateAsAdmin
     * Only Platform Admins can do this
     *
     * @return void
     */
    public function testUpdateAsAdmin()
    {
        $this->assertTrue($this->platformAdmin->can('updateAsAdmin', $this->baseUser));

        $this->assertFalse($this->baseUser->can('updateAsAdmin', $this->baseUser));
        $this->assertFalse($this->processOperator->can('updateAsAdmin', $this->baseUser));
        $this->assertFalse($this->communityRecruiter->can('updateAsAdmin', $this->baseUser));
        $this->assertFalse($this->communityAdmin->can('updateAsAdmin', $this->baseUser));
        $this->assertFalse($this->communityTalentCoordinator->can('updateAsAdmin', $this->baseUser));
        $this->assertFalse($this->departmentAdmin->can('updateAsAdmin', $this->baseUser));
        $this->assertFalse($this->departmentHRAdvisor->can('updateAsAdmin', $this->baseUser));
    }
}
