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
            // don't send the same email twice when the work email is also the contact email
            $duplicatesContactEmail = $contactEmailEnabled
                && mb_strtolower((string) $notifiable->work_email) === mb_strtolower((string) $notifiable->email);

            // only a verified work email is sendable
            if ($notifiable->has_a_verified_work_email_address && ! $duplicatesContactEmail) {
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
