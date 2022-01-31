<?php

namespace Database\Helpers;

class KeyStringHelpers
{
    /**
     * Transforms a string to be compliant with the GraphQL KeyString scalar type
     *
     * @return string
     */
    public static function toKeyString(string $s) : string
    {
        return preg_replace('/[^a-z_]/', '_', strtolower($s));
    }
}
