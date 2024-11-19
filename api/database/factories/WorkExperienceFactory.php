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
        $employmentCategory = $this->faker->randomElement(EmploymentCategory::cases())->name;
        $extSizeOfOrganization = null;
        $extRoleSeniority = null;
        $govEmploymentType = null;
        $govPositionType = null;
        $govContractStartDate = null;
        $govContractEndDate = null;
        $govContractorRoleSeniority = null;
        $govContractorType = null;
        $cafEmploymentType = null;
        $cafForce = null;
        $cafRank = null;
        $classificationId = null;
        $departmentId = null;

        // generate the appropriate values depending off the cases of EmploymentCategory
        if ($employmentCategory === EmploymentCategory::EXTERNAL_ORGANIZATION->name) {
            $extSizeOfOrganization = $this->faker->randomElement(ExternalSizeOfOrganization::cases())->name;
            $extRoleSeniority = $this->faker->randomElement(ExternalRoleSeniority::cases())->name;
        }

        if ($employmentCategory === EmploymentCategory::GOVERNMENT_OF_CANADA->name) {
            $govEmploymentType = $this->faker->randomElement(WorkExperienceGovEmployeeType::cases())->name;

            if ($govEmploymentType !== WorkExperienceGovEmployeeType::STUDENT->name && $govEmploymentType !== WorkExperienceGovEmployeeType::CONTRACTOR->name) {
                $classification = Classification::inRandomOrder()->first();
                if (! $classification) {
                    $classification = Classification::factory()->create();
                }
                $classificationId = $classification->id;
                $department = Department::inRandomOrder()->first();
                if (! $department) {
                    $department = Department::factory()->create();
                }
                $departmentId = $department->id;
            }

            if ($govEmploymentType === WorkExperienceGovEmployeeType::INDETERMINATE->name) {
                $govPositionType = $this->faker->randomElement(GovPositionType::cases())->name;
            }

            if ($govEmploymentType === WorkExperienceGovEmployeeType::CONTRACTOR->name) {
                $govContractStartDate = $this->faker->date();
                $govContractEndDate = $this->faker->boolean() ? $this->faker->dateTimeBetween($govContractStartDate) : null;
                $govContractorRoleSeniority = $this->faker->randomElement(GovContractorRoleSeniority::cases())->name;
                $govContractorType = $this->faker->randomElement(GovContractorType::cases())->name;
            }
        }

        if ($employmentCategory === EmploymentCategory::CANADIAN_ARMED_FORCES->name) {
            $cafEmploymentType = $this->faker->randomElement(CafEmploymentType::cases())->name;
            $cafForce = $this->faker->randomElement(CafForce::cases())->name;
            $cafRank = $this->faker->randomElement(CafRank::cases())->name;
        }

        return [
            'user_id' => User::factory(),
            'role' => $this->faker->jobTitle(),
            'organization' => $employmentCategory === EmploymentCategory::CANADIAN_ARMED_FORCES->name ? null : $this->faker->company(),
            'division' => $employmentCategory === EmploymentCategory::CANADIAN_ARMED_FORCES->name ? null : $this->faker->bs(),
            'start_date' => $startDate,
            'end_date' => $this->faker->boolean() ? $this->faker->dateTimeBetween($startDate) : null,
            'details' => $this->faker->text(),
            'employment_category' => $employmentCategory,
            'ext_size_of_organization' => $extSizeOfOrganization,
            'ext_role_seniority' => $extRoleSeniority,
            'gov_employment_type' => $govEmploymentType,
            'gov_position_type' => $govPositionType,
            'gov_contract_start_date' => $govContractStartDate,
            'gov_contract_end_date' => $govContractEndDate,
            'gov_contractor_role_seniority' => $govContractorRoleSeniority,
            'gov_contractor_type' => $govContractorType,
            'caf_employment_type' => $cafEmploymentType,
            'caf_force' => $cafForce,
            'caf_rank' => $cafRank,
            'classification_id' => $classificationId,
            'department_id' => $departmentId,
        ];
    }
}
