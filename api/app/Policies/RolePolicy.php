<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Role;
use Illuminate\Auth\Access\HandlesAuthorization;

class RolePolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     *
     * @param  \App\Models\User|null  $user
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function viewAny(User $user)
    {
        return $user->isAbleTo('view-any-role');
    }

    /**
     * Determine whether the user can view the role assignments of the role.
     * Likely to be updated later to allow the platform admin view the assignments regardless of team.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function viewAnyRoleAssignments(User $user)
    {
        return $user->isAbleTo('view-any-role');
    }

    /**
     * Determine whether the user can view a specific role
     *
     * @param  \App\Models\User|null  $user
     * @param  \App\Models\Role|null  $role
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function view(User $user)
    {
        return $user->isAbleTo('view-any-role');
    }

    /**
     * Determine whether the user can update a specific role
     *
     * @param  \App\Models\User|null  $user
     * @param  \App\Models\Role|null  $role
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function update(User $user)
    {
        return $user->isAbleTo('update-any-role');
    }
}
