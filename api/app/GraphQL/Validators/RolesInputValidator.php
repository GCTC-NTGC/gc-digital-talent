<?php

namespace App\GraphQL\Validators;

use App\Rules\RolesAreTeamBased;
use Nuwave\Lighthouse\Validation\Validator;
use Illuminate\Validation\Rule;


final class RolesInputValidator extends Validator
{

    public function __construct()
    {
    }

    /**
     * Return the validation rules.
     *
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        if (!empty($this->arg('team'))) {
            // We have a team ID provided.  We'll need to ensure all the roles are team based.
            return [
                'roles.*' => [
                    'distinct',
                    Rule::exists('roles', 'id')->where(function ($query) {
                        return $query->where('is_team_based', true);
                    }),
                ],
            ];
        }

        // No team ID.  We'll need to ensure all the roles are not team based.
        return [
            'roles.*' => [
                'distinct',
                Rule::exists('roles', 'id')->where(function ($query) {
                    return $query->where('is_team_based', false);
                }),
            ],
        ];
    }
}
