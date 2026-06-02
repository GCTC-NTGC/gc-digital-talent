<?php

namespace App\Notifications;

use App\Contracts\SubscriptionNotification;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class UserFileGenerated extends Notification implements SubscriptionNotification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(public string $fileName) {}

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(User $notifiable): array
    {
        return ['database'];
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(User $notifiable): array
    {
        return [
            'fileName' => $this->fileName,
        ];
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toSubscriptionArray(User $user): array
    {
        return $this->toArray($user);
    }
}
