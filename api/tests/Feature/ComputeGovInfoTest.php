<?php

namespace Tests\Feature;

use App\Enums\EmploymentCategory;
use App\Enums\GovEmployeeType;
use App\Enums\GovPositionType;
use App\Models\PersonalExperience;
use App\Models\User;
use App\Models\WorkExperience;
use Database\Seeders\ClassificationSeeder;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;
use Tests\UsesProtectedGraphqlEndpoint;

class ComputeGovInfoTest extends TestCase
{
    use MakesGraphQLRequests;
    use RefreshDatabase;
    use RefreshesSchemaCache;
    use UsesProtectedGraphqlEndpoint;
    use WithFaker;

    protected $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->setUpFaker();
        $this->seed([
            ClassificationSeeder::class,
            RolePermissionSeeder::class,
        ]);

        $this->user = User::factory()
            ->asApplicant()
            ->create([
                'email' => 'computed-gov-info@test.com',
                'sub' => 'computed-gov-info@test.com',
            ]);
    }

    public function testNonWorkExperience()
    {
        PersonalExperience::factory()->create(['user_id' => $this->user->id]);

        $this->assertEquals(false, $this->user->is_gov_employee);
    }

    public function testActingTermPrioritizedOverSubstantiveIndeterminate()
    {

        $sharedState = [
            'user_id' => $this->user->id,
            'start_date' => $this->faker->dateTimeBetween(now()),
            'end_date' => null,
            'employment_category' => EmploymentCategory::GOVERNMENT_OF_CANADA->name,
        ];

        $expectedExperience = WorkExperience::factory()->create([
            ...$sharedState,
            'gov_employment_type' => GovEmployeeType::TERM->name,
            'gov_position_type' => GovPositionType::ACTING->name,
        ]);

        WorkExperience::factory()->create([
            ...$sharedState,
            'gov_employment_type' => GovEmployeeType::INDETERMINATE->name,
            'gov_position_type' => GovPositionType::SUBSTANTIVE->name,
        ]);

        $expected =
            [
                'computed_is_gov_employee' => true,
                'computed_gov_employee_type' => $expectedExperience->gov_employment_type,
                'computed_classification' => $expectedExperience->classification_id,
                'computed_department' => $expectedExperience->department_id,
                'computed_gov_position_type' => $expectedExperience->gov_position_type,
                'computed_gov_end_date' => $expectedExperience->end_date,
                'computed_gov_role' => $expectedExperience->role,
            ];

        $actual = $this->user->refresh()->only([
            'computed_is_gov_employee',
            'computed_gov_employee_type',
            'computed_classification',
            'computed_department',
            'computed_gov_position_type',
            'computed_gov_end_date',
            'computed_gov_role',
        ]);

        $this->assertEqualsCanonicalizing($expected, $actual);
    }

    #[DataProvider('workExperienceProvider')]
    public function testWorkExperienceComputesProperData(array $experienceState, array $expected)
    {
        WorkExperience::factory()->create([
            'user_id' => $this->user->id,
            'end_date' => null,
            ...$experienceState,
        ]);

        $actual = $this->user->refresh()->only(array_keys($expected));

        $this->assertEqualsCanonicalizing($expected, $actual);

    }

    public static function workExperienceProvider()
    {
        $nullState = [
            'computed_is_gov_employee' => false,
            'computed_gov_employee_type' => null,
            'computed_classification' => null,
            'computed_department' => null,
            'computed_gov_position_type' => null,
            'computed_gov_end_date' => null,
            'computed_gov_role' => null,
        ];

        return [
            'external' => [
                ['employment_category' => EmploymentCategory::EXTERNAL_ORGANIZATION->name],
                $nullState,
            ],
            'armed forces' => [
                ['employment_category' => EmploymentCategory::CANADIAN_ARMED_FORCES->name],
                $nullState,
            ],
            'student government' => [
                [
                    'employment_category' => EmploymentCategory::GOVERNMENT_OF_CANADA->name,
                    'gov_employment_type' => GovEmployeeType::STUDENT->name,
                ],
                $nullState,
            ],
            'casual government' => [
                [
                    'employment_category' => EmploymentCategory::GOVERNMENT_OF_CANADA->name,
                    'gov_employment_type' => GovEmployeeType::CASUAL->name,
                ],
                $nullState,
            ],
            'conrtractor government' => [
                [
                    'employment_category' => EmploymentCategory::GOVERNMENT_OF_CANADA->name,
                    'gov_employment_type' => GovEmployeeType::CONTRACTOR->name,
                ],
                $nullState,
            ],
            'term government' => [
                [
                    'employment_category' => EmploymentCategory::GOVERNMENT_OF_CANADA->name,
                    'gov_employment_type' => GovEmployeeType::TERM->name,
                    'gov_position_type' => GovPositionType::ACTING->name,
                ],
                [
                    'computed_is_gov_employee' => true,
                    'computed_gov_employee_type' => GovEmployeeType::TERM->name,
                    'computed_gov_position_type' => GovPositionType::ACTING->name,
                ],
            ],
            'indeterminate government' => [
                [
                    'employment_category' => EmploymentCategory::GOVERNMENT_OF_CANADA->name,
                    'gov_employment_type' => GovEmployeeType::INDETERMINATE->name,
                    'gov_position_type' => GovPositionType::SUBSTANTIVE->name,
                ],
                [
                    'computed_is_gov_employee' => true,
                    'computed_gov_employee_type' => GovEmployeeType::INDETERMINATE->name,
                    'computed_gov_position_type' => GovPositionType::SUBSTANTIVE->name,
                ],
            ],
        ];
    }
}
