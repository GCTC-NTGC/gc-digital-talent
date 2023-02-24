<?php

namespace App\Policies;

use App\Models\Classification;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class ClassificationPolicy
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
     * @param  \App\Models\Classification  $classification
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
        return $user && $user->isAbleTo("create-any-classification");
    }

    /**
     * Determine whether the user can update the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Classification  $classification
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function update(User $user, Classification $classification)
    {
        return $user && $user->isAbleTo("update-any-classification");
    }

    /**
     * Determine whether the user can delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Classification  $classification
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function delete(User $user, Classification $classification)
    {
        return $user && $user->isAbleTo("delete-any-classification");
    }

    /**
     * Determine whether the user can restore the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Classification  $classification
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function restore(User $user, Classification $classification)
    {
        return $user && $user->isAbleTo("delete-any-classification");
    }

    /**
     * Determine whether the user can permanently delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Classification  $classification
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function forceDelete(User $user, Classification $classification)
    {
        return $user && $user->isAbleTo("delete-any-classification");
    }
}
