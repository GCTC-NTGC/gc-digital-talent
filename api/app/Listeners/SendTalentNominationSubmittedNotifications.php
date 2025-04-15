<?php

namespace App\Listeners;

use App\Events\TalentNominationSubmitted;
use App\Models\TalentNomination;
use App\Notifications\GcNotifyEmailChannel;
use App\Notifications\TalentNominationReceivedNominator;
use App\Notifications\TalentNominationReceivedSubmitter;
use Illuminate\Support\Facades\Notification;

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
        $talentNomination->submitter?->notify($submitterNotification);

        if (! is_null($talentNomination->nominator_id)) {
            $this->maybeSendToARealNominator($talentNomination);
        } else {
            $this->maybeSendToAFallbackNominator($talentNomination);
        }
    }

    protected function maybeSendToARealNominator(TalentNomination $talentNomination)
    {
        // only send the nominator email if there's a nominator who's different from the submitter
        if ($talentNomination->submitter_id != $talentNomination->nominator_id) {
            $talentNomination->nominator?->notify(new TalentNominationReceivedNominator($talentNomination));
        }
    }

    protected function maybeSendToAFallbackNominator(TalentNomination $talentNomination)
    {
        $nominatorWorkEmailAddress = $talentNomination->nominator_fallback_work_email;
        $nominatorLocale = $talentNomination->submitter?->preferredLocale() ?? 'en'; // we don't know the nominator's locale so we'll use the same as submitter

        // only send the nominator email if there's a nominator who's different from the submitter
        if (! is_null($nominatorWorkEmailAddress) && $talentNomination->submitter?->work_email != $nominatorWorkEmailAddress) {
            Notification::route(GcNotifyEmailChannel::class, [])
                ->notify((new TalentNominationReceivedNominator($talentNomination))->locale($nominatorLocale));
        }

    }
}
