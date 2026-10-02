<?php

namespace App\Utilities;

class LanguageHelpers
{
    /**
     * Convert enum to a more human readable format
     *
     * @param  string  $enum  The value of the enum
     */
    private static function sanitizeEnum(?string $enum): string
    {
        return ucwords(strtolower(str_replace('_', ' ', $enum)));
    }

    /**
     *  Localize an enum value
     *
     * @param  string|null  $value  of the enum
     * @param  class-string  $enum  The enum class
     * @param  string|null  $lang  Desired language
     * @param  string|null  $subKey  Optional subkey for localization
     * @param  mixed  $default  Default value to return if null
     * @return string Localized enum value or $default if value is null
     */
    public static function localizeEnum(?string $value, string $enum, ?string $lang = 'en', ?string $subKey = null, mixed $default = ''): string
    {
        // if null return default
        if ($value === null) {
            return $default;
        }

        // if enum class does not exist return default
        if (! class_exists($enum)) {
            return $default;
        }

        // check if value exists in enum cases, if it does not, just return the upper case value directly
        $enumCases = array_column($enum::cases(), 'name');
        $valueInCases = in_array(strtoupper($value), $enumCases);

        /** @use HasLocalization<UnitEnum> $enum */
        return $valueInCases ?
        $enum::localizedString($value, $subKey)[$lang] ?? $default
        : self::sanitizeEnum($value);
    }
}
