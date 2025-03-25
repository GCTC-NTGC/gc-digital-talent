<?php

namespace App\Observers;

use App\Models\TalentNominationGroup;

class TalentNominationGroupObserver
{
    /**
     * Handle the TalentNominationGroup "created" event.
     */
    public function created(TalentNominationGroup $talentNominationGroup): void
    {
        TalentNominationGroup::withoutEvents(function () use ($talentNominationGroup) {
            $talentNominationGroup->updateStatus();
        });
    }

    /**
     * Handle the TalentNominationGroup "updated" event.
     */
    public function updated(TalentNominationGroup $talentNominationGroup): void
    {
        TalentNominationGroup::withoutEvents(function () use ($talentNominationGroup) {
            $talentNominationGroup->updateStatus();
        });
    }

    /**
     * Handle the TalentNominationGroup "deleted" event.
     */
    public function deleted(TalentNominationGroup $talentNominationGroup): void
    {
        //
    }

    /**
     * Handle the TalentNominationGroup "restored" event.
     */
    public function restored(TalentNominationGroup $talentNominationGroup): void
    {
        //
    }

    /**
     * Handle the TalentNominationGroup "force deleted" event.
     */
    public function forceDeleted(TalentNominationGroup $talentNominationGroup): void
    {
        //
    }
}
