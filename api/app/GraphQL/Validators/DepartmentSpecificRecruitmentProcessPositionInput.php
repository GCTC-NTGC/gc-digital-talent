<?php

namespace App\GraphQL\Validators;

use App\Rules\ArrayConsistentWithDetail;
use Database\Helpers\DirectiveFormsApiEnums;
use Nuwave\Lighthouse\Validation\Validator;

final class DepartmentSpecificRecruitmentProcessPositionInput extends Validator
{
    /**
     * Return the validation rules.
     *
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        return [
            'classificationGroup' => [
                'required_without:classificationLevel',
            ],
            'classificationLevel' => [
                'required_without:classificationGroup',
            ],
            'employmentTypes' => [
                new ArrayConsistentWithDetail(DirectiveFormsApiEnums::POSITION_EMPLOYMENT_TYPE_OTHER, 'employmentTypesOther'),
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
