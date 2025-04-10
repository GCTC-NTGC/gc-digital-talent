<?php

namespace App\Listeners;

use App\Events\TalentNominationSubmitted;
use App\Notifications\NominationReceivedSubmitter;

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
        $talentNominationEvent = $event->talentNomination->talentNominationEvent;

        $submitterNotification = new NominationReceivedSubmitter(
            $talentNominationEvent->name->en,
            $talentNominationEvent->name->fr,
            $event->talentNomination->nominee->full_name,
            $event->talentNomination->nominate_for_advancement,
            $event->talentNomination->nominate_for_lateral_movement,
            $event->talentNomination->nominate_for_development_programs,
            $event->talentNomination->nominator->full_name
        );
        $event->talentNomination->submitter->notify($submitterNotification);

        // only send the nominator email if there's a nominator who's different from the submitter
        // if($event->talentNomination->submitter->id != $event->talentNomination->nominator->id)
        // {
        // TODO
        // }

    }
}
