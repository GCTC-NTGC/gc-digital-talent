<?php

namespace App\Notifications;

use App\Enums\Language;
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

    /**
     * Create a new notification instance.
     */
    public function __construct(
        public string $eventNameEn,
        public string $eventNameFr,
        public string $nomineeName,
        public bool $nominateForAdvancement,
        public bool $nominateForLateralMovement,
        public bool $nominateForDevelopmentPrograms,
        public string $submitterName,
    ) {}

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
                $notifiable->email,
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
                $notifiable->email,
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
