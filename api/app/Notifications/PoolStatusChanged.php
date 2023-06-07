<?php

namespace App\Notifications;

use Exception;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PoolStatusChanged extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        public string $new_status,
        public string $pool_name,

    ) {
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database', GcNotifyEmailChannel::class];
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
            'user_name' => trim($notifiable->first_name . " " . $notifiable->last_name),
            'new_status' => $this->new_status,
            'pool_name' => $this->pool_name,
        ];
    }

    /**
     * Get the array representation of the notification.
     * https://laravel.com/docs/10.x/notifications#formatting-database-notifications
     *
     * @return array<string, mixed>
     */
    public function toGcNotifyEmail(object $notifiable): array
    {
        return [
            'template_id' => '959f6a2a-1e02-47c9-b4c9-9680b49accf7',
            'email_address' => $notifiable->email,
            'message_variables' => [
                'user_name' => trim($notifiable->first_name . " " . $notifiable->last_name),
                'new_status' => $this->new_status,
                'pool_name' => $this->pool_name,
            ]
        ];
    }
}
