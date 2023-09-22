<?php

namespace App\GraphQL\Validators;

use App\Enums\DirectiveForms\PositionEmploymentType;
use App\Rules\ArrayConsistentWithDetail;
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
                new ArrayConsistentWithDetail(PositionEmploymentType::OTHER->name, 'employmentTypesOther'),
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
