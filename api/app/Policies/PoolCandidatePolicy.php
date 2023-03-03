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
        if ($user->id === $poolCandidate->user_id) {
            return $user?->isAbleTo("view-own-application");
        }

        // Check if user can view draft applications
        if ($poolCandidate->isDraft()) {
            return $user->isAbleTo("view-any-draftApplication");
        }

        $candidatePoolTeam = $poolCandidate->with('pool.team')->get()->pluck('pool.team')->first();
        return $user->isAbleTo("update-team-applicationStatus", $candidatePoolTeam);

        // If owner is not current user or application is not draft,
        // Check if they can view any submitted application
        return $user->isAbleTo("view-any-submittedApplication");
    }

    /**
     * Determine whether the user can create models.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function create(User $user)
    {
        return $user->isAbleTo([
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

        $candidatePoolTeam = $this->userBelongsToPoolCandidatePool($user, $poolCandidate);

        if ($candidatePoolTeam) {
            return $user?->isAbleTo("update-team-applicationStatus", $candidatePoolTeam);
        }

        return false;
    }

    /**
     * Determine whether the user can submit the model.
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
     * @param  \App\Models\User  $user
     * @param  \App\Models\PoolCandidate  $poolCandidate
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function archive(User $user, PoolCandidate $poolCandidate)
    {
        return  $user->id === $poolCandidate->user_id && $user->isAbleTo("archive-own-submittedApplication");
    }

    /**
     * Determine whether the user can suspend the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\PoolCandidate  $poolCandidate
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function suspend(User $user, PoolCandidate $poolCandidate)
    {
        return  $user->id === $poolCandidate->user_id && $user->isAbleTo("suspend-own-submittedApplication");
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
     * @param  \App\Models\User  $user
     * @param  \App\Models\PoolCandidate  $poolCandidate
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function delete(User $user, PoolCandidate $poolCandidate)
    {
        return $user->id === $poolCandidate->user_id && $user->isAbleTo("delete-own-draftApplication");
    }

    /**
     * Determine if User owns the Pool for the PoolCandidate
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\PoolCandidate  $poolCandidate
     * @return \App\Models\Team|bool
     */
    private function userBelongsToPoolCandidatePool(?User $user, PoolCandidate $poolCandidate)
    {
        $candidatePoolTeam = $poolCandidate->with('pool.team')->get()->pluck('pool.team')->first();
        if($user?->rolesTeams->contains($candidatePoolTeam->id)) {
            return $candidatePoolTeam;
        }

        return false;
    }
}
