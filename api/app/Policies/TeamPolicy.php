<?php

namespace App\Policies;

use App\Models\Team;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class TeamPolicy
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
     * Determine whether the user can view a specific model.
     * To be sketched in later with roles and permissions work
     *
     * @param  \App\Models\User|null  $user
     * @param \App\Models\Team|null $team
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function view(User $user = null, Team $team = null)
    {
        if ($user) {
            return $user->isAdmin();
        }
        return false;
    }

    /**
     * Determine whether the user can create models.
     *
     * @param  \App\Models\User|null  $user
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function create(User $user = null)
    {
        if ($user) {
            return $user->isAdmin();
        }
        return false;
    }

    /**
     * Determine whether the user can update models.
     * Likely to be updated later to allow the team admin to update their own team
     *
     * @param  \App\Models\User|null  $user
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function update(User $user = null)
    {
        if ($user) {
            return $user->isAdmin();
        }
        return false;
    }
}
