<?php

namespace App\GraphQL\Validators\Mutation;

use App\Rules\HasSubstantiveExperience;
use Nuwave\Lighthouse\Validation\Validator;

final class UpdateEmployeeWFAValidator extends Validator
{
    /**
     * Return the validation rules.
     *
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        return [
            'id' => [new HasSubstantiveExperience($this->data['wfa_interest'] ?? null)],
        ];
    }
}
