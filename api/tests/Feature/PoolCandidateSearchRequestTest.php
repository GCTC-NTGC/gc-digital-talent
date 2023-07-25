<?php

namespace Tests\Feature;

use App\Models\Department;
use App\Models\PoolCandidateSearchRequest;
use App\Models\User;
use Database\Helpers\ApiEnums;
use Database\Seeders\DepartmentSeeder;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Tests\TestCase;
use Illuminate\Testing\Fluent\AssertableJson;

class PoolCandidateSearchRequestTest extends TestCase
{
    use RefreshDatabase;
    use MakesGraphQLRequests;
    use RefreshesSchemaCache;

    /**
     * Default required fields
     */
    private $defaultInput = [
        'fullName' => 'Test',
        'email' => 'test@domain.com',
        'jobTitle' => 'Job Title',
        'managerJobTitle' => 'Manager',
        'positionType' => ApiEnums::POOL_CANDIDATE_SEARCH_POSITION_INDIVIDUAL_CONTRIBUTOR,
    ];

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
        return array_merge($this->defaultInput, $additionalInput);
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
                'input' => $this->getInput($input)
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

        $this->runCreateMutation([
            'department' => [
                'connect' => Department::inRandomOrder()->first()->id
            ],
        ])->assertSeeText(
            'Field value.applicantFilter of required type ApplicantFilterBelongsTo! was not provided.'
        );
    }

    /**
     * Test create mutation passes when
     * applicant filter is present
     *
     * @return void
     */
    public function testMutationCreatePassesWithApplicantFilter()
    {
        $this->seed(DepartmentSeeder::class);

        $this->runCreateMutation([
            'department' => [
                'connect' => Department::inRandomOrder()->first()->id
            ],
            'applicantFilter' => [
                'create' => [
                    'hasDiploma' => true
                ]
            ]
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
            "guest",
            "base_user",
        ]);
        $requestResponder = User::create([
            'email' => 'responder-user@test.com',
            'sub' => 'responder-user@test.com',
        ]);
        $requestResponder->syncRoles([
            "guest",
            "base_user",
            "request_responder",
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
            ]
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
            ->graphQL('query { poolCandidateSearchRequests { id } }')
            ->assertJsonFragment(['message' => 'This action is unauthorized.']);
        $this->actingAs($requestResponder, 'api')
            ->graphQL('query { poolCandidateSearchRequests { id } }')
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
