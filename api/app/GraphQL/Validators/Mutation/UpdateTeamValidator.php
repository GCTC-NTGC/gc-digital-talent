<?php

namespace App\GraphQL\Validators\Mutation;

use App\Enums\ApiError;
use Illuminate\Validation\Rule;
use Nuwave\Lighthouse\Validation\Validator;

final class UpdateTeamValidator extends Validator
{
    /**
     * Return the validation rules.
     *
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        return [
            'team.name' => [
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
            'team.name.unique' => ApiError::TEAM_NAME_IN_USE->localizedErrorMessage(),
        ];
    }
}
