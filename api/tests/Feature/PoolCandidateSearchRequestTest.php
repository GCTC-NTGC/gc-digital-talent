<?php

namespace Tests\Feature;

use App\Models\Department;
use Database\Seeders\DepartmentSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Nuwave\Lighthouse\Testing\ClearsSchemaCache;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Tests\TestCase;
use Illuminate\Testing\Fluent\AssertableJson;

class PoolCandidateSearchRequestTest extends TestCase {
    use RefreshDatabase;
    use MakesGraphQLRequests;
    use ClearsSchemaCache;

    /**
     * Default required fields
     */
    private $defaultInput = [
        'fullName' => 'Test',
        'email' => 'test@domain.com',
        'jobTitle' => 'Job Title',
    ];

    protected function setUp(): void
    {
        parent::setUp();

        $this->bootClearsSchemaCache();
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
     * Test create mutation fail when neither filter present
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
        ])->assertGraphQLValidationKeys([
            'poolCandidateSearchRequest.poolCandidateFilter',
            'poolCandidateSearchRequest.applicantFilter'
        ]);

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
     * Test create mutation passes when
     * pool candidate filter is present
     *
     * @return void
     */
    public function testMutationCreatePassesWithPoolCandidateFilter()
    {
        $this->seed(DepartmentSeeder::class);

        $this->runCreateMutation([
            'department' => [
                'connect' => Department::inRandomOrder()->first()->id
            ],
            'poolCandidateFilter' => [
                'create' => [
                    'hasDiploma' => false
                ]
            ]
        ])->assertJson(function (AssertableJson $json) {
            $json->has('data.createPoolCandidateSearchRequest.id');
        });
    }
}
