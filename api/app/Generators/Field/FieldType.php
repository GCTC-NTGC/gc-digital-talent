<?php

namespace App\Generators\Field;

enum FieldType
{
    case TEXT;
    case HTML;
    case ENUM;
    case BOOL;
    case DATE;
    case NUMBER;

    /** @return list<string> */
    public function requiredOptions(): array
    {
        return match ($this) {
            self::ENUM => ['enum'],
            self::DATE => ['format'],
            default => []
        };
    }
}
