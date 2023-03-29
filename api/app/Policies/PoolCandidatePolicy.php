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
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function viewAny()
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
    public function view(User $user, PoolCandidate $poolCandidate)
    {

        // If the user owns the application, we do not care about status
        if ($user->id === $poolCandidate->user_id && $user?->isAbleTo("view-own-application")) {
            return true;
        }

        $isDraft = $poolCandidate->isDraft();

        // Exit early if user can view any draft application
        if ($isDraft) {
            return $user->isAbleTo("view-any-draftApplication");
        }

        if(!$isDraft) {
            if($user->isAbleTo("view-any-submittedApplication")) {
                return true;
            }

            $poolCandidate->loadMissing('pool.team');
            $candidatePoolTeam = $poolCandidate->pool->team;
            if ($user->isAbleTo("view-team-submittedApplication", $candidatePoolTeam)) {
                return true;
            }
        }

        // Noting passed for deny access
        return false;
    }

    /**
     * Determine whether the user can create draft models.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function createDraft(User $user)
    {
        return $user->isAbleTo("create-own-draftApplication");
    }

    /**
     * Determine whether the user can create models.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function create(User $user)
    {
        return $user->isAbleTo("create-any-application");
    }

    /**
     * Determine whether an admin user can update the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\PoolCandidate  $poolCandidate
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function updateAsAdmin(User $user, PoolCandidate $poolCandidate)
    {

        $poolCandidate->loadMissing('pool.team');
        $candidatePoolTeam = $poolCandidate->pool->team;
        $isDraft = $poolCandidate->isDraft();
        if ($user->isAbleTo("update-team-applicationStatus", $candidatePoolTeam) && !$isDraft) {
            return true;
        }

        return false;
    }

    /**
     * Determine whether a user can update the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\PoolCandidate  $poolCandidate
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function update(User $user, PoolCandidate $poolCandidate)
    {
        $isOwn = $user->id == $poolCandidate->user_id;
        $isDraft = $poolCandidate->isDraft();
        if ($user->isAbleTo("update-own-draftApplication") && $isOwn && $isDraft) {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can submit the model.
     *
     * Note: This is checking authorization, checking if the application
     * is in a state to be submitted is done during data validation.
     *
     * If using this  policy method, please validate all data as well.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\PoolCandidate  $poolCandidate
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function submit(User $user, PoolCandidate $poolCandidate)
    {
        return  $user->id === $poolCandidate->user_id && $user->isAbleTo("submit-own-application");
    }

    /**
     * Determine whether the user can archive the model.
     *
     * Note: This is checking authorization, checking if the application
     * is in a state to be archived is done during data validation.
     *
     * If using this  policy method, please validate all data as well.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\PoolCandidate  $poolCandidate
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function archive(User $user, PoolCandidate $poolCandidate)
    {
        return $user->id === $poolCandidate->user_id && $user->isAbleTo("archive-own-submittedApplication");
    }

    /**
     * Determine whether the user can suspend the model.
     *
     * Note: This is checking authorization, checking if the application
     * is in a state to be suspended is done during data validation.
     *
     * If using this  policy method, please validate all data as well.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\PoolCandidate  $poolCandidate
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function suspend(User $user, PoolCandidate $poolCandidate)
    {
        return $user->id === $poolCandidate->user_id && $user->isAbleTo("suspend-own-submittedApplication");
    }

    /**
     * Determine whether the user can count the number of items in the model.
     *
     * Note: Everyone needs to be able to count applicants
     * for now
     *
     * @param  \App\Models\PoolCandidate  $poolCandidate
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function count()
    {
        return true;
    }

    /**
     * Determine whether the user can delete the model.
     *
     * Note: This is checking authorization, checking if the application
     * is in a state to be deleted is done during data validation
     *
     * If using this  policy method, please validate all data as well.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\PoolCandidate  $poolCandidate
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function delete(User $user, PoolCandidate $poolCandidate)
    {
        return $user->id === $poolCandidate->user_id && $user->isAbleTo("delete-own-draftApplication");
    }
}
