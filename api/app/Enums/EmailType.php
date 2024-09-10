<?php

namespace App\Enums;

enum EmailType
{
    case CONTACT;
    case WORK;

    public static function fromName(string $name): EmailType
    {
        foreach (self::cases() as $type) {
            if ($name === $type->name) {
                return $type;
            }
        }
        throw new \ValueError("$name is not a valid backing value for enum ".self::class);
    }
}
