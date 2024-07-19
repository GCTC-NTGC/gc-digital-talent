<?php

namespace App\Rules;

use App\Models\Role;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class RoleTeamConsistent implements ValidationRule
{
    /**
     * Run the validation rule.
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        // ensure that if a team is input, the role is team based otherwise ensure it is not team based

        $roleId = $value['roleId'];
        $teamId = isset($value['teamId']) ? $value['teamId'] : null;

        if ($teamId) {
            $role = Role::where('id', $roleId)->where('is_team_based', true)->first();
            if (is_null($role)) {
                $fail('ROLE_NOT_FOUND');
            }
        } else {
            $role = Role::where('id', $roleId)->where('is_team_based', false)->first();
            if (is_null($role)) {
                $fail('ROLE_NOT_FOUND');
            }
        }
    }
}
