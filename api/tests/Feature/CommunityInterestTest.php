<?php

namespace Tests\Feature;

use App\Models\Community;
use App\Models\User;
use App\Models\WorkStream;
use Database\Helpers\ApiErrorEnums;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Tests\TestCase;
use Tests\UsesProtectedGraphqlEndpoint;

class communityInterestTest extends TestCase
{
    use MakesGraphQLRequests;
    use RefreshDatabase;
    use RefreshesSchemaCache;
    use UsesProtectedGraphqlEndpoint;

    protected $applicant;

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

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);

        $this->applicant = User::factory()
            ->asGuest()
            ->asApplicant()
            ->withCommunityInterests()
            ->create([
                'email' => 'community-interested-user@test.com',
                'sub' => 'community-interested-user@test.com',
            ]);

        $community = Community::factory()->withWorkStreams()->create();
        $this->communityId = $community->id;
        $this->workStreamIds = $community->workStreams()->pluck('id')->toArray();

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
                        'workStreams' => ['sync' => $this->workStreamIds],
                    ],
                ])
            ->assertJson([
                'data' => [
                    'createCommunityInterest' => [
                        ...$this->input,
                        'community' => ['id' => $this->communityId],
                        'workStreams' => Arr::map($this->workStreamIds, fn ($id) => ['id' => $id]),
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
                mutation UpdateCommunityInterest($id: UUID!, $communityInterest: UpdateCommunityInterestInput!) {
                    updateCommunityInterest(id: $id, communityInterest: $communityInterest) {
                        id
                        additionalInformation
                    }
                }
                GRAPHQL, [
                'id' => $communityInterestId,
                'communityInterest' => [
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
}
