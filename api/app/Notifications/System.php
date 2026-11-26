<?php

namespace App\Notifications;

use App\Contracts\LowPriorityJob;
use App\Enums\Language;
use App\Enums\NotificationFamily;
use App\Models\User;
use App\Notifications\Concerns\HasNotificationFamilyChannels;
use App\Notifications\Messages\GcNotifyEmailMessage;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\View;

class System extends Notification implements CanBeSentViaGcNotifyEmail, LowPriorityJob
{
    use HasNotificationFamilyChannels;
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        public bool $channelEmail,
        public bool $channelApp,
        public string $emailSubjectEn,
        public string $emailSubjectFr,
        public string $emailContentEn,
        public string $emailContentFr,
        public string $inAppMessageEn,
        public string $inAppMessageFr,
        public string $inAppHrefEn,
        public string $inAppHrefFr,
    ) {}

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(User $notifiable): array
    {
        // System messages can't be ignored for contact email or in-app, but the
        // work email copy is opt-in.
        $enabledChannels = $this->channelsForFamily($notifiable, NotificationFamily::SYSTEM_MESSAGE);

        // the channels requested for this message command
        $requestedChannels = [];
        if ($this->channelApp) {
            $requestedChannels[] = 'database';
        }
        if ($this->channelEmail) {
            $requestedChannels[] = GcNotifyEmailChannel::class;
            $requestedChannels[] = GcNotifyWorkEmailChannel::class;
        }

        return array_values(array_intersect($enabledChannels, $requestedChannels));
    }

    /**
     * Get the array representation of the notification.
     * https://laravel.com/docs/11.x/notifications#formatting-database-notifications
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'message' => [
                'en' => View::make($this->inAppMessageEn, ['user' => $notifiable])->render(),
                'fr' => View::make($this->inAppMessageFr, ['user' => $notifiable])->render(),
            ],
            'href' => [
                'en' => trim(View::make($this->inAppHrefEn, ['user' => $notifiable])->render()),
                'fr' => trim(View::make($this->inAppHrefFr, ['user' => $notifiable])->render()),
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
                config('notify.templates.system_notification_en'),
                $notifiable->email,
                [
                    'message subject' => trim(View::make($this->emailSubjectEn, ['user' => $notifiable])->render()),
                    'message content' => View::make($this->emailContentEn, ['user' => $notifiable])->render(),
                ]
            );
        } else {
            // French notification
            $message = new GcNotifyEmailMessage(
                config('notify.templates.system_notification_fr'),
                $notifiable->email,
                [
                    'message subject' => trim(View::make($this->emailSubjectFr, ['user' => $notifiable])->render()),
                    'message content' => View::make($this->emailContentFr, ['user' => $notifiable])->render(),
                ]
            );
        }

        return $message;
    }
}
