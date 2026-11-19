<?php

namespace App\Notifications\Concerns;

use App\Enums\NotificationFamily;
use App\Models\User;
use App\Notifications\GcNotifyEmailChannel;

/**
 * Picks delivery channels for a notification based on the user's
 * per-family notification preferences.
 */
trait HasNotificationFamilyChannels
{
    /**
     * @return array<int, string>
     */
    protected function channelsForFamily(User $notifiable, NotificationFamily $family): array
    {
        $enabledChannels = [];

        if (in_array($family->name, $notifiable->enabled_email_notifications ?? [])) {
            $enabledChannels[] = GcNotifyEmailChannel::class;
        }

        if (in_array($family->name, $notifiable->enabled_in_app_notifications ?? [])) {
            $enabledChannels[] = 'database';
        }

        return $enabledChannels;
    }
}
