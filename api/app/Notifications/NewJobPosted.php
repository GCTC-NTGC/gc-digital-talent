<?php

namespace App\Notifications;

use App\Enums\Language;
use App\Enums\NotificationFamily;
use App\Models\User;
use App\Notifications\Messages\GcNotifyEmailMessage;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class NewJobPosted extends Notification implements CanBeSentViaGcNotifyEmail
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        public string $poolNameEn,
        public string $poolNameFr,
        public string $poolId,
    ) {}

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(User $notifiable): array
    {
        $notificationFamily = NotificationFamily::JOB_ALERT->name;
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
            'poolId' => $this->poolId,
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
                config('notify.templates.new_job_posted_en'),
                $notifiable->email,
                [
                    'applicant name' => $notifiable->first_name,
                    'opportunity title' => $this->poolNameEn,
                    'job advertisement link' => config('app.url').'/en/jobs/'.$this->poolId,
                ]
            );
        } else {
            // French notification
            $message = new GcNotifyEmailMessage(
                config('notify.templates.new_job_posted_fr'),
                $notifiable->email,
                [
                    'applicant name' => $notifiable->first_name,
                    'opportunity title' => $this->poolNameFr,
                    'job advertisement link' => config('app.url').'/fr/jobs/'.$this->poolId,
                ]
            );
        }

        return $message;
    }
}
