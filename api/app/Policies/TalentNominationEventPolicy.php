<?php

namespace App\Policies;

use App\Models\Community;
use App\Models\TalentNominationEvent;
use App\Models\User;

class TalentNominationEventPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, TalentNominationEvent $talentNominationEvent): bool
    {
        return true;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user, mixed $request): bool
    {
        if ($user->isAbleTo('create-any-talentNominationEvent')) {
            return true;
        }

        $communityId = (isset($request['community']) && isset($request['community']['connect'])) ?
            $request['community']['connect'] : null;

        if (! is_null($communityId)) {
            $community = Community::with('team')->findOrFail($communityId);

            return $user->isAbleTo('create-team-talentNominationEvent', $community->team);
        }

        // fall through
        return false;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, TalentNominationEvent $talentNominationEvent): bool
    {
        $talentNominationEvent->loadMissing(['community.team']);

        return $user->isAbleTo('update-team-talentNominationEvent', $talentNominationEvent->community->team);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, TalentNominationEvent $talentNominationEvent): bool
    {
        return false;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, TalentNominationEvent $talentNominationEvent): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, TalentNominationEvent $talentNominationEvent): bool
    {
        return false;
    }
}
