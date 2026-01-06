<?php

namespace Tests\Feature;

use App\Enums\CafRank;
use App\Enums\EmploymentCategory;
use App\Enums\ExternalRoleSeniority;
use App\Enums\ExternalSizeOfOrganization;
use App\Enums\GovEmployeeType;
use App\Enums\GovPositionType;
use App\Models\Classification;
use App\Models\Department;
use App\Models\User;
use App\Models\WorkExperience;
use Database\Seeders\ClassificationSeeder;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\Concerns\InteractsWithExceptionHandling;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Tests\TestCase;
use Tests\UsesProtectedGraphqlEndpoint;

class WorkExperienceTest extends TestCase
{
    use InteractsWithExceptionHandling;
    use MakesGraphQLRequests;
    use RefreshDatabase;
    use RefreshesSchemaCache;
    use UsesProtectedGraphqlEndpoint;

    protected $admin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutExceptionHandling();
        $this->seed(ClassificationSeeder::class);
        $this->seed(RolePermissionSeeder::class);

        $this->admin = User::factory()
            ->asApplicant()
            ->asAdmin()
            ->create([
                'email' => 'admin@test.com',
                'sub' => 'admin@test.com',
            ]);
    }

    // test that a work experience is successfully created
    public function testCreatingExperienceSuccessful(): void
    {
        $this->actingAs($this->admin, 'api')->graphQL(
            /** @lang GraphQL */
            '
        mutation createWorkExperience($userId: ID!, $workExperience: WorkExperienceInput!) {
            createWorkExperience(userId: $userId, workExperience: $workExperience) {
                user {
                    id
                }
                employmentCategory {
                    value
                }
                extSizeOfOrganization {
                    value
                }
                extRoleSeniority {
                    value
                }
            }
        }
        ',
            [
                'userId' => $this->admin->id,
                'workExperience' => [
                    'employmentCategory' => EmploymentCategory::EXTERNAL_ORGANIZATION->name,
                    'extSizeOfOrganization' => ExternalSizeOfOrganization::ONE_HUNDRED_ONE_TO_ONE_THOUSAND->name,
                    'extRoleSeniority' => ExternalRoleSeniority::INTERMEDIATE->name,
                ],
            ]
        )->assertJsonFragment(
            [
                'user' => [
                    'id' => $this->admin->id,
                ],
                'employmentCategory' => [
                    'value' => EmploymentCategory::EXTERNAL_ORGANIZATION->name,
                ],
                'extSizeOfOrganization' => [
                    'value' => ExternalSizeOfOrganization::ONE_HUNDRED_ONE_TO_ONE_THOUSAND->name,
                ],
                'extRoleSeniority' => [
                    'value' => ExternalRoleSeniority::INTERMEDIATE->name,
                ],
            ],
        );
    }

    // test that validation rejects creating experiences with fields mismatching employment category
    public function testCreatingExperienceFailsValidatingProhibited(): void
    {
        // fails due to external organization and CAF rank
        $this->actingAs($this->admin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            mutation createWorkExperience($userId: ID!, $workExperience: WorkExperienceInput!) {
                createWorkExperience(userId: $userId, workExperience: $workExperience) {
                    user {
                        id
                    }
                }
            }
            ',
            [
                'userId' => $this->admin->id,
                'workExperience' => [
                    'employmentCategory' => EmploymentCategory::EXTERNAL_ORGANIZATION->name,
                    'cafRank' => CafRank::GENERAL_FLAG_OFFICER->name,
                ],
            ]
        )->assertGraphQLValidationError('workExperience.cafRank', 'The work experience.caf rank field is prohibited.');
    }

    // test that validation rejects creating experiences with missing required fields
    public function testCreatingExperienceFailsValidatingRequired(): void
    {
        // fails due to external organization and missing extRoleSeniority
        $this->actingAs($this->admin, 'api')->graphQL(
            /** @lang GraphQL */
            '
                mutation createWorkExperience($userId: ID!, $workExperience: WorkExperienceInput!) {
                    createWorkExperience(userId: $userId, workExperience: $workExperience) {
                        user {
                            id
                        }
                    }
                }
                ',
            [
                'userId' => $this->admin->id,
                'workExperience' => [
                    'employmentCategory' => EmploymentCategory::EXTERNAL_ORGANIZATION->name,
                    'extSizeOfOrganization' => ExternalSizeOfOrganization::ONE_HUNDRED_ONE_TO_ONE_THOUSAND->name,
                ],
            ]
        )->assertGraphQLValidationError('workExperience.extRoleSeniority', 'The work experience.ext role seniority field is required.');
    }

    // test that validation rejects creating experiences with govPositionType when gov employee type is term
    public function testCreatingExperienceFailsValidatingGovPositionType(): void
    {
        $this->actingAs($this->admin, 'api')->graphQL(
            /** @lang GraphQL */
            '
                mutation createWorkExperience($userId: ID!, $workExperience: WorkExperienceInput!) {
                    createWorkExperience(userId: $userId, workExperience: $workExperience) {
                        user {
                            id
                        }
                    }
                }
                ',
            [
                'userId' => $this->admin->id,
                'workExperience' => [
                    'employmentCategory' => EmploymentCategory::GOVERNMENT_OF_CANADA->name,
                    'govEmploymentType' => GovEmployeeType::TERM->name,
                    'govPositionType' => GovPositionType::SUBSTANTIVE->name,
                ],
            ]
        )->assertGraphQLValidationError('workExperience.govPositionType', 'The work experience.gov position type field is prohibited.');
    }

    // test that a created work experience of government type queries without issue
    public function testQueryingCreatedExperienceGovernment(): void
    {
        WorkExperience::truncate();
        $classification = Classification::factory()->create();
        $department = Department::factory()->create();

        $this->actingAs($this->admin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            mutation createWorkExperience($userId: ID!, $workExperience: WorkExperienceInput!) {
                createWorkExperience(userId: $userId, workExperience: $workExperience) {
                    user {
                        id
                    }
                }
            }
            ',
            [
                'userId' => $this->admin->id,
                'workExperience' => [
                    'employmentCategory' => EmploymentCategory::GOVERNMENT_OF_CANADA->name,
                    'govEmploymentType' => GovEmployeeType::INDETERMINATE->name,
                    'govPositionType' => GovPositionType::ACTING->name,
                    'classificationId' => $classification->id,
                    'department' => ['connect' => $department->id],
                ],
            ]
        )->assertJsonFragment(
            [
                'user' => [
                    'id' => $this->admin->id,
                ],
            ],
        );

        // now query user experiences
        $this->actingAs($this->admin, 'api')->graphQL(
            /** @lang GraphQL */
            '
                query user($id: UUID!) {
                    user(id: $id) {
                        experiences {
                            ... on WorkExperience {
                                employmentCategory {
                                    value
                                }
                                classification {
                                    group
                                }
                                department {
                                    departmentNumber
                                }
                            }
                        }
                    }
                }
                ',
            [
                'id' => $this->admin->id,
            ]
        )->assertJsonFragment(
            [
                'employmentCategory' => [
                    'value' => EmploymentCategory::GOVERNMENT_OF_CANADA->name,
                ],
            ],
        )
            ->assertJsonFragment(
                [
                    'classification' => [
                        'group' => $classification->group,
                    ],
                ],
            )->assertJsonFragment(
                [
                    'department' => [
                        'departmentNumber' => $department->department_number,
                    ],
                ],
            );
    }

    // test that updating an experience is successful
    public function testUpdatingExperienceSuccessful(): void
    {
        $response = $this->actingAs($this->admin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            mutation createWorkExperience($userId: ID!, $workExperience: WorkExperienceInput!) {
                createWorkExperience(userId: $userId, workExperience: $workExperience) {
                    id
                    user {
                        id
                    }
                }
            }
            ',
            [
                'userId' => $this->admin->id,
                'workExperience' => [
                    'employmentCategory' => EmploymentCategory::EXTERNAL_ORGANIZATION->name,
                    'extSizeOfOrganization' => ExternalSizeOfOrganization::ONE_HUNDRED_ONE_TO_ONE_THOUSAND->name,
                    'extRoleSeniority' => ExternalRoleSeniority::EXECUTIVE->name,
                ],
            ]
        );

        $response->assertJsonFragment(['id' => $this->admin->id]);
        $createdExperienceId = $response->json('data.createWorkExperience.id');

        // seniority changed from executive -> senior
        $response = $this->actingAs($this->admin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            mutation updateWorkExperience($id: ID!, $workExperience: WorkExperienceInput!) {
                updateWorkExperience(id: $id, workExperience: $workExperience) {
                    id
                    extRoleSeniority {
                        value
                    }
                }
            }
            ',
            [
                'id' => $createdExperienceId,
                'workExperience' => [
                    'employmentCategory' => EmploymentCategory::EXTERNAL_ORGANIZATION->name,
                    'extSizeOfOrganization' => ExternalSizeOfOrganization::ONE_HUNDRED_ONE_TO_ONE_THOUSAND->name,
                    'extRoleSeniority' => ExternalRoleSeniority::SENIOR->name,
                ],
            ]
        )->assertJsonFragment(['id' => $createdExperienceId])
            ->assertJsonFragment(['value' => ExternalRoleSeniority::SENIOR->name]);
    }

    // test that updating validation rejects invalid case
    public function testUpdatingExperienceFailsValidation(): void
    {
        $response = $this->actingAs($this->admin, 'api')->graphQL(
            /** @lang GraphQL */
            '
                mutation createWorkExperience($userId: ID!, $workExperience: WorkExperienceInput!) {
                    createWorkExperience(userId: $userId, workExperience: $workExperience) {
                        id
                        user {
                            id
                        }
                    }
                }
                ',
            [
                'userId' => $this->admin->id,
                'workExperience' => [
                    'employmentCategory' => EmploymentCategory::EXTERNAL_ORGANIZATION->name,
                    'extSizeOfOrganization' => ExternalSizeOfOrganization::ONE_HUNDRED_ONE_TO_ONE_THOUSAND->name,
                    'extRoleSeniority' => ExternalRoleSeniority::EXECUTIVE->name,
                ],
            ]
        );

        $response->assertJsonFragment(['id' => $this->admin->id]);
        $createdExperienceId = $response->json('data.createWorkExperience.id');

        // rejects adding CAF rank to external organization
        $response = $this->actingAs($this->admin, 'api')->graphQL(
            /** @lang GraphQL */
            '
                mutation updateWorkExperience($id: ID!, $workExperience: WorkExperienceInput!) {
                    updateWorkExperience(id: $id, workExperience: $workExperience) {
                        id
                        extRoleSeniority {
                            value
                        }
                    }
                }
                ',
            [
                'id' => $createdExperienceId,
                'workExperience' => [
                    'cafRank' => CafRank::JUNIOR_OFFICER->name,
                ],
            ]
        )->assertGraphQLValidationError('workExperience.cafRank', 'The work experience.caf rank field is prohibited.');
    }
}
