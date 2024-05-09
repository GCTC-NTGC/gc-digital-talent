<?php

namespace App\Notifications;

use App\Facades\Notify;
use Error;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Log;

class GcNotifyEmailChannel
{
    /**
     * Send the given notification.
     */
    public function send(object $notifiable, CanBeSentViaGcNotifyEmail $notification): void
    {
        $message = $notification->toGcNotifyEmail($notifiable);

        $response = Notify::sendEmail(
            $message->emailAddress,
            $message->templateId,
            $message->messageVariables
        );

        if (! $response->successful()) {
            $firstApiErrorMessage = Arr::get($response->json(), 'errors.0.message');
            $errorMessage = 'Notification failed to send on GcNotifyEmailChannel. '.$firstApiErrorMessage.' ';
            Log::error($errorMessage);
            Log::debug($response->body());
            throw new Error($errorMessage);
        }
    }
}
