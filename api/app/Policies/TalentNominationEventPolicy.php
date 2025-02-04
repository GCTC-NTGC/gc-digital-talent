<?php

namespace App\Policies;

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
    public function create(User $user): bool
    {
        return $user->isAbleTo('create-any-talentNominationEvent');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, TalentNominationEvent $talentNominationEvent): bool
    {
        $talentNominationEvent->loadMissing(['community']);

        return $user->isAbleTo('update-team-talentNominationEvent', $talentNominationEvent->community);
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
