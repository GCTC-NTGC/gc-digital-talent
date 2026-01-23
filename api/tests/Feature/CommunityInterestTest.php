<?php

namespace Tests\Feature;

use App\Enums\ErrorCode;
use App\Models\Community;
use App\Models\CommunityInterest;
use App\Models\Pool;
use App\Models\User;
use App\Models\WorkStream;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
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
        mutation CreateCommunityInterest($communityInterest: CreateCommunityInterestInput!) {
            createCommunityInterest(communityInterest: $communityInterest) {
                id
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
     * Test applicant can create
     */
    public function testApplicantCanCreateOwn()
    {

        $this->actingAs($this->applicant, 'api')
            ->graphQL(<<<'GRAPHQL'
                mutation CreateCommunityInterest($communityInterest: CreateCommunityInterestInput!) {
                    createCommunityInterest(communityInterest: $communityInterest) {
                        id
                        jobInterest
                        trainingInterest
                        additionalInformation
                        community { id }
                        workStreams { id }
                    }
                }
                GRAPHQL,
                [
                    'communityInterest' => [
                        ...$this->input,
                        'userId' => $this->applicant->id,
                        'community' => ['connect' => $this->communityId],
                        'consentToShareProfile' => true,
                        'workStreams' => [
                            'sync' => [
                                $this->workStreamIds[0],
                            ],
                        ],
                    ],
                ])
            ->assertJson([
                'data' => [
                    'createCommunityInterest' => [
                        ...$this->input,
                        'community' => ['id' => $this->communityId],
                        'workStreams' => [['id' => $this->workStreamIds[0]]],
                    ],
                ],
            ]);
    }

    /**
     * Test applicant can update own
     */
    public function testApplicantCanUpdateOwn()
    {
        $communityInterestId = $this->applicant->employeeProfile->communityInterests[0]?->id;

        $this->actingAs($this->applicant, 'api')
            ->graphQL(<<<'GRAPHQL'
                mutation UpdateCommunityInterest($communityInterest: UpdateCommunityInterestInput!) {
                    updateCommunityInterest(communityInterest: $communityInterest) {
                        id
                        additionalInformation
                    }
                }
                GRAPHQL, [
                'communityInterest' => [
                    'id' => $communityInterestId,
                    'additionalInformation' => 'new info',
                    'consentToShareProfile' => true,
                ],
            ])
            ->assertJson([
                'data' => [
                    'updateCommunityInterest' => [
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
                'communityInterest' => [
                    ...$this->input,
                    'userId' => $otherId,
                    'consentToShareProfile' => true,
                    'community' => ['connect' => $this->communityId],
                    'workStreams' => ['sync' => $this->workStreamIds],
                ],
            ])
            ->assertGraphQLErrorMessage('This action is unauthorized.');
    }

    public function testCommunityExistsValidation()
    {
        $this->actingAs($this->applicant, 'api')
            ->graphQL($this->createMutation, [
                'communityInterest' => [
                    ...$this->input,
                    'userId' => $this->applicant->id,
                    'community' => ['connect' => Str::uuid()],
                ],
            ])
            ->assertGraphQLValidationError('communityInterest.community.connect', ErrorCode::COMMUNITY_NOT_FOUND->name);
    }

    public function testUniqueValidation()
    {
        $community = $this->applicant->employeeProfile->communityInterests()->first()->community->id;

        $this->actingAs($this->applicant, 'api')
            ->graphQL($this->createMutation, [
                'communityInterest' => [
                    ...$this->input,
                    'userId' => $this->applicant->id,
                    'community' => ['connect' => $community],
                ],
            ])
            ->assertGraphQLValidationError('communityInterest.community.connect', ErrorCode::COMMUNITY_INTEREST_EXISTS->name);
    }

    public function testWorkStreamInCommunityValidation()
    {
        $community = Community::factory()->withWorkStreams()->create(); // No work streams
        $workStream = WorkStream::factory()->create([
            'community_id' => $this->communityId,
        ]);

        $this->actingAs($this->applicant, 'api')
            ->graphQL($this->createMutation, [
                'communityInterest' => [
                    ...$this->input,
                    'userId' => $this->applicant->id,
                    'community' => ['connect' => $community->id],
                    'workStreams' => [
                        'sync' => ['id' => $workStream->id],
                    ],
                ],
            ])
            ->assertGraphQLValidationError('communityInterest.workStreams.sync.0', ErrorCode::WORK_STREAM_NOT_IN_COMMUNITY->name);
    }

    // test querying CommunityInterests with various roles
    public function testCommunityInterestsPaginatedRoles(): void
    {
        CommunityInterest::truncate();
        /** @var \App\Models\User */
        $owningUser = User::factory()->withGovEmployeeProfile()->create();
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
