<?php

namespace App\Generators\Field;

class NumberField extends Field
{
    /**
     * @param  \Closure(mixed): (int|float|string|null)  $accessor
     */
    public function __construct(string $heading, \Closure $accessor)
    {
        parent::__construct($heading, $accessor);
    }

    /**
     * Safely render a number inside a document
     *
     * @return string The number cast to a string
     */
    protected function render(mixed $value, ?string $lang, string $default): string
    {
        return (string) $value;
    }
}
