<?php

namespace Database\Factories;

use App\Enums\CafEmploymentType;
use App\Enums\CafForce;
use App\Enums\CafRank;
use App\Enums\EmploymentCategory;
use App\Enums\ExternalRoleSeniority;
use App\Enums\ExternalSizeOfOrganization;
use App\Enums\GovContractorRoleSeniority;
use App\Enums\GovContractorType;
use App\Enums\GovPositionType;
use App\Enums\WorkExperienceGovEmployeeType;
use App\Models\Classification;
use App\Models\Department;
use App\Models\User;
use App\Models\WorkExperience;
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
        $startDate = $this->faker->date();

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
            'start_date' => $startDate,
            'end_date' => $this->faker->boolean() ? $this->faker->dateTimeBetween($startDate) : null,
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
                    $this->faker->randomElement(WorkExperienceGovEmployeeType::cases())->name : null;
            },
            'gov_position_type' => function (array $attributes) {
                return $attributes['gov_employment_type'] === WorkExperienceGovEmployeeType::INDETERMINATE->name ?
                    $this->faker->randomElement(GovPositionType::cases())->name : null;
            },
            'gov_contract_start_date' => function (array $attributes) {
                return $attributes['gov_employment_type'] === WorkExperienceGovEmployeeType::CONTRACTOR->name ?
                    $this->faker->date() : null;
            },
            'gov_contract_end_date' => function (array $attributes) {
                return $attributes['gov_employment_type'] === WorkExperienceGovEmployeeType::CONTRACTOR->name && $this->faker->boolean() ?
                    $this->faker->dateTimeBetween($attributes['gov_contract_start_date']) : null;
            },
            'gov_contractor_role_seniority' => function (array $attributes) {
                return $attributes['gov_employment_type'] === WorkExperienceGovEmployeeType::CONTRACTOR->name ?
                    $this->faker->randomElement(GovContractorRoleSeniority::cases())->name : null;
            },
            'gov_contractor_type' => function (array $attributes) {
                return $attributes['gov_employment_type'] === WorkExperienceGovEmployeeType::CONTRACTOR->name ?
                    $this->faker->randomElement(GovContractorType::cases())->name : null;
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
                    $attributes['gov_employment_type'] !== WorkExperienceGovEmployeeType::STUDENT->name &&
                    $attributes['gov_employment_type'] !== WorkExperienceGovEmployeeType::CONTRACTOR->name
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
                if (
                    $attributes['employment_category'] === EmploymentCategory::GOVERNMENT_OF_CANADA->name &&
                    $attributes['gov_employment_type'] !== WorkExperienceGovEmployeeType::STUDENT->name &&
                    $attributes['gov_employment_type'] !== WorkExperienceGovEmployeeType::CONTRACTOR->name
                ) {
                    $department = Department::inRandomOrder()->first();
                    if (! $department) {
                        $department = Department::factory()->create();
                    }
                    $departmentId = $department->id;

                    return $departmentId;
                }

                return null;
            },
        ];
    }
}
