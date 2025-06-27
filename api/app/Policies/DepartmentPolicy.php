<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class DepartmentPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     *
     * Note: This action is possible for everyone, including anonymous users
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function viewAny(?User $user)
    {
        return true;
    }

    /**
     * Determine whether the user can view the model.
     *
     * Note: This action is possible for everyone, including anonymous users
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function view(?User $user)
    {
        return true;
    }

    /**
     * Determine whether the user can create models.
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function create(User $user)
    {
        return $user->isAbleTo('create-any-department');
    }

    /**
     * Determine whether the user can update the model.
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function update(User $user)
    {
        return $user->isAbleTo('update-any-department');
    }

    /**
     * Determine whether the user can delete the model.
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function delete(User $user)
    {
        return $user->isAbleTo('delete-any-department');
    }

    /**
     * Determine whether the user can restore the model.
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function restore(User $user)
    {
        return $user->isAbleTo('delete-any-department');
    }

    /**
     * Determine whether the user can permanently delete the model.
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function forceDelete(User $user)
    {
        return $user->isAbleTo('delete-any-department');
    }

    /**
     * Determine whether the user can archive or unarchive a department.
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function archiveAndUnarchive(User $user)
    {
        return $user->isAbleTo('archive-any-department');
    }
}
