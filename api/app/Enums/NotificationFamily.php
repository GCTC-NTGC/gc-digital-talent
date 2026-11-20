<?php

namespace App\Enums;

enum NotificationFamily
{
    case SYSTEM_MESSAGE;
    case APPLICATION_UPDATE;
    case JOB_ALERT;

    /**
     * Families users can't turn off for contact email and in-app notifications.
     * These won't be stored in the database explicitly.
     * Work email is always opt-in.
     */
    public function isAlwaysEnabledForContactEmailAndInApp(): bool
    {
        return $this === self::SYSTEM_MESSAGE;
    }
}
