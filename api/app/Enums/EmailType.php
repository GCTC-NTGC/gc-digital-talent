<?php

namespace App\Enums;

enum EmailType: string
{
    // Matching these values to the field names in the database
    case CONTACT = 'email';
    case WORK = 'work_email';

    public static function fromName(string $name): EmailType
    {
        foreach (self::cases() as $type) {
            if ($name === $type->name) {
                return $type;
            }
        }
        throw new \ValueError("$name is not a valid backing value for enum ".self::class);
    }

    // which email types can be verified on our app?
    public static function verifiableGroup(): array
    {
        return [
            EmailType::WORK->name,
        ];
    }
}
