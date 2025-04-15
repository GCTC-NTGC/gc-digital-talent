<?php

namespace App\Listeners;

use App\Events\TalentNominationSubmitted;
use App\Notifications\TalentNominationReceivedNominator;
use App\Notifications\TalentNominationReceivedSubmitter;

class SendTalentNominationSubmittedNotifications
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(TalentNominationSubmitted $event): void
    {
        $talentNomination = $event->talentNomination;
        $talentNomination->loadMissing(['submitter', 'nominator']);

        $submitterNotification = new TalentNominationReceivedSubmitter($talentNomination);
        $talentNomination->submitter->notify($submitterNotification);

        // only send the nominator email if there's a nominator who's different from the submitter
        // TODO: check in case nominator is null
        if ($talentNomination->submitter->id != $talentNomination->nominator?->id && ! is_null($talentNomination->nominator_id)) {
            $nominatorNotification = new TalentNominationReceivedNominator(
                $talentNomination
            );
            $talentNomination->nominator->notify($nominatorNotification);
        }

    }
}
