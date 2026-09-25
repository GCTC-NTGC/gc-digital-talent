<?php

namespace App\Policies;

use App\Models\Role;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;
use Illuminate\Auth\Access\Response;

class RolePolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     *
     * @return Response|bool
     */
    public function viewAny(User $user)
    {
        return $user->isAbleTo('view-any-role');
    }

    /**
     * Determine whether the user can view the role assignments of the role.
     *
     * @return Response|bool
     */
    public function viewAnyRoleAssignments(User $user)
    {
        // no permission or good reason to do this right now
        // can enumerate users for every role
        return false;
    }

    /**
     * Determine whether the user can view a specific role
     *
     * @return Response|bool
     */
    public function view(User $user)
    {
        return $user->isAbleTo('view-any-role');
    }

    /**
     * Determine whether the user can update a specific role
     *
     * @return Response|bool
     */
    public function update(User $user)
    {
        return $user->isAbleTo('update-any-role');
    }
}
