<?php

namespace App\Policies;

use App\Models\TalentRequest;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;
use Illuminate\Auth\Access\Response;

class TalentRequestPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     *
     * @return Response|bool
     */
    public function viewAny(User $user)
    {
        return $user->isAbleTo('view-any-searchRequest');
    }

    /**
     * Determine whether the user can view the model.
     *
     * @return Response|bool
     */
    public function view(User $user, TalentRequest $talentRequest)
    {
        if ($user->isAbleTo('view-any-searchRequest')) {
            return true;
        }

        if ($user->isAbleTo('view-own-searchRequest') && $talentRequest->user_id == $user->id) {
            return true;
        }

        if (isset($talentRequest->community->team)) {
            return $user->isAbleTo('view-team-searchRequest', $talentRequest->community->team);
        }

        return false;
    }

    /**
     * Determine whether the user can create models.
     * Note: This action is possible for everyone, including anonymous users
     *
     * @return Response|bool
     */
    public function create(?User $user)
    {
        return true;
    }

    /**
     * Determine whether the user can update the model.
     *
     * @return Response|bool
     */
    public function update(User $user, TalentRequest $talentRequest)
    {
        if ($user->isAbleTo('update-any-searchRequest')) {
            return true;
        }

        if (isset($talentRequest->community->team)) {
            return $user->isAbleTo('update-team-searchRequest', $talentRequest->community->team);
        }

        return false;
    }

    /**
     * Determine whether the user can delete the model.
     *
     * @return Response|bool
     */
    public function delete(User $user, TalentRequest $talentRequest)
    {
        if ($user->isAbleTo('delete-any-searchRequest')) {
            return true;
        }

        if (isset($talentRequest->community->team)) {
            return $user->isAbleTo('delete-team-searchRequest', $talentRequest->community->team);
        }

        return false;
    }

    /**
     * Determine whether the user can restore the model.
     *
     * @return Response|bool
     */
    public function restore(User $user, TalentRequest $talentRequest)
    {
        return $user->isAbleTo('delete-any-searchRequest');
    }

    /**
     * Determine whether the user can permanently delete the model.
     *
     * @return Response|bool
     */
    public function forceDelete(User $user, TalentRequest $talentRequest)
    {
        return false;
    }
}
