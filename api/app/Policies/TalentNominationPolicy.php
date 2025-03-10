<?php

namespace App\Policies;

use App\Models\TalentNomination;
use App\Models\TalentNominationEvent;
use App\Models\User;

class TalentNominationPolicy
{
    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, TalentNomination $nomination): bool
    {
        $isOwn = $nomination->isOwn($user);

        if ($isOwn && $user->isAbleTo('view-own-talentNomination')) {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        if ($user->isVerifiedGovEmployee && $user->isAbleTo('create-own-talentNomination')) {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, TalentNomination $nomination): bool
    {
        $isOwn = $nomination->isOwn($user);
        $isDraft = $nomination->isDraft();

        // can only update your own nomination if it is still in draft
        if ($isOwn && $isDraft && $user->isAbleTo('update-own-talentNomination')) {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, TalentNomination $nomination): bool
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
