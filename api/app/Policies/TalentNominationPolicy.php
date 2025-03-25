<?php

namespace App\Policies;

use App\Models\TalentNomination;
use App\Models\Team;
use App\Models\User;

class TalentNominationPolicy
{
    /**
     * Determine whether the user can view the model.
     */
    public function view(User $actor, TalentNomination $talentNomination): bool
    {
        // can view if the nomination is their own
        $isOwn = $talentNomination->isOwn($actor);
        if ($isOwn && $actor->isAbleTo('view-own-talentNomination')) {
            return true;
        }

        // can view if the nomination is submitted and is for an event in their community
        $isDraft = $talentNomination->isDraft();
        $talentNomination->loadMissing('talentNominationEvent');
        $communityTeam = Team::with(['teamable.team'])
            ->where('teamable_type', 'App\Models\Community')
            ->where('teamable_id', $talentNomination->talentNominationEvent->community_id)
            ->first();
        if (! $isDraft && $actor->isAbleTo('view-team-talentNominationGroup', $communityTeam)) {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $actor): bool
    {
        if ($actor->isVerifiedGovEmployee && $actor->isAbleTo('create-own-talentNomination')) {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $actor, TalentNomination $talentNomination): bool
    {
        $isOwn = $talentNomination->isOwn($actor);
        $isDraft = $talentNomination->isDraft();

        // can only update your own nomination if it is still in draft
        if ($isOwn && $isDraft && $actor->isAbleTo('update-own-talentNomination')) {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $actor, TalentNomination $talentNomination): bool
    {
        return false;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $actor, TalentNomination $talentNomination): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $actor, TalentNomination $talentNomination): bool
    {
        return false;
    }
}
