<?php

namespace App\GraphQL\Types;

use App\Discoverers\SubscriptionNotificationDiscoverer;
use GraphQL\Type\Definition\EnumType;
use Nuwave\Lighthouse\Schema\TypeRegistry;

final class NotificationTypeRegistrar implements TypeRegistrarInterface
{
    public static int $weight = 5;

    public static function register(TypeRegistry $typeRegistry): void
    {
        $notifications = SubscriptionNotificationDiscoverer::discover();
        $values = [];

        foreach ($notifications as $notification) {
            $name = class_basename($notification);
            $values[$name] = ['value' => $name];
        }

        $typeRegistry->register(
            new EnumType([
                'name' => 'NotificationType',
                'values' => $values,
            ])
        );
    }
}
