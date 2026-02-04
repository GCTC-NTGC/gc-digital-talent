<?php

namespace Tests\Unit;

use App\Models\Community;
use App\Models\CommunityInterest;
use App\Models\Pool;
use App\Models\PoolCandidate;
use App\Models\Role;
use App\Models\Team;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class UserPolicyTest extends TestCase
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

    protected $pool;

    protected $community;

    protected $otherCommunity;

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
    }

    /**
     * Only Platform Admin should be able to viewAny
     *
     * @return void
     */
    public function testViewAny()
    {
        $this->assertFalse($this->guest->can('viewAny', User::class));
        $this->assertFalse($this->applicant->can('viewAny', User::class));
        $this->assertTrue($this->platformAdmin->can('viewAny', User::class));

        $this->assertFalse($this->processOperator->can('viewAny', User::class));
        $this->assertFalse($this->communityRecruiter->can('viewAny', User::class));
        $this->assertFalse($this->communityAdmin->can('viewAny', User::class));
        $this->assertFalse($this->communityTalentCoordinator->can('viewAny', User::class));
    }

    /**
     * Platform Admin, own user, can always view. Others situational
     *
     * @return void
     */
    public function testView()
    {
        $this->assertFalse($this->guest->can('view', $this->applicant));
        $this->assertTrue($this->applicant->can('view', $this->applicant));
        $this->assertFalse($this->otherApplicant->can('view', $this->applicant));
        $this->assertTrue($this->platformAdmin->can('view', $this->applicant));

        // cannot view regular user
        $this->assertFalse($this->processOperator->can('view', $this->applicant));
        $this->assertFalse($this->communityRecruiter->can('view', $this->applicant));
        $this->assertFalse($this->communityAdmin->can('view', $this->applicant));
        $this->assertFalse($this->communityTalentCoordinator->can('view', $this->applicant));

        $this->pool->community_id = $this->community->id;
        $this->pool->save();
        $newApplication = PoolCandidate::factory()->create(
            [
                'submitted_at' => config('constants.past_date'),
                'pool_id' => $this->pool->id,
                'user_id' => $this->applicant->id,
            ]
        );

        // can now view applicant as they have an application attached to $pool within $community
        $this->assertTrue($this->processOperator->can('view', $this->applicant));
        $this->assertTrue($this->communityRecruiter->can('view', $this->applicant));
        $this->assertTrue($this->communityAdmin->can('view', $this->applicant));

        PoolCandidate::truncate();
        CommunityInterest::factory()->create([
            'user_id' => $this->applicant->id,
            'community_id' => $this->community->id,
            'consent_to_share_profile' => true,
        ]);

        // recruiter/coordinator/admin but not process operator can now view applicant as they are a community talent (CommunityInterest with interest)
        $this->assertTrue($this->communityRecruiter->can('view', $this->applicant));
        $this->assertTrue($this->communityTalentCoordinator->can('view', $this->applicant));
        $this->assertTrue($this->communityAdmin->can('view', $this->applicant));
        $this->assertFalse($this->processOperator->can('view', $this->applicant));
    }

    /**
     * Only Platform Admins, Community Recruiter, and Community Admin should be able to viewBasicInfo
     *
     * @return void
     */
    public function testViewBasicInfo()
    {
        $this->assertFalse($this->guest->can('viewBasicInfo', $this->applicant));
        $this->assertFalse($this->applicant->can('viewBasicInfo', $this->applicant));
        $this->assertTrue($this->platformAdmin->can('viewBasicInfo', $this->applicant));

        $this->assertFalse($this->processOperator->can('viewBasicInfo', $this->applicant));
        $this->assertTrue($this->communityRecruiter->can('viewBasicInfo', $this->applicant));
        $this->assertTrue($this->communityAdmin->can('viewBasicInfo', $this->applicant));
        $this->assertFalse($this->communityTalentCoordinator->can('viewBasicInfo', $this->applicant));
    }

    /**
     * Only Platform Admins and the own user should be able to update
     *
     * @return void
     */
    public function testUpdate()
    {
        $this->assertFalse($this->guest->can('update', $this->applicant));
        $this->assertTrue($this->applicant->can('update', $this->applicant));
        $this->assertFalse($this->otherApplicant->can('update', $this->applicant));
        $this->assertTrue($this->platformAdmin->can('update', $this->applicant));

        $this->assertFalse($this->processOperator->can('update', $this->applicant));
        $this->assertFalse($this->communityRecruiter->can('update', $this->applicant));
        $this->assertFalse($this->communityAdmin->can('update', $this->applicant));
        $this->assertFalse($this->communityTalentCoordinator->can('update', $this->applicant));
    }

    /**
     * Only Platform Admins can update sub values
     *
     * @return void
     */
    public function testUpdateSub()
    {
        $this->assertFalse($this->guest->can('updateSub', $this->applicant));
        $this->assertFalse($this->applicant->can('updateSub', $this->applicant));
        $this->assertTrue($this->platformAdmin->can('updateSub', $this->applicant));

        $this->assertFalse($this->processOperator->can('updateSub', $this->applicant));
        $this->assertFalse($this->communityRecruiter->can('updateSub', $this->applicant));
        $this->assertFalse($this->communityAdmin->can('updateSub', $this->applicant));
        $this->assertFalse($this->communityTalentCoordinator->can('updateSub', $this->applicant));
    }

    /**
     * Only Platform Admins can delete users, and not themselves.
     *
     * @return void
     */
    public function testDelete()
    {
        $this->assertFalse($this->guest->can('delete', $this->applicant));
        $this->assertFalse($this->applicant->can('delete', $this->applicant));
        $this->assertTrue($this->platformAdmin->can('delete', $this->applicant));
        $this->assertFalse($this->platformAdmin->can('delete', $this->platformAdmin));

        $this->assertFalse($this->processOperator->can('delete', $this->applicant));
        $this->assertFalse($this->communityRecruiter->can('delete', $this->applicant));
        $this->assertFalse($this->communityAdmin->can('delete', $this->applicant));
        $this->assertFalse($this->communityTalentCoordinator->can('delete', $this->applicant));
    }

    /**
     * Only Platform Admins can always update Process Operator, Community Admin and Community Recruiter situational
     *
     * @return void
     */
    public function testCanUpdateProcessOperatorRole()
    {
        $processOperatorId = Role::where('name', 'process_operator')->sole()->id;

        $policyArgsForAttach = [
            User::class,
            [
                'id' => $this->otherApplicant->id,
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
                'id' => $this->otherApplicant->id,
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

        $this->assertFalse($this->guest->can('updateRoles', $policyArgsForAttach));
        $this->assertFalse($this->guest->can('updateRoles', $policyArgsForDetach));
        $this->assertFalse($this->applicant->can('updateRoles', $policyArgsForAttach));
        $this->assertFalse($this->applicant->can('updateRoles', $policyArgsForDetach));
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

        $this->pool->community_id = $this->community->id;
        $this->pool->save();

        // once the pool is in their community, recruiter and admin can assign but operator can never do so
        $this->assertFalse($this->processOperator->can('updateRoles', $policyArgsForAttach));
        $this->assertFalse($this->processOperator->can('updateRoles', $policyArgsForDetach));
        $this->assertTrue($this->communityRecruiter->can('updateRoles', $policyArgsForAttach));
        $this->assertTrue($this->communityRecruiter->can('updateRoles', $policyArgsForDetach));
        $this->assertTrue($this->communityAdmin->can('updateRoles', $policyArgsForAttach));
        $this->assertTrue($this->communityAdmin->can('updateRoles', $policyArgsForDetach));
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
                'id' => $this->otherApplicant->id,
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
                'id' => $this->otherApplicant->id,
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

        $this->assertFalse($this->guest->can('updateRoles', $policyArgsForAttach));
        $this->assertFalse($this->guest->can('updateRoles', $policyArgsForDetach));
        $this->assertFalse($this->applicant->can('updateRoles', $policyArgsForAttach));
        $this->assertFalse($this->applicant->can('updateRoles', $policyArgsForDetach));
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

        // Community Admin could assign within their community, but not for a different community
        $otherCommunity = Community::factory()->create();
        $this->assertFalse($this->communityAdmin->can('updateRoles',
            [
                User::class,
                [
                    'id' => $this->otherApplicant->id,
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
                    'id' => $this->otherApplicant->id,
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
                'id' => $this->otherApplicant->id,
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
                'id' => $this->otherApplicant->id,
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

        $this->assertFalse($this->guest->can('updateRoles', $policyArgsForAttach));
        $this->assertFalse($this->guest->can('updateRoles', $policyArgsForDetach));
        $this->assertFalse($this->applicant->can('updateRoles', $policyArgsForAttach));
        $this->assertFalse($this->applicant->can('updateRoles', $policyArgsForDetach));
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
                'id' => $this->otherApplicant->id,
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
                'id' => $this->otherApplicant->id,
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
        $this->assertFalse($this->guest->can('updateRoles', $policyArgsForAttach));
        $this->assertFalse($this->guest->can('updateRoles', $policyArgsForDetach));
        $this->assertFalse($this->applicant->can('updateRoles', $policyArgsForAttach));
        $this->assertFalse($this->applicant->can('updateRoles', $policyArgsForDetach));
        $this->assertFalse($this->processOperator->can('updateRoles', $policyArgsForAttach));
        $this->assertFalse($this->processOperator->can('updateRoles', $policyArgsForDetach));
        $this->assertFalse($this->communityRecruiter->can('updateRoles', $policyArgsForAttach));
        $this->assertFalse($this->communityRecruiter->can('updateRoles', $policyArgsForDetach));
        $this->assertFalse($this->communityTalentCoordinator->can('updateRoles', $policyArgsForAttach));
        $this->assertFalse($this->communityTalentCoordinator->can('updateRoles', $policyArgsForDetach));

        $this->assertTrue($this->platformAdmin->can('updateRoles', $policyArgsForAttach));
        $this->assertTrue($this->platformAdmin->can('updateRoles', $policyArgsForDetach));
        $this->assertTrue($this->communityAdmin->can('updateRoles', $policyArgsForAttach));
        $this->assertTrue($this->communityAdmin->can('updateRoles', $policyArgsForDetach));

        $policyArgsForAttach = [
            User::class,
            [
                'id' => $this->otherApplicant->id,
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
                'id' => $this->otherApplicant->id,
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
        $this->assertTrue($this->applicant->can('removeWorkEmailInformation', $this->applicant));

        $this->assertFalse($this->guest->can('removeWorkEmailInformation', $this->applicant));
        $this->assertFalse($this->otherApplicant->can('removeWorkEmailInformation', $this->applicant));
        $this->assertFalse($this->processOperator->can('removeWorkEmailInformation', $this->applicant));
        $this->assertFalse($this->communityRecruiter->can('removeWorkEmailInformation', $this->applicant));
        $this->assertFalse($this->communityAdmin->can('removeWorkEmailInformation', $this->applicant));
        $this->assertFalse($this->communityTalentCoordinator->can('removeWorkEmailInformation', $this->applicant));
        $this->assertFalse($this->platformAdmin->can('removeWorkEmailInformation', $this->applicant));
    }
}
