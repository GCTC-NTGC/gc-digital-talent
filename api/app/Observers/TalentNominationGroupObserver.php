<?php

namespace App\Observers;

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
        $advancementDecisionChanged = $talentNominationGroup->getOriginal('advancement_decision') !== $talentNominationGroup->advancement_decision;
        $lateralMovementDecisionChanged = $talentNominationGroup->getOriginal('lateral_movement_decision') !== $talentNominationGroup->lateral_movement_decision;
        $developmentProgramsDecisionChanged = $talentNominationGroup->getOriginal('development_programs_decision') !== $talentNominationGroup->development_programs_decision;

        $decisionsChanged = collect([$advancementDecisionChanged, $lateralMovementDecisionChanged, $developmentProgramsDecisionChanged]);

        // if any decision changes to approved then record the classification
        if ($decisionsChanged->contains(true)) {
            // nominee() excludes archived users by default; look up directly with
            // withTrashed() so approving a decision never fails just because the
            // nominee has since been archived
            $nominee = User::withTrashed()->find($talentNominationGroup->nominee_id);
            $talentNominationGroup->classificationAtTimeOfLastApproval()->associate($nominee?->currentClassification);
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
