<?php

namespace App\Notifications;

use App\Enums\Language;
use App\Enums\NotificationFamily;
use App\Models\User;
use App\Notifications\Messages\GcNotifyEmailMessage;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Carbon;

class ApplicationDeadlineApproaching extends Notification implements CanBeSentViaGcNotifyEmail
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        public Carbon $closingDate,
        public string $poolNameEn,
        public string $poolNameFr,
        public string $poolId,
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
            'closingDate' => $this->closingDate->toDateString(),
            'poolName' => [
                'en' => $this->poolNameEn,
                'fr' => $this->poolNameFr,
            ],
            'poolId' => $this->poolId,
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
            fn () => $this->closingDate->translatedFormat($locale === 'en' ? 'F j, Y' : 'j F Y')
        );

        if (Language::EN->localeMatches($locale)) {
            // English notification
            $message = new GcNotifyEmailMessage(
                config('notify.templates.application_deadline_approaching_en'),
                $notifiable->email,
                [
                    'closing date' => $localizedClosingDateString,
                    'opportunity title' => $this->poolNameEn,
                    'job advertisement link' => config('app.url').'/en/jobs/'.$this->poolId,
                    'application link' => config('app.url').'/en/applications/'.$this->poolCandidateId,
                ]
            );
        } else {
            // French notification
            $message = new GcNotifyEmailMessage(
                config('notify.templates.application_deadline_approaching_fr'),
                $notifiable->email,
                [
                    'closing date' => $localizedClosingDateString,
                    'opportunity title' => $this->poolNameFr,
                    'job advertisement link' => config('app.url').'/fr/jobs/'.$this->poolId,
                    'application link' => config('app.url').'/fr/applications/'.$this->poolCandidateId,
                ]
            );
        }

        return $message;
    }
}
