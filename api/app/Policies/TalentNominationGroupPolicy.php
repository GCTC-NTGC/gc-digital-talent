<?php

namespace App\Policies;

use App\Models\TalentNominationGroup;
use App\Models\Team;
use App\Models\User;

class TalentNominationGroupPolicy
{
    /**
     * Determine whether the user can view the model.
     */
    public function view(User $actor, TalentNominationGroup $talentNominationGroup): bool
    {
        $talentNominationGroup->loadMissing('talentNominationEvent');
        $communityTeam = Team::with(['teamable.team'])
            ->where('teamable_type', 'App\Models\Community')
            ->where('teamable_id', $talentNominationGroup->talentNominationEvent->community_id)
            ->first();

        if ($actor->isAbleTo('view-team-talentNominationGroup', $communityTeam)) {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $actor): bool
    {
        return false;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $actor, TalentNominationGroup $talentNominationGroup): bool
    {
        $talentNominationGroup->loadMissing('talentNominationEvent');
        $communityTeam = Team::with(['teamable.team'])
            ->where('teamable_type', 'App\Models\Community')
            ->where('teamable_id', $talentNominationGroup->talentNominationEvent->community_id)
            ->first();

        if ($actor->isAbleTo('update-team-talentNominationGroup', $communityTeam)) {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $actor, TalentNominationGroup $talentNominationGroup): bool
    {
        return false;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $actor, TalentNominationGroup $talentNominationGroup): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $actor, TalentNominationGroup $talentNominationGroup): bool
    {
        return false;
    }
}
