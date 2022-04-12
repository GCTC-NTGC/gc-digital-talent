<?php

namespace App\Policies;

use App\Models\Experience;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class ExperiencePolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can create models.
     *
     * @param  \App\Models\User  $user
     * @param  $request: The arguments included in the request, acquired with the injectArgs lighthouse directive
     *      We need to use this because the model hasn't been created yet so we can't read from it
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function create(User $user, $request)
    {
        return $user->isAdmin() || $user->id === $request['user_id'];
    }

    /**
     * Determine whether the user can update the model.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function update(User $user, $model)
    {
        return $user->isAdmin() || $user->id === $model->user_id;
    }

    /**
     * Determine whether the user can delete the model.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function delete(User $user, $model)
    {
        return $user->isAdmin() || $user->id === $model->user_id;
    }

    /**
     * Determine whether the user can restore the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\AwardExperience  $awardExperience
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function restore(User $user, AwardExperience $model)
    {
        return $user->isAdmin();
    }

    /**
     * Determine whether the user can permanently delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\AwardExperience  $awardExperience
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function forceDelete(User $user, AwardExperience $model)
    {
        return false;
    }
}
