<?php

namespace App\GraphQL\Validators;

use Illuminate\Validation\Rule;
use Nuwave\Lighthouse\Validation\Validator;

final class TeamRolesInputValidator extends Validator
{
    public function __construct() {}

    /**
     * Return the validation rules.
     *
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        return [
            'roles.*' => [
                'distinct',
                Rule::exists('roles', 'id')->where(function ($query) {
                    return $query->where('is_team_based', true);
                }),
            ],
        ];
    }
}
