<?php

namespace App\Notifications\Concerns;

use App\Enums\NotificationFamily;
use App\Models\User;
use App\Notifications\GcNotifyEmailChannel;
use App\Notifications\GcNotifyWorkEmailChannel;

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

        $contactEmailEnabled = $family->isAlwaysEnabledForContactEmailAndInApp()
            || in_array($family->name, $notifiable->enabled_email_notifications ?? []);
        if ($contactEmailEnabled) {
            $enabledChannels[] = GcNotifyEmailChannel::class;
        }

        if (in_array($family->name, $notifiable->enabled_work_email_notifications ?? [])) {
            // only a verified work email is routable
            $workEmail = $notifiable->routeNotificationFor(GcNotifyWorkEmailChannel::ROUTE);
            // don't send the same email twice when the work email is also the contact email
            $duplicatesContactEmail = $contactEmailEnabled
                && is_string($workEmail)
                && mb_strtolower($workEmail) === mb_strtolower((string) $notifiable->email);

            if (! empty($workEmail) && ! $duplicatesContactEmail) {
                $enabledChannels[] = GcNotifyWorkEmailChannel::class;
            }
        }

        $inAppEnabled = $family->isAlwaysEnabledForContactEmailAndInApp()
            || in_array($family->name, $notifiable->enabled_in_app_notifications ?? []);
        if ($inAppEnabled) {
            $enabledChannels[] = 'database';
        }

        return $enabledChannels;
    }
}
