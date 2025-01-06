<?php

namespace App\Policies;

use App\Models\EmployeeProfile;
use App\Models\User;

class EmployeeProfilePolicy
{
    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, EmployeeProfile $employeeProfile): bool
    {
        return $user->isAbleTo('view-own-employeeProfile') && $employeeProfile->id === $user->id;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, EmployeeProfile $employeeProfile): bool
    {
        return $user->isAbleTo('update-own-employeeProfile') && $employeeProfile->id === $user->id;
    }
}
