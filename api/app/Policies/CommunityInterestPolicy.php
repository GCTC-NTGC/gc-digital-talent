<?php

namespace App\Policies;

use App\Models\CommunityInterest;
use App\Models\User;

class CommunityInterestPolicy
{
    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, CommunityInterest $communityInterest): bool
    {
        return $user->isAbleTo('view-own-employeeProfile') && $user->id === $communityInterest->user_id;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user, array $args): bool
    {

        $targetUserId = isset($args['user_id']) ? $args['user_id'] : null;
        if ($targetUserId) {
            return $user->isAbleTo('update-own-employeeProfile') && $user->id === $targetUserId;
        }

        return false;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, CommunityInterest $communityInterest): bool
    {
        return $user->isAbleTo('update-own-employeeProfile') && $user->id === $communityInterest->user_id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, CommunityInterest $communityInterest): bool
    {
        return $user->isAbleTo('update-own-employeeProfile') && $user->id === $communityInterest->user_id;
    }

    /**
     * Determine whether the user can access user profiles associated with models.
     */
    public function viewUser(User $user, CommunityInterest $communityInterest): bool
    {
        $communityInterest->loadMissing('community.team');

        return ! is_null($communityInterest->community->team)
            && $user->isAbleTo('view-team-communityInterest', $communityInterest->community->team);
    }
}
