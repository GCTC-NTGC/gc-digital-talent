<?php

namespace App\Listeners;

use App\Models\User;
use Illuminate\Notifications\Events\NotificationSent;
use Nuwave\Lighthouse\Execution\Utils\Subscription;

/**
 * @phpstan-import-type NotificationArray from \Illuminate\Notifications\Notification
 */
class BroadcastGraphQLNotification
{
    /**
     * Handle the event.
     *
     * @return void
     */
    public function handle(NotificationSent $event)
    {
        /** @var mixed $notifiable */
        $notifiable = $event->notifiable;

        if (! $notifiable instanceof User) {
            return;
        }

        $user = $notifiable;

        if (! isset($user->id)) {
            return;
        }

        /** @var \Illuminate\Notifications\Notification $notification */
        $notification = $event->notification;

        $payload = (object) [
            'id' => $notification->id,
            'user_id' => $user->id,
            'type' => class_basename($notification),
            'data' => $notification->toArray($user),
        ];

        Subscription::broadcast('notificationSent', $payload);
    }
}
