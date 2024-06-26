<?php

namespace App\Policies;

use App\Models\PoolCandidate;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class UserPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function viewAny(User $user)
    {
        return $user->isAbleTo('view-any-user');
    }

    /**
     * Determine whether the user can view the model.
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function view(User $user, User $model)
    {
        return $user->isAbleTo('view-any-user')
            || ($user->isAbleTo('view-own-user') && $user->id === $model->id) || ($user->isAbleTo('view-team-applicantProfile')
                && $this->applicantHasAppliedToPoolInTeams(
                    $model,
                    $user->rolesTeams()->get()->pluck('id')
                )
            );
    }

    /**
     * Determine whether the user can view a more limited version of the User model.
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function viewBasicInfo(User $user)
    {
        return $user->isAbleTo('view-any-userBasicInfo');
    }

    /**
     * Determine whether the user can create models.
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function create(User $user)
    {
        return $user->isAbleTo('create-any-user');
    }

    /**
     * Determine whether the user can update the model.
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function update(User $user, User $model)
    {
        return $user->isAbleTo('update-any-user') ||
            ($user->isAbleTo('update-own-user') && $user->id === $model->id);
    }

    /**
     * Determine whether the user can update sub.
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function updateSub(User $user)
    {
        return $user->isAbleTo('update-any-userSub');
    }

    /**
     * Determine whether the user can update roles.
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function updateRoles(User $user)
    {
        return $user->isAbleTo('assign-any-role');
    }

    /**
     * Determine whether the user can delete the model.
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function delete(User $user, User $model)
    {
        return $user->isAbleTo('delete-any-user') && $user->id !== $model->id; // Do not allow user to delete their own model.
    }

    /**
     * Determine whether the user can restore the model.
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function restore(User $user, User $model)
    {
        return $user->isAbleTo('delete-any-user') && $user->id !== $model->id; // Do not allow user to restore their own model.
    }

    /*******************  APPLICANT QUERIES  *******************/

    protected function applicantHasAppliedToPoolInTeams(User $applicant, $teamIds)
    {
        return PoolCandidate::where('user_id', $applicant->id)
            ->notDraft()
            ->whereHas('pool', function ($query) use ($teamIds) {
                return $query->whereIn('team_id', $teamIds);
            })
            ->exists();
    }
}
