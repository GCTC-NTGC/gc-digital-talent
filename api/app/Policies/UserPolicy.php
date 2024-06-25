<?php

namespace App\Policies;

use App\Models\PoolCandidate;
use App\Models\Role;
use App\Models\Team;
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
     * @param  UpdateUserRolesInput  $args
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function updateRoles(User $user, $args)
    {
        $targetUserId = isset($args['id']) ? $args['id'] : null;
        $attachRoles = isset($args['roleAssignmentsInput']) && isset($args['roleAssignmentsInput']['attach']) ?
            $args['roleAssignmentsInput']['attach'] : null;
        $detachRoles = isset($args['roleAssignmentsInput']) && isset($args['roleAssignmentsInput']['detach']) ?
            $args['roleAssignmentsInput']['detach'] : null;

        if (is_null($targetUserId)) {
            return false;
        }

        // adding team based roles to someone
        if ($attachRoles && isset($attachRoles['roles']) && isset($attachRoles['team'])) {
            $rolesArray = $attachRoles['roles'];
            foreach ($rolesArray as $roleId) {
                if (! $this->teamAbleToCheck($user, $roleId, $attachRoles['team'])) {
                    return false;
                }
            }

            return true;
        }

        // removing team based roles from someone
        if ($detachRoles && isset($detachRoles['roles']) && isset($detachRoles['team'])) {
            $rolesArray = $detachRoles['roles'];
            foreach ($rolesArray as $roleId) {
                if (! $this->teamAbleToCheck($user, $roleId, $detachRoles['team'])) {
                    return false;
                }
            }

            return true;
        }

        // adding individual roles to someone
        if ($attachRoles && isset($attachRoles['roles']) && empty($attachRoles['team'])) {
            $rolesArray = $attachRoles['roles'];
            foreach ($rolesArray as $roleId) {
                if (! $this->individualAbleToCheck($user, $roleId)) {
                    return false;
                }
            }

            return true;
        }

        // removing individual roles from someone
        if ($detachRoles && isset($detachRoles['roles']) && empty($detachRoles['team'])) {
            $rolesArray = $detachRoles['roles'];
            foreach ($rolesArray as $roleId) {
                if (! $this->individualAbleToCheck($user, $roleId)) {
                    return false;
                }
            }

            return true;
        }

        return false;
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

    /*******************  ROLE CHECKING  *******************/

    protected function teamAbleToCheck(User $actor, string $roleId, string $teamId)
    {
        $role = Role::findOrFail($roleId);
        $team = Team::findOrFail($teamId);

        switch ($role->name) {
            case 'pool_operator':
                return $actor->isAbleTo('assign-any-teamRole');
            case 'process_operator':
                return $actor->isAbleTo('update-any-processOperatorMembership') || $actor->isAbleTo('update-team-processOperatorMembership', $team);
            case 'community_recruiter':
                return $actor->isAbleTo('update-any-communityRecruiterMembership ') || $actor->isAbleTo('update-team-communityRecruiterMembership ', $team);
            case 'community_admin':
                return $actor->isAbleTo('update-any-communityAdminMembership ') || $actor->isAbleTo('update-team-communityAdminMembership ', $team);
        }
    }

    protected function individualAbleToCheck(User $actor, string $roleId)
    {
        $role = Role::findOrFail($roleId);

        switch ($role->name) {
            case 'guest':
                return $actor->isAbleTo('assign-any-role');
            case 'base_user':
                return $actor->isAbleTo('assign-any-role');
            case 'applicant':
                return $actor->isAbleTo('assign-any-role');
            case 'request_responder':
                return $actor->isAbleTo('assign-any-role');
            case 'community_manager':
                return $actor->isAbleTo('assign-any-role');
            case 'platform_admin':
                return $actor->isAbleTo('update-any-platformAdminMembership ');
        }
    }
}
