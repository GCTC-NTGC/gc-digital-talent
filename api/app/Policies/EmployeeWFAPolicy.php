<?php

namespace App\Policies;

use App\Models\EmployeeWFA;
use App\Models\User;

class EmployeeWFAPolicy
{
    /**
     * Determine whether the user can view the model.
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
