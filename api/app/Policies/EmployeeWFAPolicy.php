<?php

namespace App\Policies;

use App\Models\EmployeeWFA;
use App\Models\User;

class EmployeeWFAPolicy
{
    /**
     * Determine whether the user can view the model.
     *
     * NOTE: This only cares about `own` even though we have `any` and `team` scopes
     * That is due to the fact that we only check when you are accessing your own for now.
     *
     * The other permission checks happen as part of scopes.
     */
    public function view(User $user, EmployeeWFA $employeeWFA): bool
    {
        return $user->isAbleTo('view-own-employeeWFA') && $employeeWFA->id === $user->id;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, EmployeeWFA $employeeWFA): bool
    {
        return $user->isAbleTo('update-own-employeeWFA') && $employeeWFA->id === $user->id;
    }
}
