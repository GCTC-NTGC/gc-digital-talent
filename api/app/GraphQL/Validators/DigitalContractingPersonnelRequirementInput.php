<?php

namespace App\GraphQL\Validators;

use App\Enums\DirectiveForms\PersonnelLanguage;
use App\Enums\DirectiveForms\PersonnelScreeningLevel;
use App\Rules\ScalarConsistentWithDetail;
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
                new ScalarConsistentWithDetail(PersonnelLanguage::OTHER->name, 'languageOther'),
            ],
            'security' => [
                new ScalarConsistentWithDetail(PersonnelScreeningLevel::OTHER->name, 'securityOther'),
            ],
            'quantity' => [
                'integer',
                'min:1',
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
