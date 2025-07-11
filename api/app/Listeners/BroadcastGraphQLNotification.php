<?php

namespace App\Listeners;

use Illuminate\Notifications\Events\NotificationSent;
use Nuwave\Lighthouse\Execution\Utils\Subscription;

class BroadcastGraphQLNotification
{
    public function handle(NotificationSent $event)
    {
        $notifiable = $event->notifiable;
        /** @var \Illuminate\Notifications\Notification $notification; */
        $notification = $event->notification;

        $message = '';
        if (method_exists($notification, 'toArray')) {
            $message = $notification->toArray($notifiable);
        }

        $data = [
            'id' => $event->notification->id ?? null,
            'message' => $message,
            'user_id' => $notifiable->id,
        ];

        Subscription::broadcast('notificationSent', $data);
    }
}
