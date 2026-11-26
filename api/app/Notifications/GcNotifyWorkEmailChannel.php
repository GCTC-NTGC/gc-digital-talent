<?php

namespace App\Notifications;

use App\Models\User;
use App\Notifications\Messages\GcNotifyEmailMessage;

/**
 * Sends a GC Notify email to the notifiable's work email address instead of
 * the address chosen by the notification.
 */
class GcNotifyWorkEmailChannel extends GcNotifyEmailChannel
{
    protected function buildMessage(object $notifiable, CanBeSentViaGcNotifyEmail $notification): ?GcNotifyEmailMessage
    {
        // only a verified work email is sendable
        if (! $notifiable instanceof User || ! $notifiable->has_a_verified_work_email_address) {
            return null;
        }

        $message = parent::buildMessage($notifiable, $notification);
        if (is_null($message)) {
            return null;
        }

        $message->emailAddress = $notifiable->work_email;

        return $message;
    }
}
