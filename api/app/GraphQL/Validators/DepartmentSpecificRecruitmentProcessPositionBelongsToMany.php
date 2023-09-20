<?php

namespace App\GraphQL\Validators;

use Nuwave\Lighthouse\Validation\Validator;

final class DepartmentSpecificRecruitmentProcessPositionBelongsToMany extends Validator
{
    /**
     * Return the validation rules.
     *
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        return [
            'create' => ['array', 'min:1'],
        ];
    }

    /**
     * Return the validation messages
     */
    public function messages(): array
    {
        return [
            'create.min' => 'NEED_AT_LEAST_ONE_POSITION',
        ];
    }
}
