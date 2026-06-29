<?php

namespace App\Discoverers;

use App\Contracts\SubscriptionNotification;
use Spatie\StructureDiscoverer\Discover;
use Spatie\StructureDiscoverer\Enums\Sort;

class SubscriptionNotificationDiscoverer
{
    public static function discover(): array
    {
        return Discover::in(app_path('Notifications'))
            ->classes()
            ->implementing(SubscriptionNotification::class)
            ->sortBy(Sort::Name)
            ->get();
    }
}
