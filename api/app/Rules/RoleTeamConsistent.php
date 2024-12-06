<?php

namespace App\Rules;

use App\Models\Role;
use App\Models\Team;
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

        $role = Role::where('id', $roleId)->first();

        if ($role?->is_team_based) {
            if (is_null($teamId)) {
                $fail('TEAM_ID_REQUIRED');
            }
            $teamExists = Team::where('id', $teamId)->exists();
            if (! $teamExists) {
                $fail('TEAM_DOES_NOT_EXIST');
            }
        } else {
            if (! is_null($teamId)) {
                $fail('ROLE_NOT_TEAM_ROLE');
            }
            if (is_null($role)) {
                $fail('ROLE_NOT_FOUND');
            }
        }
    }
}
