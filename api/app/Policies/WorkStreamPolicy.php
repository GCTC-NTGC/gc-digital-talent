<?php

namespace App\Policies;

use App\Models\User;
use App\Models\WorkStream;

class WorkStreamPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(?User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(?User $user, WorkStream $workStream): bool
    {
        return true;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->isAbleTo('create-any-workStream');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, WorkStream $workStream): bool
    {
        return $user->isAbleTo('update-any-workStream');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, WorkStream $workStream): bool
    {
        return false;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, WorkStream $workStream): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, WorkStream $workStream): bool
    {
        return false;
    }
}
