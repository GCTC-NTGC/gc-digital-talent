<?php

namespace Tests\Feature;

use App\Enums\CommunityInterestAdditionalDuty;
use App\Enums\DevelopmentProgramParticipationStatus;
use App\Enums\ErrorCode;
use App\Models\Community;
use App\Models\CommunityInterest;
use App\Models\DevelopmentProgram;
use App\Models\EducationExperience;
use App\Models\Pool;
use App\Models\User;
use App\Models\WorkStream;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Tests\TestCase;
use Tests\UsesProtectedGraphqlEndpoint;

use function PHPUnit\Framework\assertEquals;
use function PHPUnit\Framework\assertEqualsCanonicalizing;

class CommunityInterestTest extends TestCase
{
    use MakesGraphQLRequests;
    use RefreshDatabase;
    use RefreshesSchemaCache;
    use UsesProtectedGraphqlEndpoint;

    protected $applicant;

    protected $baseUser;

    protected $platformAdmin;

    protected $processOperator;

    protected $communityRecruiter;

    protected $communityAdmin;

    protected $communityTalentCoordinator;

    protected $communityId;

    protected array $workStreamIds;

    protected $input = [
        'jobInterest' => true,
        'trainingInterest' => false,
        'additionalInformation' => 'test additional info',
    ];

    protected $createMutation = <<<'GRAPHQL'
        mutation createCommunityInterestWithDevelopmentPrograms($communityInterestWithDevelopmentPrograms: CreateCommunityInterestWithDevelopmentProgramsInput!) {
            createCommunityInterestWithDevelopmentPrograms(communityInterestWithDevelopmentPrograms: $communityInterestWithDevelopmentPrograms) {
                jobInterest
                trainingInterest
                additionalInformation
                community {
                    id
                }
                workStreams {
                    id
                }
            }
        }
    GRAPHQL;

    protected $updateMutation = <<<'GRAPHQL'
        mutation updateCommunityInterestWithDevelopmentPrograms($communityInterestWithDevelopmentPrograms: UpdateCommunityInterestWithDevelopmentProgramsInput!) {
            updateCommunityInterestWithDevelopmentPrograms(communityInterestWithDevelopmentPrograms: $communityInterestWithDevelopmentPrograms) {
                id
                additionalInformation
            }
        }
    GRAPHQL;

    protected $paginatedCommunityInterestsQuery =
        /** @lang GraphQL */
        '
        query communityInterestsPaginated($where: CommunityInterestFilterInput){
            communityInterestsPaginated(where: $where) {
                data
                {
                    id
                }
                paginatorInfo
                {
                    total
                }
            }
        }
    ';

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);

        $this->applicant = User::factory()
            ->asGuest()
            ->asApplicant()
            ->withGovEmployeeProfile()
            ->withCommunityInterests(Community::factory()->count(3)->withWorkStreams()->create()->pluck('id')->toArray())
            ->create([
                'email' => 'community-interested-user@test.com',
                'sub' => 'community-interested-user@test.com',
            ]);

        $community = Community::factory()->withWorkStreams()->create();
        $this->communityId = $community->id;
        $this->workStreamIds = $community->workStreams()->pluck('id')->toArray();

        $communityPool = Pool::factory()->create(['community_id' => $this->communityId]);

        $this->baseUser = User::factory()->create();

        $this->platformAdmin = User::factory()
            ->asAdmin()
            ->create();

        $this->processOperator = User::factory()
            ->asProcessOperator($communityPool->id)
            ->create();

        $this->communityRecruiter = User::factory()
            ->asCommunityRecruiter($this->communityId)
            ->create();

        $this->communityAdmin = User::factory()
            ->asCommunityAdmin($this->communityId)
            ->create();

        $this->communityTalentCoordinator = User::factory()
            ->asCommunityTalentCoordinator($this->communityId)
            ->create();
    }

    /**
     * Test applicant can create just the community interest
     */
    public function testApplicantCanCreateOwnCommunityInterest()
    {

        $this->actingAs($this->applicant, 'api')
            ->graphQL(
                $this->createMutation,
                [
                    'communityInterestWithDevelopmentPrograms' => [
                        'userId' => $this->applicant->id,
                        'communityInterest' => [
                            'communityId' => $this->communityId,
                            ...$this->input,
                            'consentToShareProfile' => true,
                            'workStreams' => [
                                'sync' => [
                                    $this->workStreamIds[0],
                                ],
                            ],
                        ],
                    ],
                ])
            ->assertJson([
                'data' => [
                    'createCommunityInterestWithDevelopmentPrograms' => [
                        ...$this->input,
                        'community' => ['id' => $this->communityId],
                        'workStreams' => [
                            ['id' => $this->workStreamIds[0]],
                        ],
                    ],
                ],
            ]);
    }

    /**
     * Test applicant can create with development programs
     */
    public function testApplicantCanCreateOwnCommunityInterestWithDevelopmentPrograms()
    {
        $developmentProgram = DevelopmentProgram::factory()->create();
        $educationExperience = EducationExperience::factory()->create(['user_id' => $this->applicant->id]);

        $this->actingAs($this->applicant, 'api')
            ->graphQL(
                $this->createMutation,
                [
                    'communityInterestWithDevelopmentPrograms' => [
                        'userId' => $this->applicant->id,
                        'communityInterest' => [
                            'communityId' => $this->communityId,
                            ...$this->input,
                            'consentToShareProfile' => true,
                            'workStreams' => [
                                'sync' => [
                                    $this->workStreamIds[0],
                                ],
                            ],
                        ],
                        'developmentPrograms' => [
                            [
                                'developmentProgramId' => $developmentProgram->id,
                                'educationExperienceId' => $educationExperience->id,
                                'participationStatus' => DevelopmentProgramParticipationStatus::ENROLLED->name,
                            ],
                        ],
                    ],
                ])
            ->assertGraphQLErrorFree();

        // record in pivot table created
        $developmentProgramUserRecord = DB::table('development_program_user')->sole();
        assertEquals($developmentProgramUserRecord->development_program_id, $developmentProgram->id);
        assertEquals($developmentProgramUserRecord->user_id, $this->applicant->id);
        assertEquals($developmentProgramUserRecord->education_experience_id, $educationExperience->id);
        assertEquals($developmentProgramUserRecord->participation_status, DevelopmentProgramParticipationStatus::ENROLLED->name);
    }

    /**
     * Test applicant can create a community interest for Finance
     */
    public function testApplicantCanCreateOwnCommunityInterestForFinance()
    {
        $financeCommunity = Community::factory()->create([
            'key' => 'finance',
            'name' => [
                'en' => 'Financial Management Community',
                'fr' => 'Collectivité de la gestion financière',
            ],
        ]);

        $this->actingAs($this->applicant, 'api')
            ->graphQL(
                $this->createMutation,
                [
                    'communityInterestWithDevelopmentPrograms' => [
                        'userId' => $this->applicant->id,
                        'communityInterest' => [
                            'communityId' => $financeCommunity->id,
                            ...$this->input,
                            'financeIsChief' => true,
                            'communityInterestAdditionalDuties' => null,
                            'financeOtherRoles' => null,
                            'consentToShareProfile' => true,
                        ],
                    ],
                ])
            ->assertJson([
                'data' => [
                    'createCommunityInterestWithDevelopmentPrograms' => [
                        ...$this->input,
                        'community' => ['id' => $financeCommunity->id],
                    ],
                ],
            ]);
    }

    /**
     * Test applicant can create a community interest for Procurement
     */
    public function testApplicantCanCreateOwnCommunityInterestForProcurement()
    {
        $procurementCommunity = Community::factory()->create([
            'key' => 'procurement',
            'name' => [
                'en' => 'Procurement',
                'fr' => 'Procurement (French)',
            ],
        ]);

        $this->actingAs($this->applicant, 'api')
            ->graphQL(
                <<<'GRAPHQL'
                    mutation createCommunityInterestWithDevelopmentPrograms($communityInterestWithDevelopmentPrograms: CreateCommunityInterestWithDevelopmentProgramsInput!) {
                        createCommunityInterestWithDevelopmentPrograms(communityInterestWithDevelopmentPrograms: $communityInterestWithDevelopmentPrograms) {
                            community {
                                id
                            }
                            procurementIsSDO
                            communityInterestAdditionalDuties {
                                value
                            }
                            consentToShareProfile
                        }
                    }
                GRAPHQL,
                [
                    'communityInterestWithDevelopmentPrograms' => [
                        'userId' => $this->applicant->id,
                        'communityInterest' => [
                            'communityId' => $procurementCommunity->id,
                            'procurementIsSDO' => true,
                            'communityInterestAdditionalDuties' => [CommunityInterestAdditionalDuty::MATERIEL_MANAGEMENT->name],
                            'consentToShareProfile' => true,
                        ],
                    ],
                ])
            ->assertJson([
                'data' => [
                    'createCommunityInterestWithDevelopmentPrograms' => [
                        'community' => ['id' => $procurementCommunity->id],
                        'procurementIsSDO' => true,
                        'communityInterestAdditionalDuties' => [
                            [
                                'value' => 'MATERIEL_MANAGEMENT',
                            ],
                        ],
                        'consentToShareProfile' => true,
                    ],
                ],
            ]);
    }

    /**
     * Test applicant cannot connect someone else's experience
     */
    public function testApplicantCannotConnectOtherUsersEducationExperience()
    {
        $developmentProgram = DevelopmentProgram::factory()->create();
        $otherUserEducationExperience = EducationExperience::factory()->create(['user_id' => User::factory()->create()]);

        $this->actingAs($this->applicant, 'api')
            ->graphQL(
                $this->createMutation,
                [
                    'communityInterestWithDevelopmentPrograms' => [
                        'userId' => $this->applicant->id,
                        'communityInterest' => [
                            'communityId' => $this->communityId,
                            ...$this->input,
                            'consentToShareProfile' => true,
                            'workStreams' => [
                                'sync' => [
                                    $this->workStreamIds[0],
                                ],
                            ],
                        ],
                        'developmentPrograms' => [
                            [
                                'developmentProgramId' => $developmentProgram->id,
                                'educationExperienceId' => $otherUserEducationExperience->id,
                                'participationStatus' => DevelopmentProgramParticipationStatus::ENROLLED->name,
                            ],
                        ],
                    ],
                ])
            ->assertGraphQLValidationError('communityInterestWithDevelopmentPrograms.developmentPrograms.0.educationExperienceId', ErrorCode::DEVELOPMENT_PROGRAM_MUST_CONNECT_OWN_EDUCATION_EXPERIENCE->name);
    }

    /**
     * Test applicant can update own
     */
    public function testApplicantCanUpdateOwn()
    {
        $communityInterestId = $this->applicant->employeeProfile->communityInterests[0]?->id;

        $this->actingAs($this->applicant, 'api')
            ->graphQL($this->updateMutation,
                [
                    'communityInterestWithDevelopmentPrograms' => [
                        'id' => $communityInterestId,
                        'communityInterest' => [
                            'additionalInformation' => 'new info',
                            'consentToShareProfile' => true,
                        ],
                    ],
                ])
            ->assertJson([
                'data' => [
                    'updateCommunityInterestWithDevelopmentPrograms' => [
                        'id' => $communityInterestId,
                        'additionalInformation' => 'new info',
                    ],
                ],
            ]);
    }

    /**
     * Test applicant can delete own
     */
    public function testApplicantCanDeleteOwn()
    {
        $communityInterest = $this->applicant->employeeProfile->communityInterests()->first();

        $this->actingAs($this->applicant, 'api')
            ->graphQL(<<<'GRAPHQL'
                mutation DeleteCommunityInterest($id: UUID!) {
                    deleteCommunityInterest(id: $id) {
                        id
                    }
                }
            GRAPHQL, [
                'id' => $communityInterest->id,
            ])
            ->assertJson([
                'data' => [
                    'deleteCommunityInterest' => ['id' => $communityInterest->id],
                ],
            ]);

        $this->assertDatabaseMissing('community_interests', ['id' => $communityInterest->id]);
    }

    /**
     * Test applicants cannot create for another
     */
    public function testApplicantCannotCreateForOtherUser()
    {
        $otherId = User::factory()->create()->id;

        $this->actingAs($this->applicant, 'api')
            ->graphQL($this->createMutation, [
                'communityInterestWithDevelopmentPrograms' => [
                    'userId' => $otherId,
                    'communityInterest' => [
                        'communityId' => $this->communityId,
                        ...$this->input,
                        'consentToShareProfile' => true,
                        'workStreams' => [
                            'sync' => [
                                $this->workStreamIds[0],
                            ],
                        ],
                    ],
                ],
            ])
            ->assertGraphQLErrorMessage('This action is unauthorized.');
    }

    public function testCommunityExistsValidation()
    {
        $this->actingAs($this->applicant, 'api')
            ->graphQL($this->createMutation, [
                'communityInterestWithDevelopmentPrograms' => [
                    'userId' => $this->applicant->id,
                    'communityInterest' => [
                        'communityId' => Str::uuid(),
                        ...$this->input,
                        'consentToShareProfile' => true,

                    ],
                ],
            ])
            ->assertGraphQLValidationError('communityInterestWithDevelopmentPrograms.communityInterest.communityId', ErrorCode::COMMUNITY_NOT_FOUND->name);
    }

    public function testUniqueValidation()
    {
        $communityId = $this->applicant->employeeProfile->communityInterests()->first()->community->id;

        $this->actingAs($this->applicant, 'api')
            ->graphQL($this->createMutation, [
                'communityInterestWithDevelopmentPrograms' => [
                    'userId' => $this->applicant->id,
                    'communityInterest' => [
                        'communityId' => $communityId,
                        ...$this->input,
                        'consentToShareProfile' => true,
                    ],
                ],
            ])
            ->assertGraphQLValidationError('communityInterestWithDevelopmentPrograms.communityInterest.communityId', ErrorCode::COMMUNITY_INTEREST_EXISTS->name);
    }

    public function testWorkStreamInCommunityValidation()
    {
        $community = Community::factory()->withWorkStreams()->create(); // No work streams
        $workStream = WorkStream::factory()->create([
            'community_id' => $this->communityId,
        ]);

        $this->actingAs($this->applicant, 'api')
            ->graphQL($this->createMutation, [
                'communityInterestWithDevelopmentPrograms' => [
                    'userId' => $this->applicant->id,
                    'communityInterest' => [
                        'communityId' => $community->id,
                        ...$this->input,
                        'consentToShareProfile' => true,
                        'workStreams' => [
                            'sync' => [
                                $workStream->id,
                            ],
                        ],
                    ],
                ],
            ])
            ->assertGraphQLValidationError('communityInterestWithDevelopmentPrograms.communityInterest.workStreams.sync.0', ErrorCode::WORK_STREAM_NOT_IN_COMMUNITY->name);
    }

    // test querying CommunityInterests with various roles
    public function testCommunityInterestsPaginatedRoles(): void
    {
        CommunityInterest::truncate();
        /** @var User */
        $owningUser = User::factory()->withGovEmployeeProfile()->asApplicant()->create();
        $communityInterestModel = CommunityInterest::factory()->create([
            'user_id' => $owningUser->id,
            'community_id' => $this->communityId,
            'consent_to_share_profile' => true,
        ]);

        // these roles cannot see the created model
        $this->actingAs($this->applicant, 'api')->graphQL(
            $this->paginatedCommunityInterestsQuery,
            [],
        )->assertJsonFragment(['total' => 0]);
        $this->actingAs($this->baseUser, 'api')->graphQL(
            $this->paginatedCommunityInterestsQuery,
            [],
        )->assertJsonFragment(['total' => 0]);
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            $this->paginatedCommunityInterestsQuery,
            [],
        )->assertJsonFragment(['total' => 1]);
        $this->actingAs($this->processOperator, 'api')->graphQL(
            $this->paginatedCommunityInterestsQuery,
            [],
        )->assertJsonFragment(['total' => 0]);

        // community recruiter/coordinator/admin can see the model
        $this->actingAs($this->communityRecruiter, 'api')->graphQL(
            $this->paginatedCommunityInterestsQuery,
            [],
        )->assertJsonFragment(['total' => 1])
            ->assertJsonFragment(['id' => $communityInterestModel->id]);
        $this->actingAs($this->communityTalentCoordinator, 'api')->graphQL(
            $this->paginatedCommunityInterestsQuery,
            [],
        )->assertJsonFragment(['total' => 1])
            ->assertJsonFragment(['id' => $communityInterestModel->id]);
        $this->actingAs($this->communityAdmin, 'api')->graphQL(
            $this->paginatedCommunityInterestsQuery,
            [],
        )->assertJsonFragment(['total' => 1])
            ->assertJsonFragment(['id' => $communityInterestModel->id]);
        // base user can see their own community interest
        $this->actingAs($owningUser, 'api')->graphQL(
            $this->paginatedCommunityInterestsQuery,
            [],
        )->assertJsonFragment(['total' => 1])
            ->assertJsonFragment(['id' => $communityInterestModel->id]);

        // community recruiter/admin/coordinator of another community do not see the model
        $otherCommunityRecruiter = User::factory()
            ->asCommunityRecruiter(Community::factory()->create()->id)
            ->create();
        $otherCommunityAdmin = User::factory()
            ->asCommunityAdmin(Community::factory()->create()->id)
            ->create();
        $otherCommunityTalentCoordinator = User::factory()
            ->asCommunityTalentCoordinator(Community::factory()->create()->id)
            ->create();
        $this->actingAs($otherCommunityRecruiter, 'api')->graphQL(
            $this->paginatedCommunityInterestsQuery,
            [],
        )->assertJsonFragment(['total' => 0]);
        $this->actingAs($otherCommunityAdmin, 'api')->graphQL(
            $this->paginatedCommunityInterestsQuery,
            [],
        )->assertJsonFragment(['total' => 0]);
        $this->actingAs($otherCommunityTalentCoordinator, 'api')->graphQL(
            $this->paginatedCommunityInterestsQuery,
            [],
        )->assertJsonFragment(['total' => 0]);
    }

    // test scopeAuthorizedToView for community recruiter/coordinator
    // scope acts on community and job/training interest
    public function testCommunityInterestsPaginatedAuthorizedToView(): void
    {
        CommunityInterest::truncate();
        $communityInterestWithConsent = CommunityInterest::factory()->create([
            'user_id' => User::factory()->withGovEmployeeProfile(),
            'community_id' => $this->communityId,
            'consent_to_share_profile' => true,
        ]);
        $communityInterestWithoutConsent = CommunityInterest::factory()->create([
            'user_id' => User::factory()->withGovEmployeeProfile(),
            'community_id' => $this->communityId,
            'consent_to_share_profile' => false,
        ]);
        $otherCommunityInterest = CommunityInterest::factory()->create([
            'user_id' => User::factory()->withGovEmployeeProfile(),
            'community_id' => Community::factory(),
            'consent_to_share_profile' => true,
        ]);

        // three records in total
        assertEquals(3, count(CommunityInterest::all()));

        // one result should be returned in total for both roles
        // communityInterestWithConsent

        $this->actingAs($this->communityRecruiter, 'api')->graphQL(
            $this->paginatedCommunityInterestsQuery,
            [],
        )->assertJsonFragment(['total' => 1])
            ->assertJsonFragment(['id' => $communityInterestWithConsent->id]);
        $this->actingAs($this->communityTalentCoordinator, 'api')->graphQL(
            $this->paginatedCommunityInterestsQuery,
            [],
        )->assertJsonFragment(['total' => 1])
            ->assertJsonFragment(['id' => $communityInterestWithConsent->id]);
    }

    // test mobility type and mobility interest in community interest filter
    public function testCommunityInterestFilter(): void
    {
        CommunityInterest::truncate();
        $communityInterestWithJobInterest = CommunityInterest::factory()->create([
            'user_id' => User::factory()->withGovEmployeeProfile(),
            'community_id' => $this->communityId,
            'consent_to_share_profile' => true,
            'job_interest' => true,
            'training_interest' => false,
        ]);
        $communityInterestWithTrainingInterest = CommunityInterest::factory()->create([
            'user_id' => User::factory()->withGovEmployeeProfile(),
            'community_id' => $this->communityId,
            'consent_to_share_profile' => true,
            'job_interest' => false,
            'training_interest' => true,
        ]);
        $communityInterestWithBothInterests = CommunityInterest::factory()->create([
            'user_id' => User::factory()->withGovEmployeeProfile(),
            'community_id' => $this->communityId,
            'consent_to_share_profile' => true,
            'job_interest' => true,
            'training_interest' => true,
        ]);
        $communityInterestWithNoInterests = CommunityInterest::factory()->create([
            'user_id' => User::factory()->withGovEmployeeProfile(),
            'community_id' => $this->communityId,
            'consent_to_share_profile' => true,
            'job_interest' => false,
            'training_interest' => false,
        ]);

        // Test community interest filter where job interest is true and training interest is false
        $this->actingAs($this->communityTalentCoordinator, 'api')->graphQL(
            $this->paginatedCommunityInterestsQuery,
            [
                'where' => [
                    'jobInterest' => true,
                    'trainingInterest' => false,
                ],
            ]
        )->assertJsonFragment(['total' => 2])
            ->assertJsonFragment(['id' => $communityInterestWithJobInterest->id])
            ->assertJsonFragment(['id' => $communityInterestWithBothInterests->id]);

        // Test community interest filter where job interest is false and training interest is true
        $this->actingAs($this->communityTalentCoordinator, 'api')->graphQL(
            $this->paginatedCommunityInterestsQuery,
            [
                'where' => [
                    'jobInterest' => false,
                    'trainingInterest' => true,
                ],
            ]
        )->assertJsonFragment(['total' => 2])
            ->assertJsonFragment(['id' => $communityInterestWithTrainingInterest->id])
            ->assertJsonFragment(['id' => $communityInterestWithBothInterests->id]);

        // Test community interest filter where job interest is false and training interest is false
        // NOTE: Should assert a total of 4 results since we show any user as long as they consented to share their profile
        $this->actingAs($this->communityTalentCoordinator, 'api')->graphQL(
            $this->paginatedCommunityInterestsQuery,
            [
                'where' => [
                    'jobInterest' => false,
                    'trainingInterest' => false,
                ],
            ]
        )->assertJsonFragment(['total' => 4])
            ->assertJsonFragment(['id' => $communityInterestWithJobInterest->id])
            ->assertJsonFragment(['id' => $communityInterestWithTrainingInterest->id])
            ->assertJsonFragment(['id' => $communityInterestWithBothInterests->id])
            ->assertJsonFragment(['id' => $communityInterestWithNoInterests->id]);

        // Test community interest filter where job interest is true and training interest is true
        $this->actingAs($this->communityTalentCoordinator, 'api')->graphQL(
            $this->paginatedCommunityInterestsQuery,
            [
                'where' => [
                    'jobInterest' => true,
                    'trainingInterest' => true,
                ],
            ]
        )->assertJsonFragment(['total' => 1])
            ->assertJsonFragment(['id' => $communityInterestWithBothInterests->id]);
    }

    /**
     * Test applicant can update the linked education experience on a development program
     */
    public function testApplicantCanUpdateLinkedExperience(): void
    {
        $developmentProgram = DevelopmentProgram::factory()->create();
        $originalExperience = EducationExperience::factory()->create(['user_id' => $this->applicant->id]);
        $newExperience = EducationExperience::factory()->create(['user_id' => $this->applicant->id]);

        $communityInterest = CommunityInterest::factory()->create([
            'user_id' => $this->applicant->id,
            'community_id' => $this->communityId,
            'consent_to_share_profile' => true,
        ]);

        DB::table('development_program_user')->insert([
            'id' => Str::uuid(),
            'development_program_id' => $developmentProgram->id,
            'user_id' => $this->applicant->id,
            'education_experience_id' => $originalExperience->id,
            'participation_status' => DevelopmentProgramParticipationStatus::COMPLETED->name,
            'completion_date' => null,
        ]);

        $this->actingAs($this->applicant, 'api')
            ->graphQL($this->updateMutation, [
                'communityInterestWithDevelopmentPrograms' => [
                    'id' => $communityInterest->id,
                    'communityInterest' => ['consentToShareProfile' => true],
                    'developmentPrograms' => [
                        [
                            'developmentProgramId' => $developmentProgram->id,
                            'educationExperienceId' => $newExperience->id,
                            'participationStatus' => DevelopmentProgramParticipationStatus::COMPLETED->name,
                        ],
                    ],
                ],
            ])
            ->assertGraphQLErrorFree();

        $this->assertDatabaseHas('development_program_user', [
            'development_program_id' => $developmentProgram->id,
            'user_id' => $this->applicant->id,
            'education_experience_id' => $newExperience->id,
        ]);
    }

    /**
     * Test applicant can remove a linked education experience by setting it to null
     */
    public function testApplicantCanUnlinkExperience(): void
    {
        $developmentProgram = DevelopmentProgram::factory()->create();
        $experience = EducationExperience::factory()->create(['user_id' => $this->applicant->id]);

        $communityInterest = CommunityInterest::factory()->create([
            'user_id' => $this->applicant->id,
            'community_id' => $this->communityId,
            'consent_to_share_profile' => true,
        ]);

        DB::table('development_program_user')->insert([
            'id' => Str::uuid(),
            'development_program_id' => $developmentProgram->id,
            'user_id' => $this->applicant->id,
            'education_experience_id' => $experience->id,
            'participation_status' => DevelopmentProgramParticipationStatus::COMPLETED->name,
            'completion_date' => null,
        ]);

        $this->actingAs($this->applicant, 'api')
            ->graphQL($this->updateMutation, [
                'communityInterestWithDevelopmentPrograms' => [
                    'id' => $communityInterest->id,
                    'communityInterest' => ['consentToShareProfile' => true],
                    'developmentPrograms' => [
                        [
                            'developmentProgramId' => $developmentProgram->id,
                            'educationExperienceId' => null,
                            'participationStatus' => DevelopmentProgramParticipationStatus::COMPLETED->name,
                        ],
                    ],
                ],
            ])
            ->assertGraphQLErrorFree();

        $this->assertDatabaseHas('development_program_user', [
            'development_program_id' => $developmentProgram->id,
            'user_id' => $this->applicant->id,
            'education_experience_id' => null,
        ]);
    }

    /**
     * COMPLETED status with null completionDate is now valid (completionDate validation removed)
     */
    public function testCompletedStatusWithNullCompletionDateIsValid(): void
    {
        $developmentProgram = DevelopmentProgram::factory()->create();

        $this->actingAs($this->applicant, 'api')
            ->graphQL($this->createMutation, [
                'communityInterestWithDevelopmentPrograms' => [
                    'userId' => $this->applicant->id,
                    'communityInterest' => [
                        'communityId' => $this->communityId,
                        ...$this->input,
                        'consentToShareProfile' => true,
                    ],
                    'developmentPrograms' => [
                        [
                            'developmentProgramId' => $developmentProgram->id,
                            'participationStatus' => DevelopmentProgramParticipationStatus::COMPLETED->name,
                            'completionDate' => null,
                        ],
                    ],
                ],
            ])
            ->assertGraphQLErrorFree();

        $this->assertDatabaseHas('development_program_user', [
            'development_program_id' => $developmentProgram->id,
            'user_id' => $this->applicant->id,
            'participation_status' => DevelopmentProgramParticipationStatus::COMPLETED->name,
            'completion_date' => null,
        ]);
    }

    // test scope called off user model
    public function testScopeIsVerifiedGovEmployee(): void
    {
        CommunityInterest::truncate();
        $isEmployee = CommunityInterest::factory()->create([
            'user_id' => User::factory()->withGovEmployeeProfile(),
            'community_id' => $this->communityId,
            'consent_to_share_profile' => true,
            'job_interest' => true,
            'training_interest' => false,
        ]);
        $notEmployee = CommunityInterest::factory()->create([
            'user_id' => User::factory()->create(['computed_is_gov_employee' => false]),
            'community_id' => $this->communityId,
            'consent_to_share_profile' => true,
            'job_interest' => false,
            'training_interest' => true,
        ]);

        // two records, but scope only returns $isEmployee
        assertEquals(2, count(CommunityInterest::all()));

        $query = CommunityInterest::query();
        $communityInterestIds = CommunityInterest::scopeIsVerifiedGovEmployee($query)->get()->pluck('id')->toArray();
        assertEqualsCanonicalizing([
            $isEmployee->id,
        ], $communityInterestIds);
    }
}
