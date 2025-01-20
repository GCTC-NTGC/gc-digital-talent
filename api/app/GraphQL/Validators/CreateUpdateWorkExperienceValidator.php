<?php

namespace App\GraphQL\Validators;

use App\Enums\EmploymentCategory;
use App\Enums\GovContractorType;
use App\Enums\WorkExperienceGovEmployeeType;
use Illuminate\Validation\Rule;
use Nuwave\Lighthouse\Validation\Validator;

final class CreateUpdateWorkExperienceValidator extends Validator
{
    /**
     * Return the validation rules.
     *
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        return [
            'workExperience.employmentCategory' => [
                'sometimes',
                'required',
            ],
            'workExperience.extSizeOfOrganization' => [
                Rule::requiredIf(
                    (
                        $this->arg('workExperience.employmentCategory') === EmploymentCategory::EXTERNAL_ORGANIZATION->name
                    )
                ),
                Rule::prohibitedIf(
                    (
                        $this->arg('workExperience.employmentCategory') !== EmploymentCategory::EXTERNAL_ORGANIZATION->name
                    )
                ),
            ],
            'workExperience.extRoleSeniority' => [
                Rule::requiredIf(
                    (
                        $this->arg('workExperience.employmentCategory') === EmploymentCategory::EXTERNAL_ORGANIZATION->name
                    )
                ),
                Rule::prohibitedIf(
                    (
                        $this->arg('workExperience.employmentCategory') !== EmploymentCategory::EXTERNAL_ORGANIZATION->name
                    )
                ),
            ],
            'workExperience.govEmploymentType' => [
                Rule::requiredIf(
                    (
                        $this->arg('workExperience.employmentCategory') === EmploymentCategory::GOVERNMENT_OF_CANADA->name
                    )
                ),
                Rule::prohibitedIf(
                    (
                        $this->arg('workExperience.employmentCategory') !== EmploymentCategory::GOVERNMENT_OF_CANADA->name
                    )
                ),
            ],
            'workExperience.govPositionType' => [
                Rule::requiredIf(
                    (
                        $this->arg('workExperience.govEmploymentType') === WorkExperienceGovEmployeeType::INDETERMINATE->name
                    )
                ),
                Rule::prohibitedIf(
                    (
                        $this->arg('workExperience.govEmploymentType') !== WorkExperienceGovEmployeeType::INDETERMINATE->name
                    )
                ),
                Rule::prohibitedIf(
                    (
                        $this->arg('workExperience.employmentCategory') !== EmploymentCategory::GOVERNMENT_OF_CANADA->name
                    )
                ),
            ],
            'workExperience.govContractorRoleSeniority' => [
                Rule::requiredIf(
                    (
                        $this->arg('workExperience.govEmploymentType') === WorkExperienceGovEmployeeType::CONTRACTOR->name
                    )
                ),
                Rule::prohibitedIf(
                    (
                        $this->arg('workExperience.employmentCategory') !== EmploymentCategory::GOVERNMENT_OF_CANADA->name
                    )
                ),
            ],
            'workExperience.govContractorType' => [
                Rule::requiredIf(
                    (
                        $this->arg('workExperience.govEmploymentType') === WorkExperienceGovEmployeeType::CONTRACTOR->name
                    )
                ),
                Rule::prohibitedIf(
                    (
                        $this->arg('workExperience.employmentCategory') !== EmploymentCategory::GOVERNMENT_OF_CANADA->name
                    )
                ),
            ],
            'workExperience.contractorFirmAgencyName' => [
                Rule::requiredIf(
                    (
                        $this->arg('workExperience.govContractorType') === GovContractorType::FIRM_OR_AGENCY->name
                    )
                ),
                Rule::prohibitedIf(
                    (
                        $this->arg('workExperience.govContractorType') !== GovContractorType::FIRM_OR_AGENCY->name
                    )
                ),
            ],
            'workExperience.cafEmploymentType' => [
                Rule::requiredIf(
                    (
                        $this->arg('workExperience.employmentCategory') === EmploymentCategory::CANADIAN_ARMED_FORCES->name
                    )
                ),
                Rule::prohibitedIf(
                    (
                        $this->arg('workExperience.employmentCategory') !== EmploymentCategory::CANADIAN_ARMED_FORCES->name
                    )
                ),
            ],
            'workExperience.cafForce' => [
                Rule::requiredIf(
                    (
                        $this->arg('workExperience.employmentCategory') === EmploymentCategory::CANADIAN_ARMED_FORCES->name
                    )
                ),
                Rule::prohibitedIf(
                    (
                        $this->arg('workExperience.employmentCategory') !== EmploymentCategory::CANADIAN_ARMED_FORCES->name
                    )
                ),
            ],
            'workExperience.cafRank' => [
                Rule::requiredIf(
                    (
                        $this->arg('workExperience.employmentCategory') === EmploymentCategory::CANADIAN_ARMED_FORCES->name
                    )
                ),
                Rule::prohibitedIf(
                    (
                        $this->arg('workExperience.employmentCategory') !== EmploymentCategory::CANADIAN_ARMED_FORCES->name
                    )
                ),
            ],
            'workExperience.classificationId' => [
                Rule::requiredIf(
                    $this->arg('workExperience.employmentCategory') === EmploymentCategory::GOVERNMENT_OF_CANADA->name
                      &&
                    (
                        $this->arg('workExperience.govEmploymentType') === WorkExperienceGovEmployeeType::CASUAL->name
                    ) ||
                    (
                        $this->arg('workExperience.govEmploymentType') === WorkExperienceGovEmployeeType::TERM->name
                    ) ||
                    (
                        $this->arg('workExperience.govEmploymentType') === WorkExperienceGovEmployeeType::INDETERMINATE->name
                    )
                ),
                // This does not work without proper connect/disconnect in the schema
                // Rule::exists('classifications', 'id'),
            ],
            'workExperience.departmentId' => [
                Rule::requiredIf(
                    $this->arg('workExperience.employmentCategory') === EmploymentCategory::GOVERNMENT_OF_CANADA->name
                ),
                // This does not work without proper connect/disconnect in the schema
                // Rule::exists('departments', 'id'),
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
