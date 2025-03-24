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
     * Everyone is allowed to view the team including guests
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function viewAny(?User $user)
    {
        return true;
    }

    /**
     * Determine whether the user can view a specific model.
     * To be sketched in later with roles and permissions work
     * Everyone is allowed to view the team including guests
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function view(?User $user, ?Team $team = null)
    {
        return true;
    }

    /**
     * Determine whether the user can assign any user to this team (giving them any team-based role)
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function assignTeamMembers(User $user, Team $team)
    {
        return $user->isAbleTo('assign-any-role') || $user->isAbleTo('assign-any-teamRole') || $user->isAbleTo('assign-team-role', $team);
    }

    /**
     * Determine whether the user can view the teams Teamable
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function viewTeamable(User $user, Team $team)
    {
        $team->loadMissing('teamable');

        // Allow any user to see if there is no teamable
        return is_null($team->teamable) || $user->can('view', $team->teamable);
    }
}
