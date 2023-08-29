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
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function viewAny(User $user)
    {
        return $user->isAbleTo('view-any-searchRequest');
    }

    /**
     * Determine whether the user can view the model.
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function view(User $user, PoolCandidateSearchRequest $poolCandidateSearchRequest)
    {
        return $user->isAbleTo('view-any-searchRequest');
    }

    /**
     * Determine whether the user can create models.
     * Note: This action is possible for everyone, including anonymous users
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function create(?User $user)
    {
        return true;
    }

    /**
     * Determine whether the user can update the model.
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function update(User $user, PoolCandidateSearchRequest $poolCandidateSearchRequest)
    {
        return $user->isAbleTo('update-any-searchRequest');
    }

    /**
     * Determine whether the user can delete the model.
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function delete(User $user, PoolCandidateSearchRequest $poolCandidateSearchRequest)
    {
        return $user->isAbleTo('delete-any-searchRequest');
    }

    /**
     * Determine whether the user can restore the model.
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function restore(User $user, PoolCandidateSearchRequest $poolCandidateSearchRequest)
    {
        return $user->isAbleTo('delete-any-searchRequest');
    }

    /**
     * Determine whether the user can permanently delete the model.
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function forceDelete(User $user, PoolCandidateSearchRequest $poolCandidateSearchRequest)
    {
        return false;
    }
}
