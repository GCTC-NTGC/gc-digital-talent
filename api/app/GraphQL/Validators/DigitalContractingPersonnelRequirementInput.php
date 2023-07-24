<?php

namespace App\GraphQL\Validators;

use Database\Helpers\DirectiveFormsApiEnums;
use Nuwave\Lighthouse\Validation\Validator;

final class DigitalContractingPersonnelRequirementInput extends Validator
{
    /**
     * Return the validation rules.
     *
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        return [
            'languageOther' => [
                'requiredIf:language,' . DirectiveFormsApiEnums::PERSONNEL_LANGUAGE_OTHER,
                'prohibited_unless:language,' . DirectiveFormsApiEnums::PERSONNEL_LANGUAGE_OTHER,
            ],
            'securityOther' => [
                'requiredIf:security,' . DirectiveFormsApiEnums::PERSONNEL_SCREENING_LEVEL_OTHER,
                'prohibited_unless:security,' . DirectiveFormsApiEnums::PERSONNEL_SCREENING_LEVEL_OTHER,
            ],
            'quantity' => [
                'integer',
                'min:1'
            ]
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
