<?php

namespace App\Policies;

use App\Models\PoolCandidate;
use App\Models\User;
use Database\Helpers\ApiEnums;
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
    public function viewAny(?User $user)
    {
        // We don't want anyone to view any application
        return false;
    }

    /**
     * Determine whether the user can view the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\PoolCandidate  $poolCandidate
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function view(?User $user, PoolCandidate $poolCandidate)
    {
        // If the user owns the application, we do not care about status
        if ($user?->id === $poolCandidate->user_id) {
            return $user?->isAbleTo("view-own-application");
        }

        // Check if user can view draft applications
        if (!$poolCandidate->submitted_at || in_array($poolCandidate->pool_candidate_status, [ApiEnums::CANDIDATE_STATUS_DRAFT, ApiEnums::CANDIDATE_STATUS_DRAFT_EXPIRED])) {
            return $user?->isAbleTo("view-any-draftApplication");
        }

        // If owner is not current user or application is not draft,
        // Check if they can view any submitted application
        return $user?->isAbleTo("view-any-submittedApplication");
    }

    /**
     * Determine whether the user can create models.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function create(?User $user)
    {
        return $user?->isAbleTo([
            "create-own-draftApplication",
            "create-any-application"
        ]);
    }

    /**
     * Determine whether the user can update the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\PoolCandidate  $poolCandidate
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function update(?User $user, PoolCandidate $poolCandidate)
    {
        // Only update an owner can do is submission, so check that
        if ($user?->id === $poolCandidate->user_id) {
            $user?->isAbleTo("submit-own-application");
        }

        /**
         * TO DO: Applications not associated with teams yet
         * so we will need to update this once they are
         */
        return $user?->isAbleTo("update-team-applicationStatus");
    }

    /**
     * Determine whether the user can submit the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\PoolCandidate  $poolCandidate
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function submit(?User $user, PoolCandidate $poolCandidate)
    {
        return  $user?->id === $poolCandidate->user_id && $user?->isAbleTo("submit-own-application");
    }

    /**
     * Determine whether the user can archive the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\PoolCandidate  $poolCandidate
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function archive(?User $user, PoolCandidate $poolCandidate)
    {
        return  $user?->id === $poolCandidate->user_id && $user?->isAbleTo("archive-own-submittedApplication");
    }

    /**
     * Determine whether the user can suspend the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\PoolCandidate  $poolCandidate
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function suspend(?User $user, PoolCandidate $poolCandidate)
    {
        return  $user?->id === $poolCandidate->user_id && $user?->isAbleTo("suspend-own-submittedApplication");
    }

    /**
     * Determine whether the user can suspend the model.
     *
     * Note: Everyone needs to be able to count applicants
     * for now
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\PoolCandidate  $poolCandidate
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function count(?User $user)
    {
        return true;
    }

    /**
     * Determine whether the user can delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\PoolCandidate  $poolCandidate
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function delete(?User $user, PoolCandidate $poolCandidate)
    {
        return $user?->id === $poolCandidate->user_id && $user?->isAbleTo("delete-own-draftApplication");
    }

    /**
     * Determine whether the user can restore the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\PoolCandidate  $poolCandidate
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function restore(?User $user, PoolCandidate $poolCandidate)
    {
        return $user?->id === $poolCandidate->user_id && $user?->isAbleTo("delete-own-draftApplication");
    }

    /**
     * Determine whether the user can permanently delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\PoolCandidate  $poolCandidate
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function forceDelete(?User $user, PoolCandidate $poolCandidate)
    {
        return $user?->id === $poolCandidate->user_id && $user?->isAbleTo("delete-own-draftApplication");
    }
}
