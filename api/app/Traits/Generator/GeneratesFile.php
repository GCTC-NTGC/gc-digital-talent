<?php

namespace App\Traits\Generator;

use Illuminate\Support\Facades\Lang;

trait GeneratesFile
{
    protected ?string $lang;

    /**
     * Convert enum to a more human readable format
     *
     * @param  string  $enum  The value of the enum
     */
    protected function sanitizeEnum(?string $enum): string
    {
        return ucwords(strtolower(str_replace('_', ' ', $enum)));
    }

    /**
     *  Localize an enum value
     *
     * @param  string|null  $value  of the enum
     * @param  class-string  $enum  The enum class
     * @param  string|null  $subKey  Optional subkey for localization
     * @param  mixed  $default  Default value to return if null
     * @return string Localized enum value or $default if value is null
     */
    protected function localizeEnum(?string $value, string $enum, ?string $subKey = null, mixed $default = ''): string
    {
        // if null return default
        if ($value === null) {
            return $default;
        }

        // if enum class does not exist return default
        if (! class_exists($enum)) {
            return $default;
        }

        /** @use \App\Traits\HasLocalization<UnitEnum> $enum */
        return $enum::localizedString($value, $subKey)[$this->lang] ?? $default;
    }

    /**
     * Localize an array of enum values
     *
     * @param  array<string>|null  $values  Array of the enum values are strings
     * @param  class-string  $enum  The enum class being localized
     * @param  mixed  $default  Default value to return if null
     * @return string Comma separated localized enum values or $default if values is null
     */
    protected function localizeEnumArray(?array $values, string $enum, mixed $default = ''): string
    {
        // if null return default
        if ($values === null) {
            return $default;
        }

        // if array is empty return empty string
        if (empty($values)) {
            return '';
        }

        // convert each enum value to localized string
        $localizedValues = array_map(
            fn ($value) => $this->localizeEnum($value, $enum),
            $values
        );

        // return join localized values with commas, filter out any empty strings to avoid trailing commas in output
        return implode(', ', array_filter($localizedValues));
    }

    /**
     *  Convert a boolean value into a localized
     *  "yes", "no", "" statement
     *
     * @param  ?bool  $value  The value being converted
     * @param  mixed  $default  Default value if null
     * @return string "Yes" if true, "No" if false, $default if null
     */
    public function yesOrNo(?bool $value, mixed $default = ''): string
    {

        if (is_null($value)) {
            return $default;
        }

        return $value ? Lang::get('common.yes', [], $this->lang) : Lang::get('common.no', [], $this->lang);
    }

    /**
     * Dividing colon based on language
     *
     * @return string
     */
    public function colon()
    {
        return $this->lang === 'fr' ? ' : ' : ': ';
    }

    /**
     * Strip out new line characters from a string
     *
     * @param  string  $string  A string with new lines
     * @return string New string with no new lines
     */
    public function sanitizeString(string $string): string
    {
        return str_replace(["\r", "\n"], ' ', $string);
    }

    /**
     * Localize a string based on the requested
     * file language
     *
     * @param  string  $key  The key of the string
     * @return string The localized string
     */
    public function localize(string $key): string
    {
        return Lang::get($key, [], $this->lang);
    }

    /**
     * Localize a heading in a file
     *
     * @param  string  $key  The heading key (from headings.php lang files)
     * @return string The localized heading
     */
    public function localizeHeading(string $key): string
    {
        return $this->localize('headings.'.$key);
    }

    /**
     * "Not available" message returned if condition not met
     *
     * @param  bool  $condition  The condition
     * @param  string  $data  The data shown if condition met
     */
    public function canShare(bool $condition, ?string $data = null)
    {
        if ($condition) {
            return $data;
        }

        return Lang::get('common.not_available', [], $this->lang);
    }
}
