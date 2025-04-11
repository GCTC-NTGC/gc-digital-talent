<?php

namespace App\Notifications;

use App\Enums\Language;
use App\Enums\NotificationFamily;
use App\Models\User;
use App\Notifications\Messages\GcNotifyEmailMessage;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Lang;
use Illuminate\Support\Str;

class TalentNominationReceivedSubmitter extends Notification implements CanBeSentViaGcNotifyEmail
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
        public string $nominatorName,
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
     */
    public function toGcNotifyEmail(User $notifiable): GcNotifyEmailMessage
    {
        $locale = $this->locale ?? $notifiable->preferredLocale();
        $nominationOptionDescriptions = collect([]);
        if ($this->nominateForAdvancement) {
            $nominationOptionDescriptions->push(Lang::get('talent_nomination_option.advancement', [], $locale));
        }
        if ($this->nominateForLateralMovement) {
            $nominationOptionDescriptions->push(Lang::get('talent_nomination_option.lateral_movement', [], $locale));
        }
        if ($this->nominateForDevelopmentPrograms) {
            $nominationOptionDescriptions->push(Lang::get('talent_nomination_option.development_programs', [], $locale));
        }

        $combinedNominationOptionDescriptions = match ($nominationOptionDescriptions->count()) {
            0 => Lang::get('common.not_provided', [], $locale),
            1 => $nominationOptionDescriptions->sole(),
            2 => $nominationOptionDescriptions->join(Lang::get('join.and_list', [], $locale)),
            default => $nominationOptionDescriptions->join(', ', Lang::get('join.last_item_in_comma_list')),
        };

        if ($locale == Language::EN->value) {
            // English notification
            $message = new GcNotifyEmailMessage(
                config('notify.templates.nomination_received_submitter_en'),
                $notifiable->email,
                [
                    'submitter name' => $notifiable->full_name,
                    'event name' => $this->eventNameEn,
                    'nominee name' => $this->nomineeName,
                    'selected nomination options' => $combinedNominationOptionDescriptions,
                    'nominator name' => $this->nominatorName,
                ]
            );
        } else {
            // French notification
            $message = new GcNotifyEmailMessage(
                config('notify.templates.nomination_received_submitter_fr'),
                $notifiable->email,
                [
                    'submitter name' => Str::trim($notifiable->first_name.' '.$notifiable->last_name),
                    'event name' => $this->eventNameFr,
                    'nominee name' => $this->nomineeName,
                    'selected nomination options' => $combinedNominationOptionDescriptions,
                    'nominator name' => $this->nominatorName,
                ]
            );
        }

        return $message;
    }
}
