<?php

namespace Database\Helpers;

class UuidHelpers
{
    /**
     * Appends an integer to the first four parts of a UUID to create a valid UUID
     *
     * @return string
     */
    public static function integerToUuid(int $i) : string
    {
        return '00000000-0000-0000-0000-' . str_pad($i, 12, '0', STR_PAD_LEFT);
    }
}

