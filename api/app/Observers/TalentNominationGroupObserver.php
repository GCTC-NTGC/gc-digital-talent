<?php

namespace App\Observers;

use App\Enums\TalentNominationGroupDecision;
use App\Models\TalentNominationGroup;
use App\Models\User;

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
            // nominee() excludes archived users by default; look up directly with
            // withTrashed() so approving a decision never fails just because the
            // nominee has since been archived
            $nominee = User::withTrashed()->find($talentNominationGroup->nominee_id);
            $talentNominationGroup->classificationAtTimeOfLastApproval()->associate($nominee?->currentClassification);
        }

        // if advancement decision changes from approved then clear the classification
        if ($talentNominationGroup->getOriginal('advancement_decision') === TalentNominationGroupDecision::APPROVED->name &&
           $talentNominationGroup->advancement_decision !== TalentNominationGroupDecision::APPROVED->name) {
            $talentNominationGroup->classificationAtTimeOfLastApproval()->dissociate();
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
