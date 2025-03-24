<?php

namespace App\Notifications;

use App\Jobs\GcNotifyApiRequest;
use Illuminate\Support\Facades\Log;

class GcNotifyEmailChannel
{
    /**
     * Send the given notification.
     */
    public function send(object $notifiable, CanBeSentViaGcNotifyEmail $notification): void
    {
        $message = $notification->toGcNotifyEmail($notifiable);
        if (! config('notify.client.apiKey')) {
            $errorMessage = 'GC Notify API key is missing.';
            Log::error($errorMessage);
            throw new \Exception($errorMessage);
        } elseif (! $message->templateId) {
            $errorMessage = 'GC Notify Template ID is missing.';
            Log::error($errorMessage);
            throw new \Exception($errorMessage);
        } else {
            GcNotifyApiRequest::dispatch($message);
        }
    }
}
