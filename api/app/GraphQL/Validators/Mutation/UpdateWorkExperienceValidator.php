<?php

namespace App\GraphQL\Validators\Mutation;

use App\Enums\EmploymentCategory;
use App\Enums\GovEmploymentType;
use App\Models\WorkExperience;
use Illuminate\Validation\Rule;
use Nuwave\Lighthouse\Validation\Validator;

final class UpdateWorkExperienceValidator extends Validator
{
    /**
     * Return the validation rules.
     *
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        $workExperienceModel = WorkExperience::findOrFail($this->arg('id'));

        // new arguments take priority, otherwise fallback to model value
        $employmentCategory = $this->arg('workExperience.employmentCategory') ?? $workExperienceModel->employment_category;
        $extSizeOfOrganization = $this->arg('workExperience.extSizeOfOrganization') ?? $workExperienceModel->ext_size_of_organization;
        $extRoleSeniority = $this->arg('workExperience.extRoleSeniority') ?? $workExperienceModel->ext_role_seniority;
        $govEmploymentType = $this->arg('workExperience.govEmploymentType') ?? $workExperienceModel->gov_employment_type;
        $govPositionType = $this->arg('workExperience.govPositionType') ?? $workExperienceModel->gov_position_type;
        $govContractStartDate = $this->arg('workExperience.govContractStartDate') ?? $workExperienceModel->gov_contract_start_date;
        $govContractEndDate = $this->arg('workExperience.govContractEndDate') ?? $workExperienceModel->gov_contract_end_date;
        $govContractorRoleSeniority = $this->arg('workExperience.govContractorRoleSeniority') ?? $workExperienceModel->gov_contractor_role_seniority;
        $govContractorType = $this->arg('workExperience.govContractorType') ?? $workExperienceModel->gov_contractor_type;
        $cafEmploymentType = $this->arg('workExperience.cafEmploymentType') ?? $workExperienceModel->caf_employment_type;
        $cafForce = $this->arg('workExperience.cafForce') ?? $workExperienceModel->caf_force;
        $cafRank = $this->arg('workExperience.cafRank') ?? $workExperienceModel->caf_rank;
        $classification = $this->arg('workExperience.classification') ?? $workExperienceModel->classification_attached;
        $department = $this->arg('workExperience.department') ?? $workExperienceModel->department_attached;

        return [
            // 'workExperience.employmentCategory' => [
            //     'required',
            // ],
            'workExperience.extSizeOfOrganization' => [
                Rule::requiredIf(
                    (
                        $employmentCategory === EmploymentCategory::EXTERNAL_ORGANIZATION->name
                    )
                ),
                Rule::prohibitedIf(
                    (
                        $employmentCategory !== EmploymentCategory::EXTERNAL_ORGANIZATION->name
                    )
                ),
            ],
            'workExperience.extRoleSeniority' => [
                Rule::requiredIf(
                    (
                        $employmentCategory === EmploymentCategory::EXTERNAL_ORGANIZATION->name
                    )
                ),
                Rule::prohibitedIf(
                    (
                        $employmentCategory !== EmploymentCategory::EXTERNAL_ORGANIZATION->name
                    )
                ),
            ],
            'workExperience.govEmploymentType' => [
                Rule::requiredIf(
                    (
                        $employmentCategory === EmploymentCategory::GOVERNMENT_OF_CANADA->name
                    )
                ),
                Rule::prohibitedIf(
                    (
                        $employmentCategory !== EmploymentCategory::GOVERNMENT_OF_CANADA->name
                    )
                ),
            ],
            'workExperience.govPositionType' => [
                Rule::requiredIf(
                    (
                        $govEmploymentType === GovEmploymentType::INDETERMINATE->name
                    )
                ),
                Rule::prohibitedIf(
                    (
                        $employmentCategory !== EmploymentCategory::GOVERNMENT_OF_CANADA->name
                    )
                ),
            ],
            'workExperience.govContractStartDate' => [
                Rule::requiredIf(
                    (
                        $govEmploymentType === GovEmploymentType::CONTRACTOR->name
                    )
                ),
                Rule::prohibitedIf(
                    (
                        $employmentCategory !== EmploymentCategory::GOVERNMENT_OF_CANADA->name
                    )
                ),
            ],
            'workExperience.govContractEndDate' => [
                Rule::prohibitedIf(
                    (
                        $employmentCategory !== EmploymentCategory::GOVERNMENT_OF_CANADA->name
                    )
                ),
            ],
            'workExperience.govContractorRoleSeniority' => [
                Rule::requiredIf(
                    (
                        $govEmploymentType === GovEmploymentType::CONTRACTOR->name
                    )
                ),
                Rule::prohibitedIf(
                    (
                        $employmentCategory !== EmploymentCategory::GOVERNMENT_OF_CANADA->name
                    )
                ),
            ],
            'workExperience.govContractorType' => [
                Rule::requiredIf(
                    (
                        $govEmploymentType === GovEmploymentType::CONTRACTOR->name
                    )
                ),
                Rule::prohibitedIf(
                    (
                        $employmentCategory !== EmploymentCategory::GOVERNMENT_OF_CANADA->name
                    )
                ),
            ],
            'workExperience.cafEmploymentType' => [
                Rule::requiredIf(
                    (
                        $employmentCategory === EmploymentCategory::CANADIAN_ARMED_FORCES->name
                    )
                ),
                Rule::prohibitedIf(
                    (
                        $employmentCategory !== EmploymentCategory::CANADIAN_ARMED_FORCES->name
                    )
                ),
            ],
            'workExperience.cafForce' => [
                Rule::requiredIf(
                    (
                        $employmentCategory === EmploymentCategory::CANADIAN_ARMED_FORCES->name
                    )
                ),
                Rule::prohibitedIf(
                    (
                        $employmentCategory !== EmploymentCategory::CANADIAN_ARMED_FORCES->name
                    )
                ),
            ],
            'workExperience.cafRank' => [
                Rule::requiredIf(
                    (
                        $employmentCategory === EmploymentCategory::CANADIAN_ARMED_FORCES->name
                    )
                ),
                Rule::prohibitedIf(
                    (
                        $employmentCategory !== EmploymentCategory::CANADIAN_ARMED_FORCES->name
                    )
                ),
            ],
            'workExperience.classification' => [
                Rule::requiredIf(
                    (
                        $govEmploymentType === GovEmploymentType::CASUAL->name
                    ) ||
                    (
                        $govEmploymentType === GovEmploymentType::TERM->name
                    ) ||
                    (
                        $govEmploymentType === GovEmploymentType::INDETERMINATE->name
                    )
                ),
                Rule::prohibitedIf(
                    (
                        $employmentCategory !== EmploymentCategory::GOVERNMENT_OF_CANADA->name
                    )
                ),
                Rule::exists('classifications', 'id'),
            ],
            'workExperience.department' => [
                Rule::requiredIf(
                    (
                        $govEmploymentType === GovEmploymentType::CASUAL->name
                    ) ||
                    (
                        $govEmploymentType === GovEmploymentType::TERM->name
                    ) ||
                    (
                        $govEmploymentType === GovEmploymentType::INDETERMINATE->name
                    )
                ),
                Rule::prohibitedIf(
                    (
                        $employmentCategory !== EmploymentCategory::GOVERNMENT_OF_CANADA->name
                    )
                ),
                Rule::exists('departments', 'id'),
            ],
        ];
    }

    /**
     * Return the validation messages
     */
    public function messages(): array
    {
        return [];
    }
}
