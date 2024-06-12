<?php

namespace Tests\Feature;

use App\Models\Department;
use App\Models\DepartmentSpecificRecruitmentProcessForm;
use App\Models\Skill;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Arr;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Tests\TestCase;
use Tests\UsesProtectedGraphqlEndpoint;

use function PHPUnit\Framework\assertEquals;

class DepartmentSpecificRecruitmentProcessFormTest extends TestCase
{
    use MakesGraphQLRequests;
    use RefreshDatabase;
    use RefreshesSchemaCache;
    use UsesProtectedGraphqlEndpoint;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);

        $this->bootRefreshesSchemaCache();

        $this->user = User::factory()
            ->asApplicant()
            ->asAdmin()
            ->create([
                'sub' => 'platform-admin@test.com',
            ]);
    }

    // make sure the factory works
    public function testFactoryWorks(): void
    {
        Department::factory()->count(10)->create();
        Skill::factory()->count(10)->create();

        $questionnaires = DepartmentSpecificRecruitmentProcessForm::factory()->count(10)->create();

        assertEquals(10, $questionnaires->count());
    }

    // create a new form and make sure it comes back the same way
    public function testCanCreate(): void
    {
        $department = Department::factory()->create();

        $formTableFields = [
            'departmentOther' => null,
            'recruitmentProcessLeadName' => 'recruitment_process_lead_name',
            'recruitmentProcessLeadJobTitle' => 'recruitment_process_lead_job_title',
            'recruitmentProcessLeadEmail' => 'recruitment@example.org',
            'postingDate' => '2025-01-01',
            'advertisementType' => 'INTERNAL',
            'advertisingPlatforms' => [
                'LINKEDIN',
                'OTHER',
            ],
            'advertisingPlatformsOther' => 'advertising_platforms_other',
            'jobAdvertisementLink' => 'job_advertisement_link',
        ];

        $positionFields = [
            'classificationGroup' => 'classification_group',
            'classificationLevel' => 'classification_level',
            'jobTitle' => 'job_title',
            'employmentTypes' => [
                'ASSIGNMENT',
                'OTHER',
            ],
            'employmentTypesOther' => 'employment_types_other',
        ];

        // build the expected object with relationship fields
        $expectedObject = $formTableFields;
        Arr::set($expectedObject, 'department.id', $department->id);
        Arr::set($expectedObject, 'positions.0', $positionFields);

        // graphql inputs have to be tweaked a bit for relationships (connect, create)
        $graphqlInput = $formTableFields;
        Arr::set($graphqlInput, 'department.connect', $department->id);
        Arr::set($graphqlInput, 'positions.create.0', $positionFields);

        // create it in the database and check what comes back
        $this->actingAs($this->user, 'api')
            ->graphQL(
                /** @lang GraphQL */
                '
                mutation createDepartmentSpecificRecruitmentProcessForm($form: DepartmentSpecificRecruitmentProcessFormInput!) {
                    createDepartmentSpecificRecruitmentProcessForm(
                      departmentSpecificRecruitmentProcessForm: $form
                    ) {
                        id
                        department {
                            id
                          }
                          departmentOther
                          recruitmentProcessLeadName
                          recruitmentProcessLeadJobTitle
                          recruitmentProcessLeadEmail
                          postingDate
                          positions {
                            id
                            classificationGroup
                            classificationLevel
                            jobTitle
                            employmentTypes
                            employmentTypesOther
                          }
                        advertisementType
                        advertisingPlatforms
                        advertisingPlatformsOther
                        jobAdvertisementLink
                }
            }
        ',
                ['form' => $graphqlInput]
            )
            ->assertJson([
                'data' => [
                    'createDepartmentSpecificRecruitmentProcessForm' => $expectedObject,
                ],
            ]);
    }
}
