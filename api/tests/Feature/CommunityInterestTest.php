<?php

namespace Tests\Feature;

use App\Models\Community;
use App\Models\CommunityInterest;
use App\Models\Pool;
use App\Models\User;
use App\Models\WorkStream;
use Database\Helpers\ApiErrorEnums;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Tests\TestCase;
use Tests\UsesProtectedGraphqlEndpoint;

use function PHPUnit\Framework\assertEquals;

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
            ->assertGraphQLValidationError('communityInterest.community.connect', ApiErrorEnums::COMMUNITY_NOT_FOUND);
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
            ->assertGraphQLValidationError('communityInterest.community.connect', ApiErrorEnums::COMMUNITY_INTEREST_EXISTS);
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
            ->assertGraphQLValidationError('communityInterest.workStreams.sync.0', ApiErrorEnums::WORK_STREAM_NOT_IN_COMMUNITY);
    }

    // test querying CommunityInterests with various roles
    public function testCommunityInterestsPaginatedRoles(): void
    {
        CommunityInterest::truncate();
        $communityInterestModel = CommunityInterest::factory()->create([
            'community_id' => $this->communityId,
            'job_interest' => true,
            'training_interest' => true,
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
        )->assertJsonFragment(['total' => 0]);
        $this->actingAs($this->processOperator, 'api')->graphQL(
            $this->paginatedCommunityInterestsQuery,
            [],
        )->assertJsonFragment(['total' => 0]);

        // only community recruiter and community admin can see the model
        $this->actingAs($this->communityRecruiter, 'api')->graphQL(
            $this->paginatedCommunityInterestsQuery,
            [],
        )->assertJsonFragment(['total' => 1])
            ->assertJsonFragment(['id' => $communityInterestModel->id]);
        $this->actingAs($this->communityAdmin, 'api')->graphQL(
            $this->paginatedCommunityInterestsQuery,
            [],
        )->assertJsonFragment(['total' => 1])
            ->assertJsonFragment(['id' => $communityInterestModel->id]);

        // community recruiter and admin of another community do not see the model
        $otherCommunityRecruiter = User::factory()
            ->asCommunityRecruiter(Community::factory()->create()->id)
            ->create();
        $otherCommunityAdmin = User::factory()
            ->asCommunityAdmin(Community::factory()->create()->id)
            ->create();
        $this->actingAs($otherCommunityRecruiter, 'api')->graphQL(
            $this->paginatedCommunityInterestsQuery,
            [],
        )->assertJsonFragment(['total' => 0]);
        $this->actingAs($otherCommunityAdmin, 'api')->graphQL(
            $this->paginatedCommunityInterestsQuery,
            [],
        )->assertJsonFragment(['total' => 0]);
    }

    // test scopeAuthorizedToView for community admin and community recruiter
    // scope acts on community and job/training interest
    public function testCommunityInterestsPaginatedAuthorizedToView(): void
    {
        CommunityInterest::truncate();
        $communityInterestWithBothInterests = CommunityInterest::factory()->create([
            'user_id' => User::factory(),
            'community_id' => $this->communityId,
            'job_interest' => true,
            'training_interest' => true,
        ]);
        $communityInterestWithJobInterest = CommunityInterest::factory()->create([
            'user_id' => User::factory(),
            'community_id' => $this->communityId,
            'job_interest' => true,
            'training_interest' => false,
        ]);
        $communityInterestWithTrainingInterest = CommunityInterest::factory()->create([
            'user_id' => User::factory(),
            'community_id' => $this->communityId,
            'job_interest' => false,
            'training_interest' => true,
        ]);
        $communityInterestWithNoInterests = CommunityInterest::factory()->create([
            'user_id' => User::factory(),
            'community_id' => $this->communityId,
            'job_interest' => false,
            'training_interest' => false,
        ]);
        $otherCommunityInterest = CommunityInterest::factory()->create([
            'user_id' => User::factory(),
            'community_id' => Community::factory(),
            'job_interest' => false,
            'training_interest' => false,
        ]);

        // five records in total
        assertEquals(5, count(CommunityInterest::all()));

        // three results should be returned in total for both roles
        // communityInterestWithBothInterests
        // communityInterestWithJobInterest
        // communityInterestWithTrainingInterest

        $this->actingAs($this->communityRecruiter, 'api')->graphQL(
            $this->paginatedCommunityInterestsQuery,
            [],
        )->assertJsonFragment(['total' => 3])
            ->assertJsonFragment(['id' => $communityInterestWithBothInterests->id])
            ->assertJsonFragment(['id' => $communityInterestWithJobInterest->id])
            ->assertJsonFragment(['id' => $communityInterestWithTrainingInterest->id]);

        $this->actingAs($this->communityAdmin, 'api')->graphQL(
            $this->paginatedCommunityInterestsQuery,
            [],
        )->assertJsonFragment(['total' => 3])
            ->assertJsonFragment(['id' => $communityInterestWithBothInterests->id])
            ->assertJsonFragment(['id' => $communityInterestWithJobInterest->id])
            ->assertJsonFragment(['id' => $communityInterestWithTrainingInterest->id]);
    }
}
