<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class PoolCandidateStatusChanged extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        public string | null $old_status,
        public string | null $new_status,
        public string $pool_id,
        public array $pool_name,
    ) {
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'old_status' => $this->old_status,
            'new_status' => $this->new_status,
            'pool_id' => $this->pool_id,
            'pool_name' => $this->pool_name,
        ];
    }
}
