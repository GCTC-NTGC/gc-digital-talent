<?php

namespace App\Policies;

use App\Models\PoolCandidate;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class PoolCandidatePolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function viewAny(User $user)
    {
        return $user->isAdmin();
    }

    /**
     * Determine whether the user can view the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\PoolCandidate  $poolCandidate
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function view(User $user, PoolCandidate $poolCandidate)
    {
        return $user->isAdmin() || $user->id === $poolCandidate->user_id;
    }

    /**
     * Determine whether the user can create models.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function create(User $user)
    {
        return $user->isAdmin();
    }

    /**
     * Determine whether the user can update the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\PoolCandidate  $poolCandidate
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function update(User $user, PoolCandidate $poolCandidate)
    {
        return $user->isAdmin();
    }

    /**
     * Determine whether the user can delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\PoolCandidate  $poolCandidate
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function delete(User $user, PoolCandidate $poolCandidate)
    {
        return $user->isAdmin();
    }

    /**
     * Determine whether the user can restore the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\PoolCandidate  $poolCandidate
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function restore(User $user, PoolCandidate $poolCandidate)
    {
        return $user->isAdmin();
    }

    /**
     * Determine whether the user can permanently delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\PoolCandidate  $poolCandidate
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function forceDelete(User $user, PoolCandidate $poolCandidate)
    {
        return false;
    }

    /**
     * Determine whether the user can archive an application
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\PoolCandidate  $poolCandidate
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function archiveApplication(User $user, PoolCandidate $poolCandidate)
    {
        return $user->isAdmin() || $user->id === $poolCandidate->user_id;
    }

    /**
     * Determine whether the user can delete an application
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\PoolCandidate  $poolCandidate
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function deleteApplication(User $user, PoolCandidate $poolCandidate)
    {
        return $user->isAdmin() || $user->id === $poolCandidate->user_id;
    }
}
