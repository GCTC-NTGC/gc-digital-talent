<?php

namespace App\Enums;

/**
 * Enum value for different implementations of notifications
 *
 * Cases must match the class name of the notification in App\Notifications
 */
enum NotificationType
{
    case PoolCandidateStatusChanged;
    case ApplicationDeadlineApproaching;

    public static function fromClassName(string $className)
    {

        $path = explode('\\', $className);
        $baseName = array_pop($path);

        foreach (self::cases() as $case) {
            if ($baseName === $case->name) {
                return $case;
            }
        }

        throw new \ValueError($className.' is not a valid case for enum ', self::class);
    }
}
