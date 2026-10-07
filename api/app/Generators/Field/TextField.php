<?php

namespace App\Generators\Field;

class TextField extends Field
{
    /**
     * @param  \Closure(mixed): ?string  $accessor
     */
    public function __construct(string $heading, \Closure $accessor)
    {
        parent::__construct($heading, $accessor);
    }

    /**
     * Safely render text inside a document
     *
     * @return string New string with no new lines
     */
    protected function render(mixed $value, ?string $lang, string $default): string
    {
        return str_replace(["\r", "\n"], ' ', $value);
    }
}
