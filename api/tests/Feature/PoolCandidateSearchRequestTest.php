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

    protected function setUp(): void
    {
        parent::setUp();

        $this->bootRefreshesSchemaCache();
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
        $errorMessage = "Variable \"\$input\" got invalid value {\"fullName\":\"Test\",\"email\":\"test@domain.com\",\"jobTitle\":\"Job Title\",\"managerJobTitle\":\"Manager\",\"positionType\":\"INDIVIDUAL_CONTRIBUTOR\",\"reason\":\"GENERAL_INTEREST\",\"department\":{\"connect\":\"$departmentId\"}}; Field \"applicantFilter\" of required type \"ApplicantFilterBelongsTo!\" was not provided.";

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
        $requestResponder = User::create([
            'email' => 'responder-user@test.com',
            'sub' => 'responder-user@test.com',
        ]);
        $requestResponder->syncRoles([
            'guest',
            'base_user',
            'request_responder',
        ]);

        $searchRequest1 = PoolCandidateSearchRequest::factory()->create();

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
        $mutationDeleteSearchRequest =
            /** @lang GraphQL */
            '
            mutation deletePoolCandidateSearchRequest($id: ID!) {
                deletePoolCandidateSearchRequest(id: $id) {
                    id
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

        // test viewing a specific search request
        $this->actingAs($baseUser, 'api')
            ->graphQL($querySearchRequest, $whereSearchRequest1)
            ->assertJsonFragment(['message' => 'This action is unauthorized.']);
        $this->actingAs($requestResponder, 'api')
            ->graphQL($querySearchRequest, $whereSearchRequest1)
            ->assertJsonFragment(['id' => $searchRequest1->id]);

        // test viewing collection of search requests
        $this->actingAs($baseUser, 'api')
            ->graphQL('query { poolCandidateSearchRequestsPaginated(first: 500) { paginatorInfo { count } } }')
            ->assertJsonFragment(['count' => 0]);
        $this->actingAs($requestResponder, 'api')
            ->graphQL('query { poolCandidateSearchRequestsPaginated(first: 500) { data { id } } }')
            ->assertJsonFragment(['id' => $searchRequest1->id]);

        // test updating a search request
        $this->actingAs($baseUser, 'api')
            ->graphQL($mutationUpdateSearchRequest, $whereUpdateSearchRequest1)
            ->assertJsonFragment(['message' => 'This action is unauthorized.']);
        $this->actingAs($requestResponder, 'api')
            ->graphQL($mutationUpdateSearchRequest, $whereUpdateSearchRequest1)
            ->assertJsonFragment(['adminNotes' => 'hardcoded message here']);

        // test deleting a search request
        $this->actingAs($baseUser, 'api')
            ->graphQL($mutationDeleteSearchRequest, $whereSearchRequest1)
            ->assertJsonFragment(['message' => 'This action is unauthorized.']);
        $this->actingAs($requestResponder, 'api')
            ->graphQL($mutationDeleteSearchRequest, $whereSearchRequest1)
            ->assertJsonFragment(['id' => $searchRequest1->id]);
    }
}
