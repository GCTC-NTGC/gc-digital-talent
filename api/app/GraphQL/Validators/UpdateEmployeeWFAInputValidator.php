<?php

namespace App\GraphQL\Validators;

use App\Rules\HasSubstantiveExperience;
use Nuwave\Lighthouse\Validation\Validator;

final class UpdateEmployeeWFAInputValidator extends Validator
{
    /**
     * Return the validation rules.
     *
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        return [
            'id' => [new HasSubstantiveExperience],
        ];
    }
}
