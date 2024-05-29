<?php

namespace App\Notifications;

use App\Jobs\GcNotifyApiRequest;

class GcNotifyEmailChannel
{
    /**
     * Send the given notification.
     */
    public function send(object $notifiable, CanBeSentViaGcNotifyEmail $notification): void
    {
        $message = $notification->toGcNotifyEmail($notifiable);

        GcNotifyApiRequest::dispatch($message);
    }
}
