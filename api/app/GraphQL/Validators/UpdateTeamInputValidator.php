<?php

namespace App\GraphQL\Validators;

use Illuminate\Validation\Rule;
use Nuwave\Lighthouse\Validation\Validator;

final class UpdateTeamInputValidator extends Validator
{
    /**
     * Return the validation rules.
     *
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        return [
            'name' => [
                'sometimes',
                Rule::unique('teams', 'name')->ignore($this->arg('id'), 'id'),
            ],
        ];
    }

    /**
     * Return the validation messages
     */
    public function messages(): array
    {
        return [
            'name.unique' => 'TeamNameInUse',
        ];
    }
}
