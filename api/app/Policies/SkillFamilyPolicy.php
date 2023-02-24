<?php

namespace App\Policies;

use App\Models\SkillFamily;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class SkillFamilyPolicy
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
        return true;
    }

    /**
     * Determine whether the user can view the model.
     *
     * @param  \App\Models\User|null  $user
     * @param  \App\Models\SkillFamily  $skillFamily
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function view(User $user = null)
    {
        return true;
    }

    /**
     * Determine whether the user can create models.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function create(User $user)
    {
        return $user && $user->isAbleTo("create-any-skillFamily");
    }

    /**
     * Determine whether the user can update the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\SkillFamily  $skillFamily
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function update(User $user, SkillFamily $skillFamily)
    {
        return $user && $user->isAbleTo("update-any-skillFamily");
    }

    /**
     * Determine whether the user can delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\SkillFamily  $skillFamily
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function delete(User $user, SkillFamily $skillFamily)
    {
        return $user && $user->isAbleTo("delete-any-skillFamily");
    }

    /**
     * Determine whether the user can restore the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\SkillFamily  $skillFamily
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function restore(User $user, SkillFamily $skillFamily)
    {
        return $user && $user->isAbleTo("delete-any-skillFamily");
    }

    /**
     * Determine whether the user can permanently delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\SkillFamily  $skillFamily
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function forceDelete(User $user, SkillFamily $skillFamily)
    {
        return $user && $user->isAbleTo("delete-any-skillFamily");
    }
}
