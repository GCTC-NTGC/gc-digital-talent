<?php

namespace App\Generators\Field;

final class HtmlField extends TextField
{
    /**
     * Render HTML source as plain text
     *
     * @return string New string with no tags and no new lines
     */
    protected function render(mixed $value, ?string $lang, string $default): string
    {
        return parent::render(strip_tags($value), $lang, $default);
    }
}
