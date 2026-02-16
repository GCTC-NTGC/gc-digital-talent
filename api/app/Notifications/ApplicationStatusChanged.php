<?php

namespace App\Notifications;

use App\Enums\Language;
use App\Enums\NotificationFamily;
use App\Models\User;
use App\Notifications\Messages\GcNotifyEmailMessage;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class ApplicationStatusChanged extends Notification implements CanBeSentViaGcNotifyEmail, ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        public string $poolNameEn,
        public string $poolNameFr,
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
            'poolName' => [
                'en' => $this->poolNameEn,
                'fr' => $this->poolNameFr,
            ],
        ];
    }

    /**
     * Get the GC Notify representation of the notification.
     */
    public function toGcNotifyEmail(User $notifiable): GcNotifyEmailMessage
    {
        $locale = $this->locale ?? $notifiable->preferredLocale();

        if (Language::EN->localeMatches($locale)) {
            // English notification
            $message = new GcNotifyEmailMessage(
                config('notify.templates.application_status_changed_en'),
                $notifiable->email,
                [
                    'applicant name' => $notifiable->first_name,
                    'opportunity title' => $this->poolNameEn,
                ]
            );
        } else {
            // French notification
            $message = new GcNotifyEmailMessage(
                config('notify.templates.application_status_changed_fr'),
                $notifiable->email,
                [
                    'applicant name' => $notifiable->first_name,
                    'opportunity title' => $this->poolNameFr,
                ]
            );
        }

        return $message;
    }
}
