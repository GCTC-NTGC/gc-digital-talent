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
        $submitterNotification = new TalentNominationReceivedSubmitter(
            $event->talentNomination
        );
        $event->talentNomination->submitter->notify($submitterNotification);

        // only send the nominator email if there's a nominator who's different from the submitter
        if ($event->talentNomination->submitter->id != $event->talentNomination->nominator->id) {
            $nominatorNotification = new TalentNominationReceivedNominator(
                $event->talentNomination
            );
            $event->talentNomination->nominator->notify($nominatorNotification);
        }

    }
}
