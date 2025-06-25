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
     * @param  string  $value  of the enum
     * @param  class-string  $enum  The enum class
     */
    protected function localizeEnum(?string $value, string $enum, ?string $subKey = null): string
    {
        if (! class_exists($enum) || ! $value) {
            return '';
        }

        /** @use \App\Traits\HasLocalization<UnitEnum> $enum */
        return $enum::localizedString($value, $subKey)[$this->lang] ?? '';
    }

    /**
     * Localize an array of enum values
     *
     * @param  array{string}  $values  Array of the enum values are strings
     * @param  class-string  $enum  The enum class being localized
     */
    protected function localizeEnumArray(?array $values, string $enum): string
    {
        if (! $values) {
            return '';
        }

        return implode(', ', array_map(function ($value) use ($enum) {
            return $this->localizeEnum($value, $enum);
        }, $values));
    }

    /**
     *  Convert a boolean value into a localized
     *  "yes" or "no" statement
     *
     * @param  ?bool  $value  The value being converted
     * @return string "Yes" if true, "No" if false
     */
    public function yesOrNo(?bool $value): string
    {
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
    public function canShare(bool $condition, string $data)
    {
        if ($condition) {
            return $data;
        }

        return Lang::get('common.not_available', [], $this->lang);
    }
}
