<?php

namespace Tests\Feature;

use App\Models\Community;
use App\Models\DevelopmentProgram;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Tests\TestCase;
use Tests\UsesProtectedGraphqlEndpoint;

class DevelopmentProgramInterestTest extends TestCase
{
    use MakesGraphQLRequests;
    use RefreshDatabase;
    use RefreshesSchemaCache;
    use UsesProtectedGraphqlEndpoint;

    protected $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);

        $this->user = User::factory()
            ->asApplicant()
            ->create([
                'email' => 'community-interested-user@test.com',
                'sub' => 'community-interested-user@test.com',
            ]);
    }

    /**
     * Test user can create
     */
    public function testUserCanCreate()
    {
        $community = Community::factory()->has(DevelopmentProgram::factory())->create();

        $this->actingAs($this->user, 'api')
            ->graphQL(<<<'GRAPHQL'
                mutation CreateCommunityInterest($communityInterest: CreateCommunityInterestInput!) {
                    createCommunityInterest(communityInterest: $communityInterest) {
                        id
                        community { id }
                        interestInDevelopmentPrograms {
                            id
                            developmentProgram { id }
                            participationStatus
                            completionDate
                        }
                    }
                }
                GRAPHQL,
                [
                    'communityInterest' => [
                        'userId' => $this->user->id,
                        'community' => ['connect' => $community->id],
                        'interestInDevelopmentPrograms' => [
                            'create' => [
                                [
                                    'developmentProgramId' => $community->developmentPrograms->sole()->id,
                                    'participationStatus' => 'COMPLETED',
                                    'completionDate' => '2020-01-01',
                                ],
                            ],
                        ],
                    ],
                ])
            ->assertJson([
                'data' => [
                    'createCommunityInterest' => [
                        'community' => ['id' => $community->id],
                        'interestInDevelopmentPrograms' => [
                            [
                                'developmentProgram' => ['id' => $community->developmentPrograms->sole()->id],
                                'participationStatus' => 'COMPLETED',
                                'completionDate' => '2020-01-01',
                            ],
                        ],
                    ],
                ],
            ]);
    }

    /**
     * Can't add a completion date to the development program interest if the status is not completed
     */
    public function testUserCantAddCompletionDateWithoutStatus()
    {
        $community = Community::factory()->has(DevelopmentProgram::factory())->create();

        $this->actingAs($this->user, 'api')
            ->graphQL(<<<'GRAPHQL'
                mutation CreateCommunityInterest($communityInterest: CreateCommunityInterestInput!) {
                    createCommunityInterest(communityInterest: $communityInterest) {
                        id
                    }
                }
                GRAPHQL,
                [
                    'communityInterest' => [
                        'userId' => $this->user->id,
                        'community' => ['connect' => $community->id],
                        'interestInDevelopmentPrograms' => [
                            'create' => [
                                [
                                    'developmentProgramId' => $community->developmentPrograms->sole()->id,
                                    'participationStatus' => 'INTERESTED',
                                    'completionDate' => '2020-01-01',
                                ],
                            ],
                        ],
                    ],
                ])
            ->assertGraphQLValidationError('communityInterest.interestInDevelopmentPrograms.create.0.completionDate', 'The community interest.interest in development programs.create.0.completion date field is prohibited.');
    }

    /**
     * Can't set the development program interest to completed without a completion date
     */
    public function testUserCantUseCompletionStatusWithoutDate()
    {
        $community = Community::factory()->has(DevelopmentProgram::factory())->create();

        $this->actingAs($this->user, 'api')
            ->graphQL(<<<'GRAPHQL'
                mutation CreateCommunityInterest($communityInterest: CreateCommunityInterestInput!) {
                    createCommunityInterest(communityInterest: $communityInterest) {
                        id
                    }
                }
                GRAPHQL,
                [
                    'communityInterest' => [
                        'userId' => $this->user->id,
                        'community' => ['connect' => $community->id],
                        'interestInDevelopmentPrograms' => [
                            'create' => [
                                [
                                    'developmentProgramId' => $community->developmentPrograms->sole()->id,
                                    'participationStatus' => 'COMPLETED',
                                ],
                            ],
                        ],
                    ],
                ])
            ->assertGraphQLValidationError('communityInterest.interestInDevelopmentPrograms.create.0.completionDate', 'The community interest.interest in development programs.create.0.completion date field is required.');
    }

    /**
     * Can't set the development program interest to a development program from another community
     */
    public function testCantUsedDevelopmentProgramFromOtherCommunity()
    {
        $community1 = Community::factory()->has(DevelopmentProgram::factory())->create();
        $community2 = Community::factory()->has(DevelopmentProgram::factory())->create();

        $this->actingAs($this->user, 'api')
            ->graphQL(<<<'GRAPHQL'
                mutation CreateCommunityInterest($communityInterest: CreateCommunityInterestInput!) {
                    createCommunityInterest(communityInterest: $communityInterest) {
                        id
                    }
                }
                GRAPHQL,
                [
                    'communityInterest' => [
                        'userId' => $this->user->id,
                        'community' => ['connect' => $community1->id],
                        'interestInDevelopmentPrograms' => [
                            'create' => [
                                [
                                    'developmentProgramId' => $community2->developmentPrograms->sole()->id,

                                ],
                            ],
                        ],
                    ],
                ])
            ->assertGraphQLValidationError('communityInterest.interestInDevelopmentPrograms.create.0.developmentProgramId', 'DevelopmentProgramNotValidForCommunity');
    }
}
