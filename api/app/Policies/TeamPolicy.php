<?php

namespace App\Policies;

use App\Models\Team;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class TeamPolicy
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
        return $user->isAbleTo("view-any-team");
    }

    /**
     * Determine whether the user can view a specific model.
     * To be sketched in later with roles and permissions work
     *
     * @param  \App\Models\User  $user
     * @param \App\Models\Team|null $team
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function view(User $user, Team $team = null)
    {
        return $user->isAbleTo("view-any-team");
    }

    /**
     * Determine whether the user can create models.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function create(User $user)
    {
        return $user->isAbleTo("create-any-team");
    }

    /**
     * Determine whether the user can update models.
     * Likely to be updated later to allow the team admin to update their own team
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function update(User $user)
    {
        return $user->isAbleTo("update-any-team");
    }

    /**
     * Determine whether the user can delete the model.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function delete(User $user)
    {
        return $user->isAbleTo("delete-any-team");
    }

    /**
     * Determine whether the user can view the members of a team.
     * Likely to be updated later to allow the team admin and teammates to view their own team
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function viewAnyTeamMembers(User $user)
    {
        return $user->isAbleTo("view-any-teamMembers");
    }

    /**
     * Determine whether the user can view a specific teams, team members.
     * Likely to be updated later to allow the team admin and teammates to view their own team
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function viewTeamMembers(User $user)
    {
        return $user->isAbleTo("view-team-teamMembers");
    }
}
