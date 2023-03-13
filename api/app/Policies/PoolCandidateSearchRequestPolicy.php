<?php

namespace App\Policies;

use App\Models\PoolCandidateSearchRequest;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class PoolCandidateSearchRequestPolicy
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
        return $user->isAbleTo("view-any-searchRequest");
    }

    /**
     * Determine whether the user can view the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\PoolCandidateSearchRequest  $poolCandidateSearchRequest
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function view(User $user, PoolCandidateSearchRequest $poolCandidateSearchRequest)
    {
        return $user->isAbleTo("view-any-searchRequest");
    }

    /**
     * Determine whether the user can create models.
     * Note: This action is possible for everyone, including anonymous users
     *
     * @param  \App\Models\User|null  $user
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function create(?User $user)
    {
        return true;
    }

    /**
     * Determine whether the user can update the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\PoolCandidateSearchRequest  $poolCandidateSearchRequest
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function update(User $user, PoolCandidateSearchRequest $poolCandidateSearchRequest)
    {
        return $user->isAbleTo("update-any-searchRequest");
    }

    /**
     * Determine whether the user can delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\PoolCandidateSearchRequest  $poolCandidateSearchRequest
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function delete(User $user, PoolCandidateSearchRequest $poolCandidateSearchRequest)
    {
        return $user->isAbleTo("delete-any-searchRequest");
    }

    /**
     * Determine whether the user can restore the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\PoolCandidateSearchRequest  $poolCandidateSearchRequest
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function restore(User $user, PoolCandidateSearchRequest $poolCandidateSearchRequest)
    {
        return $user->isAbleTo("delete-any-searchRequest");
    }

    /**
     * Determine whether the user can permanently delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\PoolCandidateSearchRequest  $poolCandidateSearchRequest
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function forceDelete(User $user, PoolCandidateSearchRequest $poolCandidateSearchRequest)
    {
        return false;
    }
}
