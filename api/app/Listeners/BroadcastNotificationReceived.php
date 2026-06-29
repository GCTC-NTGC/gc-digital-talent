<?php

namespace App\Listeners;

use App\Contracts\SubscriptionNotification;
use App\Models\User;
use Illuminate\Notifications\Events\NotificationSent;
use Illuminate\Notifications\Notification;
use Nuwave\Lighthouse\Execution\Utils\Subscription;

class BroadcastNotificationReceived
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

        /** @var Notification $notification */
        $notification = $event->notification;

        if (! $notification instanceof SubscriptionNotification) {
            return;
        }

        if (! isset($notifiable->id)) {
            return;
        }

        $payload = (object) [
            'id' => $notification->id,
            'user_id' => $notifiable->id,
            'type' => class_basename($notification),
            'data' => $notification->toSubscriptionArray($notifiable),
        ];

        Subscription::broadcast('notificationReceived', $payload);
    }
}
