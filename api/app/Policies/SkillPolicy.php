<?php

namespace App\Policies;

use App\Models\Skill;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class SkillPolicy
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
     * @param  \App\Models\Skill  $skill
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
        return $user && $user->isAbleTo("create-any-skill");
    }

    /**
     * Determine whether the user can update the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Skill  $skill
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function update(User $user, Skill $skill)
    {
        return $user && $user->isAbleTo("update-any-skill");
    }

    /**
     * Determine whether the user can delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Skill  $skill
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function delete(User $user, Skill $skill)
    {
        return $user && $user->isAbleTo("delete-any-skill");
    }

    /**
     * Determine whether the user can restore the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Skill  $skill
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function restore(User $user, Skill $skill)
    {
        return $user && $user->isAbleTo("delete-any-skill");
    }

    /**
     * Determine whether the user can permanently delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Skill  $skill
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function forceDelete(User $user, Skill $skill)
    {
        return $user && $user->isAbleTo("delete-any-skill");
    }
}
