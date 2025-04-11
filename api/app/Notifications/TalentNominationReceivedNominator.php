<?php

namespace App\Notifications;

use App\Enums\Language;
use App\Models\TalentNomination;
use App\Models\User;
use App\Notifications\Messages\GcNotifyEmailMessage;
use App\Notifications\Utils\NominationUtils;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

/**
 * A notification sent to the nominator (in case it is different from the submitter) to confirm that the nomination was received
 */
class TalentNominationReceivedNominator extends Notification implements CanBeSentViaGcNotifyEmail
{
    use Queueable;

    protected string $eventNameEn;

    protected string $eventNameFr;

    protected string $nomineeName;

    protected bool $nominateForAdvancement;

    protected bool $nominateForLateralMovement;

    protected bool $nominateForDevelopmentPrograms;

    protected string $submitterName;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        TalentNomination $talentNomination
    ) {
        $this->eventNameEn = $talentNomination->talentNominationEvent->name['en'];
        $this->eventNameFr = $talentNomination->talentNominationEvent->name['fr'];
        $this->nomineeName = $talentNomination->nominee->full_name;
        $this->nominateForAdvancement = $talentNomination->nominate_for_advancement;
        $this->nominateForLateralMovement = $talentNomination->nominate_for_lateral_movement;
        $this->nominateForDevelopmentPrograms = $talentNomination->nominate_for_development_programs;
        $this->submitterName = $talentNomination->submitter->full_name;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(User $notifiable): array
    {
        // Can't ignore system messages
        // $notificationFamily = NotificationFamily::SYSTEM_MESSAGE->name;

        // email-only notification
        return [GcNotifyEmailChannel::class];
    }

    /**
     * Get the GC Notify representation of the notification.
     * $notifiable is the NOMINATOR
     * Always sent to the work email
     */
    public function toGcNotifyEmail(User $notifiable): GcNotifyEmailMessage
    {
        $locale = $this->locale ?? $notifiable->preferredLocale();

        $combinedNominationOptionDescriptions = NominationUtils::combineNominationOptionDescriptions(
            $locale,
            $this->nominateForAdvancement,
            $this->nominateForLateralMovement,
            $this->nominateForDevelopmentPrograms);

        if ($locale == Language::EN->value) {
            // English notification
            $message = new GcNotifyEmailMessage(
                config('notify.templates.nomination_received_nominator_en'),
                $notifiable->work_email,
                [
                    'submitter name' => $this->submitterName,
                    'event name' => $this->eventNameEn,
                    'nominee name' => $this->nomineeName,
                    'selected nomination options' => $combinedNominationOptionDescriptions,
                    'nominator name' => $notifiable->full_name,
                ]
            );
        } else {
            // French notification
            $message = new GcNotifyEmailMessage(
                config('notify.templates.nomination_received_nominator_fr'),
                $notifiable->work_email,
                [
                    'submitter name' => $this->submitterName,
                    'event name' => $this->eventNameFr,
                    'nominee name' => $this->nomineeName,
                    'selected nomination options' => $combinedNominationOptionDescriptions,
                    'nominator name' => $notifiable->full_name,
                ]
            );
        }

        return $message;
    }
}
