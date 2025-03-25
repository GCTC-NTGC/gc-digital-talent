<?php

namespace App\Observers;

use App\Models\TalentNomination;
use App\Models\TalentNominationGroup;

class TalentNominationObserver
{
    /**
     * Handle the TalentNomination "created" event.
     */
    public function created(TalentNomination $talentNomination): void
    {
        TalentNomination::withoutEvents(function () use ($talentNomination) {
            $talentNomination->connectToTalentNominationGroupIfMissing();
        });
        TalentNominationGroup::withoutEvents(function () use ($talentNomination) {
            $talentNomination->talentNominationGroup?->updateStatus();
        });

    }

    /**
     * Handle the TalentNomination "updated" event.
     */
    public function updated(TalentNomination $talentNomination): void
    {
        TalentNomination::withoutEvents(function () use ($talentNomination) {
            $talentNomination->connectToTalentNominationGroupIfMissing();
        });
        TalentNominationGroup::withoutEvents(function () use ($talentNomination) {
            $talentNomination->talentNominationGroup?->updateStatus();
        });
    }

    /**
     * Handle the TalentNomination "deleted" event.
     */
    public function deleted(TalentNomination $talentNomination): void
    {
        //
    }

    /**
     * Handle the TalentNomination "restored" event.
     */
    public function restored(TalentNomination $talentNomination): void
    {
        //
    }

    /**
     * Handle the TalentNomination "force deleted" event.
     */
    public function forceDeleted(TalentNomination $talentNomination): void
    {
        //
    }
}
