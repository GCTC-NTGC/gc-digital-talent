<?php

namespace App\Policies;

use App\Models\Community;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class CommunityPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     * Everyone is allowed to view the communities
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function viewAny(?User $user)
    {
        return true;
    }

    /**
     * Determine whether the user can view the model.
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function view(?User $user, Community $community)
    {
        return true;
    }

    /**
     * Determine whether the user can view the team members of a specific communities team
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function viewTeamMembers(User $user, Community $community)
    {
        $community->loadMissing('team');

        return $user->isAbleTo('view-any-teamMembers') || $user->isAbleTo('view-team-teamMembers', $community->team);
    }
}
