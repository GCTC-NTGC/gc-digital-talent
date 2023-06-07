<?php

namespace App\Notifications;

use Illuminate\Notifications\Notification;
use App\Facades\Notify;

class GcNotifyEmailChannel
{
    /**
     * Send the given notification.
     */
    public function send(object $notifiable, Notification $notification): void
    {
        $emailDefinition = $notification->toGcNotifyEmail($notifiable);

        $response = Notify::sendEmail(
            $emailDefinition["email_address"],
            $emailDefinition["template_id"],
            $emailDefinition["message_variables"],
        );

        throw_if(!$response->successful(), 'Notification failed to send');
    }
}
