<?php

namespace App\Support;

use App\Utilities\LanguageHelpers;

class BladeHelpers
{
    /**
     * Check for the existence of a localized field in the current locale
     *
     * @param  mixed  $field  A localized field
     */
    public static function hasLocalized(mixed $field): bool
    {
        return ! empty($field['localized']);
    }

    /**
     * Render a localized field in the current locale
     *
     * @param  iterable<string, mixed>  $field  A localized field
     */
    public static function renderLocalized(iterable $field): string
    {
        if (is_array($field) && array_key_exists('localized', $field)) {
            $text = $field['localized'] ?? null;

            return ! blank($text) ? $text : __('common.not_provided');
        }

        return json_encode($field);
    }

    /**
     * Render the localized label of an enum value in the current locale
     *
     * @param  string|null  $value  The value of the enum
     * @param  class-string  $enum  The enum class
     */
    public static function renderEnum(?string $value, string $enum): string
    {
        return self::renderLocalized([
            'localized' => LanguageHelpers::localizeEnum($value, $enum, app()->getLocale()),
        ]);
    }
}
