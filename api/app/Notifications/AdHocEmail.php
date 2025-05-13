<?php

namespace App\Notifications;

use App\Enums\Language;
use App\Models\User;
use App\Notifications\Messages\GcNotifyEmailMessage;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class AdHocEmail extends Notification implements CanBeSentViaGcNotifyEmail
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        public string $templateIdEn,
        public string $templateIdFr,
    ) {}

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(): array
    {
        return [GcNotifyEmailChannel::class];
    }

    /**
     * Get the GC Notify representation of the notification.
     */
    public function toGcNotifyEmail(User $notifiable): GcNotifyEmailMessage
    {
        $locale = $this->locale ?? $notifiable->preferredLocale();
        $templateId = match ($locale) {
            Language::EN->toLower() => $this->templateIdEn,
            Language::FR->toLower() => $this->templateIdFr,
            default => throw new \InvalidArgumentException("Unsupported locale: $locale"),
        };

        $message = new GcNotifyEmailMessage(
            $templateId,
            $notifiable->email,
            [
                'first_name' => $notifiable->first_name,
                'last_name' => $notifiable->last_name,
            ]
        );

        return $message;
    }
}
