<?php

namespace App\Notifications;

use App\Notifications\Messages\GcNotifyEmailMessage;

/**
 * Sends a GC Notify email to the notifiable's work email address instead of
 * the address chosen by the notification.
 */
class GcNotifyWorkEmailChannel extends GcNotifyEmailChannel
{
    /**
     * Route key used to look up the work email address on the notifiable
     * (resolves to User::routeNotificationForGcNotifyWorkEmail).
     */
    public const ROUTE = 'gcNotifyWorkEmail';

    protected function buildMessage(object $notifiable, CanBeSentViaGcNotifyEmail $notification): ?GcNotifyEmailMessage
    {
        $address = method_exists($notifiable, 'routeNotificationFor')
            ? $notifiable->routeNotificationFor(self::ROUTE, $notification)
            : null;

        if (! is_string($address) || $address === '') {
            return null;
        }

        $message = parent::buildMessage($notifiable, $notification);
        if (is_null($message)) {
            return null;
        }

        $message->emailAddress = $address;

        return $message;
    }
}
