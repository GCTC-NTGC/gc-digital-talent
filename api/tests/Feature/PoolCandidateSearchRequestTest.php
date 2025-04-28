<?php

namespace Tests\Feature;

use App\Enums\PoolCandidateSearchPositionType;
use App\Enums\PoolCandidateSearchRequestReason;
use App\Models\Community;
use App\Models\Department;
use App\Models\PoolCandidateSearchRequest;
use App\Models\User;
use Database\Seeders\CommunitySeeder;
use Database\Seeders\DepartmentSeeder;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Testing\Fluent\AssertableJson;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Tests\TestCase;
use Tests\UsesProtectedGraphqlEndpoint;

class PoolCandidateSearchRequestTest extends TestCase
{
    use MakesGraphQLRequests;
    use RefreshDatabase;
    use RefreshesSchemaCache;
    use UsesProtectedGraphqlEndpoint;

    protected $adminUser;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);
        $this->bootRefreshesSchemaCache();

        $this->adminUser = User::factory()
            ->asApplicant()
            ->asAdmin()
            ->create([
                'email' => 'admin-user@test.com',
                'sub' => 'admin-user@test.com',
            ]);
    }

    /**
     * Get Input for mutation
     *
     * @param   array<mixed>    input to merge with default
     * @param   array<mixed>    Final input values
     */
    private function getInput($additionalInput)
    {
        $defaultInput = [
            'fullName' => 'Test',
            'email' => 'test@domain.com',
            'jobTitle' => 'Job Title',
            'managerJobTitle' => 'Manager',
            'positionType' => PoolCandidateSearchPositionType::INDIVIDUAL_CONTRIBUTOR->name,
            'reason' => PoolCandidateSearchRequestReason::GENERAL_INTEREST->name,
            'initialResultCount' => 100,
        ];

        return array_merge($defaultInput, $additionalInput);
    }

    /**
     * Run generic mutation with input
     *
     * @param   array<mixed>    CreatePoolCandidateSearchRequestInput
     * @return \Illuminate\Testing\TestResponse
     */
    private function runCreateMutation($input)
    {
        return $this->graphQL(
            /** @lang GraphQL */
            '
            mutation createPoolCandidateSearchRequest($input: CreatePoolCandidateSearchRequestInput!) {
                createPoolCandidateSearchRequest(poolCandidateSearchRequest: $input) {
                    id
                }
            }
            ',
            [
                'input' => $this->getInput($input),
            ]
        );
    }

    /**
     * Test create mutation fail when applicantFilter is not present
     *
     * @return void
     */
    public function testMutationCreateFailsWithNoFilter()
    {
        $this->seed(DepartmentSeeder::class);
        $departmentId = Department::inRandomOrder()->first()->id;
        $errorMessage = "Variable \"\$input\" got invalid value {\"fullName\":\"Test\",\"email\":\"test@domain.com\",\"jobTitle\":\"Job Title\",\"managerJobTitle\":\"Manager\",\"positionType\":\"INDIVIDUAL_CONTRIBUTOR\",\"reason\":\"GENERAL_INTEREST\",\"initialResultCount\":100,\"department\":{\"connect\":\"$departmentId\"}}; Field \"applicantFilter\" of required type \"ApplicantFilterBelongsTo!\" was not provided.";

        $this->runCreateMutation([
            'department' => [
                'connect' => $departmentId,
            ],
        ])->assertGraphQLErrorMessage($errorMessage);
    }

    /**
     * Test create mutation passes when
     * applicant filter is present
     *
     * @return void
     */
    public function testMutationCreatePassesWithApplicantFilter()
    {
        $this->seed(RolePermissionSeeder::class);
        $this->seed(DepartmentSeeder::class);
        $this->seed(CommunitySeeder::class);

        $this->runCreateMutation([
            'department' => [
                'connect' => Department::inRandomOrder()->first()->id,
            ],
            'community' => [
                'connect' => Community::inRandomOrder()->first()->id,
            ],
            'applicantFilter' => [
                'create' => [
                    'hasDiploma' => true,
                    'community' => [
                        'connect' => Community::inRandomOrder()->first()->id,
                    ],
                ],
            ],
        ])->assertJson(function (AssertableJson $json) {
            $json->has('data.createPoolCandidateSearchRequest.id');
        });
    }

    /**
     * Test PoolCandidateSearchRequestPolicy
     *
     * @return void
     */
    public function testPoolCandidateSearchRequestPolicy()
    {
        $this->seed(RolePermissionSeeder::class);
        $this->seed(DepartmentSeeder::class);

        $baseUser = User::create([
            'email' => 'base-user@test.com',
            'sub' => 'base-user@test.com',
        ]);
        $baseUser->syncRoles([
            'guest',
            'base_user',
        ]);

        $community = Community::factory()->create();
        $otherCommunity = Community::factory()->create();
        $searchRequest1 = PoolCandidateSearchRequest::factory()->create(['community_id' => $community->id, 'user_id' => null]);
        $searchRequest2 = PoolCandidateSearchRequest::factory()->create(['community_id' => $otherCommunity->id, 'user_id' => null]);

        $communityRecruiter = User::factory()
            ->asCommunityRecruiter([$community->id])
            ->create();

        $querySearchRequest =
            /** @lang GraphQL */
            '
            query poolCandidateSearchRequest($id: ID!) {
                poolCandidateSearchRequest(id: $id) {
                    id
                }
            }
        ';
        $mutationUpdateSearchRequest =
            /** @lang GraphQL */
            '
            mutation updatePoolCandidateSearchRequest($id: ID!, $poolCandidateSearchRequest: UpdatePoolCandidateSearchRequestInput!) {
                updatePoolCandidateSearchRequest(id: $id, poolCandidateSearchRequest: $poolCandidateSearchRequest) {
                    adminNotes
                }
            }
        ';

        $whereSearchRequest1 = ['id' => $searchRequest1->id];
        $whereUpdateSearchRequest1 = [
            'id' => $searchRequest1->id,
            'poolCandidateSearchRequest' => [
                'adminNotes' => 'hardcoded message here',
            ],
        ];
        $whereUpdateSearchRequest2 = [
            'id' => $searchRequest2->id,
            'poolCandidateSearchRequest' => [
                'adminNotes' => 'hardcoded message here',
            ],
        ];

        // test viewing a specific search request
        $this->actingAs($baseUser, 'api')
            ->graphQL($querySearchRequest, $whereSearchRequest1)
            ->assertJsonFragment(['message' => 'This action is unauthorized.']);

        // test viewing collection of search requests
        $this->actingAs($baseUser, 'api')
            ->graphQL('query { poolCandidateSearchRequestsPaginated(first: 500) { paginatorInfo { count } } }')
            ->assertJsonFragment(['count' => 0]);

        // test updating a search request
        $this->actingAs($baseUser, 'api')
            ->graphQL($mutationUpdateSearchRequest, $whereUpdateSearchRequest1)
            ->assertJsonFragment(['message' => 'This action is unauthorized.']);

        // community recruiter can only update searchRequest 1
        $this->actingAs($communityRecruiter, 'api')
            ->graphQL($mutationUpdateSearchRequest, $whereUpdateSearchRequest1)
            ->assertJsonFragment(['adminNotes' => 'hardcoded message here']);
        $this->actingAs($communityRecruiter, 'api')
            ->graphQL($mutationUpdateSearchRequest, $whereUpdateSearchRequest2)
            ->assertJsonFragment(['message' => 'This action is unauthorized.']);
    }

    /**
     * Test that the user_id is null when a guest user creates a PoolCandidateSearchRequest
     *
     * @return void
     */
    public function testUserIdForGuestUsers()
    {
        $this->seed(DepartmentSeeder::class);
        $this->seed(CommunitySeeder::class);

        // Assert user_id is null when guest user creates a pool candidate search request
        $this->runCreateMutation([
            'department' => [
                'connect' => Department::inRandomOrder()->first()->id,
            ],
            'community' => [
                'connect' => Community::inRandomOrder()->first()->id,
            ],
            'applicantFilter' => [
                'create' => [
                    'hasDiploma' => true,
                    'community' => [
                        'connect' => Community::inRandomOrder()->first()->id,
                    ],
                ],
            ],
        ])->assertSuccessful();

        $searchRequest = PoolCandidateSearchRequest::first();
        $this->assertNull($searchRequest->user_id);
    }

    /**
     * Test that the user_id is set and correct when a logged in user creates a PooLCandidateSearchRequest
     *
     * @return void
     */
    public function testUserIdForLoggedInUsers()
    {
        $this->seed(DepartmentSeeder::class);
        $this->seed(CommunitySeeder::class);

        // Assert user_id is not null after creating with logged in user,
        // and it has the correct id.
        $this->actingAs($this->adminUser, 'api')->graphQL(
            /** @lang GraphQL */
            '
            mutation createPoolCandidateSearchRequest($input: CreatePoolCandidateSearchRequestInput!) {
                createPoolCandidateSearchRequest(poolCandidateSearchRequest: $input) {
                    id
                }
            }
            ',
            [
                'input' => $this->getInput([
                    'department' => [
                        'connect' => Department::inRandomOrder()->first()->id,
                    ],
                    'community' => [
                        'connect' => Community::inRandomOrder()->first()->id,
                    ],
                    'applicantFilter' => [
                        'create' => [
                            'hasDiploma' => true,
                            'community' => [
                                'connect' => Community::inRandomOrder()->first()->id,
                            ],
                        ],
                    ],
                ]),
            ]
        )->assertSuccessful();

        $this->assertTrue(PoolCandidateSearchRequest::where('user_id', $this->adminUser->id)->exists());
    }

    public function testUserCanSeeTheirOwnRequests()
    {
        $this->seed(DepartmentSeeder::class);
        $this->seed(CommunitySeeder::class);

        $user1 = User::factory()->create();
        $request1 = PoolCandidateSearchRequest::factory()->create(['user_id' => $user1->id]);
        $user2 = User::factory()->create();
        $request2 = PoolCandidateSearchRequest::factory()->create(['user_id' => $user2->id]);
        $request3 = PoolCandidateSearchRequest::factory()->create(['user_id' => null]);

        $this->actingAs($user1, 'api')->graphQL(<<<'GRAPHQL'
            query MyRequests {
                me {
                    poolCandidateSearchRequests {
                        id
                    }
                }
            }
            GRAPHQL
        )->assertExactJson([
            'data' => [
                'me' => [
                    'poolCandidateSearchRequests' => [
                        // Can only see request 1.  Request 2 belongs to another user and 3 is for no user.
                        ['id' => $request1->id],
                    ],
                ],
            ],
        ]);
    }

    public function testUserCanSeeTheirOwnRequest()
    {
        $this->seed(DepartmentSeeder::class);
        $this->seed(CommunitySeeder::class);

        $user1 = User::factory()->create();
        $request1 = PoolCandidateSearchRequest::factory()->create(['user_id' => $user1->id]);

        $this->actingAs($user1, 'api')->graphQL(<<<'GRAPHQL'
            query MyRequest($requestId: ID!) {
                    poolCandidateSearchRequest(id: $requestId) {
                        id
                }
            }
            GRAPHQL,
            ['requestId' => $request1->id]
        )->assertExactJson([
            'data' => [
                'poolCandidateSearchRequest' => [
                    'id' => $request1->id,
                ],
            ],
        ]);
    }

    public function testUserCanNotSeeOtherRequest()
    {
        $this->seed(DepartmentSeeder::class);
        $this->seed(CommunitySeeder::class);

        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        $request2 = PoolCandidateSearchRequest::factory()->create(['user_id' => $user2->id]);

        $this->actingAs($user1, 'api')->graphQL(<<<'GRAPHQL'
            query MyRequest($requestId: ID!) {
                    poolCandidateSearchRequest(id: $requestId) {
                        id
                }
            }
            GRAPHQL,
            ['requestId' => $request2->id]
        )->assertGraphQLErrorMessage('This action is unauthorized.');
    }
}
