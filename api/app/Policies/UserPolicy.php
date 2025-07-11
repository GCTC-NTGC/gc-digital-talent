<?php

namespace App\Policies;

use App\Models\CommunityInterest;
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

        // Early return for global permissions
        if ($user->isAbleTo('view-any-user')) {
            return true;
        }

        // Early return for own user permission
        if ($user->id === $model->id && $user->isAbleTo('view-own-user')) {
            return true;
        }

        // Get all profile teams
        $teams = $user->rolesTeams()->get();

        $teamsWithApplicantProfile = $teams->filter(
            fn ($team) => $user->isAbleTo('view-team-applicantProfile', $team)
        )->pluck('id')->toArray();

        if (! empty($teamsWithApplicantProfile) && $this->applicantHasAppliedToPoolInTeams($model, $teamsWithApplicantProfile)) {
            return true;
        }

        $teamsWithCommunityTalent = $teams->filter(
            fn ($team) => $user->isAbleTo('view-team-communityTalent', $team)
        )->pluck('id')->toArray();

        if (! empty($teamsWithCommunityTalent) && $this->teamsUserHasSharedProfileWith($model, $teamsWithCommunityTalent)) {
            return true;
        }

        return false;

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
     * @param  array{id: ?string, roleAssignmentsInput: ?array{attach: ?array, detach: ?array}}  $args
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function updateRoles(User $user, $args)
    {
        $targetUserId = isset($args['id']) ? $args['id'] : null;
        $attachRoles = isset($args['roleAssignmentsInput']) && isset($args['roleAssignmentsInput']['attach']) ?
            $args['roleAssignmentsInput']['attach'] : [];
        $detachRoles = isset($args['roleAssignmentsInput']) && isset($args['roleAssignmentsInput']['detach']) ?
            $args['roleAssignmentsInput']['detach'] : [];

        if (is_null($targetUserId)) {
            return false;
        }

        $canAttachRoles = collect($attachRoles)->every(function ($roleInput) use ($user) {
            // loop through each element and check
            if (isset($roleInput['teamId'])) {
                return $this->teamAbleToCheck($user, $roleInput['roleId'], $roleInput['teamId']);
            } else {
                return $this->individualAbleToCheck($user, $roleInput['roleId']);
            }
        });

        $canDetachRoles = collect($detachRoles)->every(function ($roleInput) use ($user) {
            // loop through each element and check
            if (isset($roleInput['teamId'])) {
                return $this->teamAbleToCheck($user, $roleInput['roleId'], $roleInput['teamId']);
            } else {
                return $this->individualAbleToCheck($user, $roleInput['roleId']);
            }
        });

        if ($canAttachRoles && $canDetachRoles) {
            return true;
        }

        // user cannot update any roles
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
            ->whereNotDraft()
            ->where(function ($query) use ($teamIds) {
                $query->whereHas('pool.team', function ($q) use ($teamIds) {
                    $q->whereIn('id', $teamIds);
                })->orWhereHas('pool.community.team', function ($q) use ($teamIds) {
                    $q->whereIn('id', $teamIds);
                });
            })
            ->exists();
    }

    /*******************  COMMUNITY TALENT QUERIES  *******************/

    // a community talent is a user with a community interest
    protected function teamsUserHasSharedProfileWith(User $user, $teamIds)
    {
        return CommunityInterest::where('user_id', $user->id)
            ->where('consent_to_share_profile', true)
            ->whereHas('community.team', function ($query) use ($teamIds) {
                return $query->whereIn('id', $teamIds);
            })
            ->exists();
    }

    /*******************  ROLE CHECKING  *******************/

    /**
     * Function to check if the acting user can update a team based role
     *
     * @return bool
     */
    protected function teamAbleToCheck(User $actor, string $roleId, string $teamId)
    {
        if ($actor->isAbleTo('assign-any-role')) {
            return true;
        }

        $role = Role::findOrFail($roleId);
        $team = Team::with(['teamable.team'])->findOrFail($teamId);

        switch ($role->name) {
            case 'process_operator':
                // Community roles have the update-team-processOperatorMembership permission, and it should give them the ability to assign processOperator roles to pools in their community.
                // for assigning a process, team is a poolTeam so need to reach the community teamable for community checks
                $poolTeam = $team->loadMissing(['teamable.community.team']);

                return $actor->isAbleTo('update-any-processOperatorMembership')
                    || $actor->isAbleTo('update-team-processOperatorMembership', $team)
                || (isset($poolTeam->teamable->community->team) && $actor->isAbleTo('update-team-processOperatorMembership', $poolTeam->teamable->community->team));
            case 'community_recruiter':
                return $actor->isAbleTo('update-any-communityRecruiterMembership') || $actor->isAbleTo('update-team-communityRecruiterMembership', $team);
            case 'community_admin':
                return $actor->isAbleTo('update-any-communityAdminMembership') || $actor->isAbleTo('update-team-communityAdminMembership', $team);
            case 'community_talent_coordinator':
                return $actor->isAbleTo('update-any-communityTalentCoordinatorMembership') || $actor->isAbleTo('update-team-communityTalentCoordinatorMembership', $team);
        }

        return false; // reject unknown roles
    }

    /**
     * Function to check if the acting user can update an individual role
     *
     * @return bool
     */
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
            case 'platform_admin':
                return $actor->isAbleTo('update-any-platformAdminMembership ') || $actor->isAbleTo('assign-any-role');

        }

        return false; // reject unknown roles
    }

    /**
     * Determine whether the user can view a more limited version of the User model.
     */
    public function viewAnyBasicGovEmployeeProfile(User $user): bool
    {
        return $user->isAbleTo('view-any-basicGovEmployeeProfile');
    }
}
