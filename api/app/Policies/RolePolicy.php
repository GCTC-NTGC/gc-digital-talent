<?php

namespace App\Policies;

use App\Models\User;
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
    public function viewAny(User $user = null)
    {
        if ($user) {
            return $user->isAdmin();
        }
        return false;
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
        return $user->isAdmin();
    }
}
