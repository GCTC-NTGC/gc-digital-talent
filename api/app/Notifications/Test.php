<?php

namespace App\Notifications;

use App\Models\User;
use App\Notifications\Messages\GcNotifyEmailMessage;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class Test extends Notification implements CanBeSentViaGcNotifyEmail
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        public string $name,
        public string $channel
    ) {}

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(User $notifiable): array
    {
        return [$this->channel];
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
            'name' => $this->name,
        ];
    }

    /**
     * Get the GC Notify representation of the notification.
     */
    public function toGcNotifyEmail(User $notifiable): GcNotifyEmailMessage
    {
        $message = new GcNotifyEmailMessage(
            config('notify.templates.test_email'),
            $notifiable->email,
            [
                'name' => $this->name,
            ]
        );

        return $message;
    }
}
