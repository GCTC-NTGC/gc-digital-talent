<?php

namespace App\Policies;

use App\Models\PoolCandidate;
use App\Models\User;
use App\Models\Team;
use Illuminate\Auth\Access\HandlesAuthorization;
use Illuminate\Support\Facades\Log;

class UserPolicy
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
        return $user->isAbleTo('view-any-user');
    }

    /**
     * Determine whether the user can view the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\User  $model
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function view(User $user, User $model)
    {
        return $user->isAbleTo('view-any-user')
            || ($user->isAbleTo('view-own-user') && $user->id === $model->id);
    }

    /**
     * Determine whether the user can view a more limited version of the User model.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function viewBasicInfo(User $user)
    {
        return $user->isAbleTo('view-any-userBasicInfo');
    }

    /**
     * Determine whether the user can create models.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function create(User $user)
    {
        return $user->isAbleTo("create-any-user");
    }

    /**
     * Determine whether the user can update the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\User  $model
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function update(User $user, User $model, ?array $injected = null)
    {
        /**
         * If a user is assigning a role here, check all actions
         * and fail early
         */
        if ($injected && isset($injected["roles"])) {
            if (!$user->isAbleTo("assign-any-role")) {
                return false;
            }
        }
        // TODO: Right now, for a user to assign-any-role they ALSO need to be able to update-any-user! That doesn't quite match the permissions table.
        return $user->isAbleTo('update-any-user')
            || ($user->isAbleTo('update-own-user') && $user->id === $model->id);
    }

    /**
     * Determine whether the user can delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\User  $model
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function delete(User $user, User $model)
    {
        return $user->isAbleTo('delete-any-user') && $user->id !== $model->id; // Do not allow user to delete their own model.
    }

    /**
     * Determine whether the user can restore the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\User  $model
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function restore(User $user, User $model)
    {
        return $user->isAbleTo('delete-any-user') && $user->id !== $model->id; // Do not allow user to restore their own model.
    }

    /*******************  APPLICANT QUERIES  *******************/

    /**
     * Determine whether the user can view any models.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function viewAnyApplicants(User $user)
    {
        return $user->isAbleTo('view-any-applicantProfile');
    }

    /**
     * Determine whether the user can view the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\User  $model
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function viewApplicant(User $user, User $model)
    {
        return $user->isAbleTo('view-any-applicantProfile')
            || ($user->isAbleTo('view-team-applicantProfile')
                && $this->applicantHasAppliedToPoolInTeams(
                    $model,
                    $user->rolesTeams()->get()->pluck('id')
                ) || ($user->isAbleTo('view-own-applicantProfile')
                    && $user->id === $model->id
                )
            );
    }

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
