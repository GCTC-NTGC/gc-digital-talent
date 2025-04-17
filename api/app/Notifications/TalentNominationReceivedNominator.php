<?php

namespace App\Notifications;

use App\Enums\Language;
use App\Models\TalentNomination;
use App\Models\User;
use App\Notifications\Messages\GcNotifyEmailMessage;
use App\Notifications\Utils\NominationUtils;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\AnonymousNotifiable;
use Illuminate\Notifications\Notification;

/**
 * A notification sent to the nominator (in case it is different from the submitter) to confirm that the nomination was received
 */
class TalentNominationReceivedNominator extends Notification implements CanBeSentViaGcNotifyEmail
{
    use Queueable;

    public ?string $eventNameEn;

    public ?string $eventNameFr;

    public ?string $submitterName;

    public ?string $nominatorName;

    public ?string $nominatorWorkEmail;

    public ?string $nomineeName;

    public bool $nominateForAdvancement;

    public bool $nominateForLateralMovement;

    public bool $nominateForDevelopmentPrograms;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        TalentNomination $talentNomination
    ) {
        $talentNomination->loadMissing(['talentNominationEvent', 'submitter', 'nominator', 'nominee']);

        $this->eventNameEn = $talentNomination->talentNominationEvent?->name['en'];
        $this->eventNameFr = $talentNomination->talentNominationEvent?->name['fr'];
        $this->submitterName = $talentNomination->submitter?->full_name;
        $this->nominatorName = ! is_null($talentNomination->nominator_id)
            ? $talentNomination->nominator?->full_name
            : $talentNomination->nominator_fallback_name;
        $this->nominatorWorkEmail = ! is_null($talentNomination->nominator_id)
            ? $talentNomination->nominator?->work_email
            : $talentNomination->nominator_fallback_work_email;
        $this->nomineeName = $talentNomination->nominee?->full_name;
        $this->nominateForAdvancement = $talentNomination->nominate_for_advancement;
        $this->nominateForLateralMovement = $talentNomination->nominate_for_lateral_movement;
        $this->nominateForDevelopmentPrograms = $talentNomination->nominate_for_development_programs;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(User|AnonymousNotifiable $notifiable): array
    {
        // Can't ignore system messages
        // $notificationFamily = NotificationFamily::SYSTEM_MESSAGE->name;

        // email-only notification
        return [GcNotifyEmailChannel::class];
    }

    /**
     * Get the GC Notify representation of the notification.
     * Always sent to the work email
     */
    public function toGcNotifyEmail(User|AnonymousNotifiable $notifiable): GcNotifyEmailMessage
    {
        $locale = match (get_class($notifiable)) {
            User::class => $this->locale ?? $notifiable->preferredLocale(),
            default => $this->locale ?? 'en', // hopefully the locale of the notification was manually set when instantiated
        };

        $recipientName = match (get_class($notifiable)) {
            User::class => $notifiable->full_name,
            default => $this->nominatorName, // we don't know exactly who it will be sent to, so guess the nominator
        };

        $recipientEmailAddress = match (get_class($notifiable)) {
            User::class => $notifiable->work_email,
            default => $this->nominatorWorkEmail, // we don't know exactly who it will be sent to, so guess the nominator
        };

        $combinedNominationOptionDescriptions = NominationUtils::combineNominationOptionDescriptions(
            $locale,
            $this->nominateForAdvancement,
            $this->nominateForLateralMovement,
            $this->nominateForDevelopmentPrograms);

        if ($locale == Language::EN->value) {
            // English notification
            $message = new GcNotifyEmailMessage(
                config('notify.templates.nomination_received_nominator_en'),
                $recipientEmailAddress,
                [
                    'recipient name' => $recipientName,
                    'submitter name' => $this->submitterName,
                    'nominator name' => $this->nominatorName,
                    'nominee name' => $this->nomineeName,
                    'event name' => $this->eventNameEn,
                    'selected nomination options' => $combinedNominationOptionDescriptions,
                ]
            );
        } else {
            // French notification
            $message = new GcNotifyEmailMessage(
                config('notify.templates.nomination_received_nominator_fr'),
                $recipientEmailAddress,
                [
                    'recipient name' => $recipientName,
                    'submitter name' => $this->submitterName,
                    'nominator name' => $this->nominatorName,
                    'nominee name' => $this->nomineeName,
                    'event name' => $this->eventNameFr,
                    'selected nomination options' => $combinedNominationOptionDescriptions,
                ]
            );
        }

        return $message;
    }
}
