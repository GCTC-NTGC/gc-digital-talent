<?php

namespace App\GraphQL\Validators;

use App\Rules\ScalarConsistentWithDetail;
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
            'language' => [
                new ScalarConsistentWithDetail(DirectiveFormsApiEnums::PERSONNEL_LANGUAGE_OTHER, 'languageOther')
            ],
            'security' => [
                new ScalarConsistentWithDetail(DirectiveFormsApiEnums::PERSONNEL_SCREENING_LEVEL_OTHER, 'securityOther')
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
