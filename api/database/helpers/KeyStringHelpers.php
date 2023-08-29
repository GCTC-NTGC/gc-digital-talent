<?php

namespace Database\Helpers;

use App\GraphQL\Scalars\KeyString;
use Exception;

class KeyStringHelpers
{
    private static $substitutions = [
        '.' => 'dot',
        '#' => 'sharp',
        '+' => 'plus',
        '0' => 'zero',
        '1' => 'one',
        '2' => 'two',
        '3' => 'three',
        '4' => 'four',
        '5' => 'five',
        '6' => 'six',
        '7' => 'seven',
        '8' => 'eight',
        '9' => 'nine',
    ];

    /**
     * Transforms a string to be compliant with the GraphQL KeyString scalar type
     */
    public static function toKeyString(string $originalString): string
    {
        $substitutedString = str_replace(
            array_keys(KeyStringHelpers::$substitutions),
            array_values(KeyStringHelpers::$substitutions),
            $originalString
        );

        $newKeyString = preg_replace('/[^a-z_]/', '_', strtolower($substitutedString));

        // double check if this result is compliant
        if (! preg_match(KeyString::regex(), $newKeyString)) {
            throw new Exception('Failed to convert string '.$newKeyString.' to KeyString');
        }

        return $newKeyString;
    }
}
