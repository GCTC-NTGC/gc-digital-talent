<?php

namespace App\Generators\Field;

use Carbon\Carbon;

class DateField extends Field
{
    /**
     * @param  string  $format  A PHP date format string
     * @param  \Closure(mixed): (string|Carbon|null)  $accessor
     */
    public function __construct(string $heading, public readonly string $format, \Closure $accessor)
    {
        parent::__construct($heading, $accessor);
    }

    /**
     * Render a date with a specific format
     */
    protected function render(mixed $value, ?string $lang, string $default): string
    {
        $date = is_string($value) ? new Carbon($value) : $value;

        return $date instanceof Carbon ? $date->format($this->format) : $default;
    }
}
