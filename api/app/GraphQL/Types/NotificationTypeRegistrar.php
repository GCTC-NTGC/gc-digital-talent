<?php

namespace App\GraphQL\Types;

use App\Discoverers\SubscriptionNotificationDiscoverer;
use GraphQL\Type\Definition\EnumType;
use GraphQL\Type\Definition\NamedType;
use GraphQL\Type\Definition\Type;
use Nuwave\Lighthouse\Schema\TypeRegistry;

final class NotificationTypeRegistrar implements TypeRegistrarInterface
{
    public static int $weight = 100;

    public static function register(TypeRegistry $typeRegistry): void
    {
        $typeRegistry->registerLazy(
            'NotificationType',
            function (): Type&NamedType {
                $notifications = SubscriptionNotificationDiscoverer::discover();
                $values = [];

                foreach ($notifications as $notification) {
                    $name = class_basename($notification);
                    $values[$name] = ['value' => $name];
                }

                return new EnumType([
                    'name' => 'NotificationType',
                    'values' => $values,
                ]);
            });
    }
}
