<?php

namespace App\GraphQL\Validators;

use App\Enums\EmploymentCategory;
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
            // 'workExperience.employmentCategory' => [
            //     'required',
            // ],
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
            'workExperience.classification' => [
                Rule::requiredIf(
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
                Rule::prohibitedIf(
                    (
                        $this->arg('workExperience.employmentCategory') !== EmploymentCategory::GOVERNMENT_OF_CANADA->name
                    )
                ),
                Rule::exists('classifications', 'id'),
            ],
            'workExperience.department' => [
                Rule::requiredIf(
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
                Rule::prohibitedIf(
                    (
                        $this->arg('workExperience.employmentCategory') !== EmploymentCategory::GOVERNMENT_OF_CANADA->name
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