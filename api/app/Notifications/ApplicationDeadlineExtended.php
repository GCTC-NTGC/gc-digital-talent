<?php

namespace App\Notifications;

use App\Enums\Language;
use App\Enums\NotificationFamily;
use App\Models\User;
use App\Notifications\Messages\GcNotifyEmailMessage;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Carbon;

class ApplicationDeadlineExtended extends Notification implements CanBeSentViaGcNotifyEmail
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        public string $userName,
        public Carbon $closingDate,
        public string $poolNameEn,
        public string $poolNameFr,
        public string $poolCandidateId,
    ) {}

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(User $notifiable): array
    {
        $notificationFamily = NotificationFamily::APPLICATION_UPDATE->name;
        $enabledChannels = [];

        if (in_array($notificationFamily, $notifiable->enabled_email_notifications ?? [])) {
            array_push($enabledChannels, GcNotifyEmailChannel::class);
        }

        if (in_array($notificationFamily, $notifiable->enabled_in_app_notifications ?? [])) {
            array_push($enabledChannels, 'database');
        }

        return $enabledChannels;
    }

    /**
     * Get the array representation of the notification.
     * https://laravel.com/docs/10.x/notifications#formatting-database-notifications
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'userName' => $this->userName,
            'closingDate' => $this->closingDate->setTimezone('America/Vancouver')->toDateString(),
            'poolName' => [
                'en' => $this->poolNameEn,
                'fr' => $this->poolNameFr,
            ],
            'poolCandidateId' => $this->poolCandidateId,
        ];
    }

    /**
     * Get the GC Notify representation of the notification.
     */
    public function toGcNotifyEmail(User $notifiable): GcNotifyEmailMessage
    {
        $locale = $this->locale ?? $notifiable->preferredLocale();
        $localizedClosingDateString = Carbon::executeWithLocale($locale,
            fn () => $this->closingDate->setTimezone('America/Vancouver')->translatedFormat($locale === 'en' ? 'F j, Y' : 'j F Y')
        );

        if (Language::EN->localeMatches($locale)) {
            // English notification
            $message = new GcNotifyEmailMessage(
                config('notify.templates.application_deadline_extended_en'),
                $notifiable->email,
                [
                    'user name' => $this->userName,
                    'opportunity title' => $this->poolNameEn,
                    'closing date' => $localizedClosingDateString,
                    'application link' => config('app.url').'/en/applications/'.$this->poolCandidateId,
                ]
            );
        } else {
            // French notification
            $message = new GcNotifyEmailMessage(
                config('notify.templates.application_deadline_extended_fr'),
                $notifiable->email,
                [
                    'user name' => $this->userName,
                    'opportunity title' => $this->poolNameFr,
                    'closing date' => $localizedClosingDateString,
                    'application link' => config('app.url').'/fr/applications/'.$this->poolCandidateId,
                ]
            );
        }

        return $message;
    }
}
