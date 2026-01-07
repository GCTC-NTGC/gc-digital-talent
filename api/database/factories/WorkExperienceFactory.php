<?php

namespace Database\Factories;

use App\Enums\CafEmploymentType;
use App\Enums\CafForce;
use App\Enums\CafRank;
use App\Enums\CSuiteRoleTitle;
use App\Enums\EmploymentCategory;
use App\Enums\ExternalRoleSeniority;
use App\Enums\ExternalSizeOfOrganization;
use App\Enums\GovContractorRoleSeniority;
use App\Enums\GovContractorType;
use App\Enums\GovEmployeeType;
use App\Enums\GovPositionType;
use App\Models\Classification;
use App\Models\Department;
use App\Models\User;
use App\Models\WorkExperience;
use App\Models\WorkStream;
use App\Traits\ExperienceFactoryWithSkills;
use Illuminate\Database\Eloquent\Factories\Factory;

class WorkExperienceFactory extends Factory
{
    use ExperienceFactoryWithSkills;

    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = WorkExperience::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'user_id' => User::factory(),
            'role' => $this->faker->jobTitle(),
            'organization' => function (array $attributes) {
                return $attributes['employment_category'] === EmploymentCategory::CANADIAN_ARMED_FORCES->name ?
                    null : $this->faker->company();
            },
            'division' => function (array $attributes) {
                return $attributes['employment_category'] === EmploymentCategory::CANADIAN_ARMED_FORCES->name ?
                    null : $this->faker->bs();
            },
            'start_date' => $this->faker->dateTimeBetween('2010-01-01', '2019-12-31')->format('Y-m-d'),
            'end_date' => fn ($attributes) => $this->faker->optional()->dateTimeBetween($attributes['start_date'], '2019-12-31')?->format('Y-m-d'),
            'details' => $this->faker->text(),
            'employment_category' => $this->faker->randomElement(EmploymentCategory::cases())->name,
            'ext_size_of_organization' => function (array $attributes) {
                return $attributes['employment_category'] === EmploymentCategory::EXTERNAL_ORGANIZATION->name ?
                    $this->faker->randomElement(ExternalSizeOfOrganization::cases())->name : null;
            },
            'ext_role_seniority' => function (array $attributes) {
                return $attributes['employment_category'] === EmploymentCategory::EXTERNAL_ORGANIZATION->name ?
                    $this->faker->randomElement(ExternalRoleSeniority::cases())->name : null;
            },
            'gov_employment_type' => function (array $attributes) {
                return $attributes['employment_category'] === EmploymentCategory::GOVERNMENT_OF_CANADA->name ?
                    $this->faker->randomElement(GovEmployeeType::cases())->name : null;
            },
            'gov_position_type' => function (array $attributes) {
                return $attributes['gov_employment_type'] === GovEmployeeType::INDETERMINATE->name ?
                    $this->faker->randomElement(GovPositionType::cases())->name : null;
            },
            'gov_contractor_role_seniority' => function (array $attributes) {
                return $attributes['gov_employment_type'] === GovEmployeeType::CONTRACTOR->name ?
                    $this->faker->randomElement(GovContractorRoleSeniority::cases())->name : null;
            },
            'gov_contractor_type' => function (array $attributes) {
                return $attributes['gov_employment_type'] === GovEmployeeType::CONTRACTOR->name ?
                    $this->faker->randomElement(GovContractorType::cases())->name : null;
            },
            'contractor_firm_agency_name' => function (array $attributes) {
                return $attributes['gov_contractor_type'] === GovContractorType::FIRM_OR_AGENCY->name ?
                    $this->faker->company : null;
            },
            'caf_employment_type' => function (array $attributes) {
                return $attributes['employment_category'] === EmploymentCategory::CANADIAN_ARMED_FORCES->name ?
                    $this->faker->randomElement(CafEmploymentType::cases())->name : null;
            },
            'caf_force' => function (array $attributes) {
                return $attributes['employment_category'] === EmploymentCategory::CANADIAN_ARMED_FORCES->name ?
                    $this->faker->randomElement(CafForce::cases())->name : null;
            },
            'caf_rank' => function (array $attributes) {
                return $attributes['employment_category'] === EmploymentCategory::CANADIAN_ARMED_FORCES->name ?
                    $this->faker->randomElement(CafRank::cases())->name : null;
            },
            'classification_id' => function (array $attributes) {
                if (
                    $attributes['employment_category'] === EmploymentCategory::GOVERNMENT_OF_CANADA->name &&
                    $attributes['gov_employment_type'] !== GovEmployeeType::STUDENT->name &&
                    $attributes['gov_employment_type'] !== GovEmployeeType::CONTRACTOR->name
                ) {
                    $classification = Classification::inRandomOrder()->first();
                    if (! $classification) {
                        $classification = Classification::factory()->create();
                    }
                    $classificationId = $classification->id;

                    return $classificationId;
                }

                return null;
            },
            'department_id' => function (array $attributes) {
                if ($attributes['employment_category'] === EmploymentCategory::GOVERNMENT_OF_CANADA->name) {
                    $department = Department::inRandomOrder()->first();
                    if (! $department) {
                        $department = Department::factory()->create();
                    }
                    $departmentId = $department->id;

                    return $departmentId;
                }

                return null;
            },
            'supervisory_position' => $this->faker->boolean(),
            'supervised_employees' => function (array $attributes) {
                return $attributes['supervisory_position'] === true ?
                $this->faker->boolean() : null;
            },
            'supervised_employees_number' => function (array $attributes) {
                return $attributes['supervised_employees'] === true ?
                $this->faker->numberBetween(1, 100) : null;
            },
            'budget_management' => function (array $attributes) {
                return $attributes['supervisory_position'] === true ?
                $this->faker->boolean() : null;
            },
            'annual_budget_allocation' => function (array $attributes) {
                return $attributes['budget_management'] === true ?
                $this->faker->numberBetween(1, 1000000) : null;
            },
            'senior_management_status' => function (array $attributes) {
                return $attributes['supervisory_position'] === true ?
                $this->faker->boolean() : null;
            },
            'c_suite_role_title' => function (array $attributes) {
                return $attributes['senior_management_status'] === true ?
                    $this->faker->randomElement(CSuiteRoleTitle::cases())->name : null;
            },
            'other_c_suite_role_title' => function (array $attributes) {
                return $attributes['c_suite_role_title'] === CSuiteRoleTitle::OTHER->name ?
                $this->faker->jobTitle() : null;
            },
        ];
    }

    /**
     * Configure the model factory.
     */
    public function configure(): static
    {
        // might want to eventually make this configurable in a state
        return $this->afterCreating(function (WorkExperience $experience) {
            if ($this->faker->boolean()) {
                $count = $this->faker->numberBetween(1, 3);
                $workStreamIds = WorkStream::inRandomOrder()->limit($count)->pluck('id');

                $experience->workStreams()->attach($workStreamIds);
            }
        });
    }

    /**
     *  Make this a "substantive" experience
     */
    public function asSubstantive()
    {
        return $this->state(function () {
            return [
                'employment_category' => EmploymentCategory::GOVERNMENT_OF_CANADA->name,
                'end_date' => null,
                'gov_employment_type' => GovEmployeeType::INDETERMINATE->name,
                'gov_position_type' => GovPositionType::SUBSTANTIVE->name,
            ];
        });
    }
}
