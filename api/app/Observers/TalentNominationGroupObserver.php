<?php

namespace App\Observers;

use App\Enums\TalentNominationGroupDecision;
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
        // if advancement decision changes to approved then record the classification
        if ($talentNominationGroup->getOriginal('advancement_decision') !== TalentNominationGroupDecision::APPROVED->name &&
            $talentNominationGroup->advancement_decision === TalentNominationGroupDecision::APPROVED->name) {
            $talentNominationGroup->loadMissing('nominee');
            $talentNominationGroup->classificationAtTimeOfAdvancementApproval()->associate($talentNominationGroup->nominee->currentClassification);
        }

        // if advancement decision changes from approved then clear the classification
        if ($talentNominationGroup->getOriginal('advancement_decision') === TalentNominationGroupDecision::APPROVED->name &&
           $talentNominationGroup->advancement_decision !== TalentNominationGroupDecision::APPROVED->name) {
            $talentNominationGroup->classificationAtTimeOfAdvancementApproval()->dissociate();
        }

        $talentNominationGroup->saveQuietly();

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
