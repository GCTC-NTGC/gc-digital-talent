<?php

namespace App\Generators\Field;

use Illuminate\Support\Facades\Lang;

final class BoolField extends Field
{
    /**
     * @param  \Closure(mixed): ?bool  $accessor
     */
    public function __construct(string $heading, \Closure $accessor)
    {
        parent::__construct($heading, $accessor);
    }

    /**
     *  Convert a boolean value into a localized
     *  "yes", "no" statement
     *
     * @return string "Yes" if true, "No" if false
     */
    protected function render(mixed $value, ?string $lang, string $default): string
    {
        return Lang::get($value ? 'common.yes' : 'common.no', [], $lang);
    }
}
