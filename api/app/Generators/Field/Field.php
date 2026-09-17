<?php

namespace App\Generators\Field;

use Illuminate\Support\Facades\Lang;

abstract class Field
{
    /** @var ?\Closure(mixed): bool */
    protected ?\Closure $condition = null;

    /** Rendered in place of the value when the condition returns false */
    public ?string $fallback = null;

    /**
     * @param  \Closure(mixed): mixed  $accessor  Reads the value out of the given context
     */
    public function __construct(
        public readonly string $heading,
        public readonly \Closure $accessor,
    ) {}

    /**
     * Render a non null value as a string for the document
     *
     * @param  string  $default  Rendered when the value cannot be rendered
     */
    abstract protected function render(mixed $value, ?string $lang, string $default): string;

    /**
     * Read a value out of the context and render it
     *
     * @param  mixed  $context  Passed to the visibility condition and the accessor
     */
    public function resolve(mixed $context, ?string $lang = 'en', ?string $default = ''): string
    {
        $default ??= '';

        // Return the fallback if a visibility condition exists and returns false
        if ($this->condition && ! ($this->condition)($context)) {
            return $this->fallback ?? Lang::get('common.not_available', [], $lang);
        }

        $value = ($this->accessor)($context);

        return is_null($value) ? $default : $this->render($value, $lang, $default);
    }

    /**
     * Prevent a field from being rendered based
     * on some condition (i.e consent to share profile)
     *
     * @param  \Closure(mixed): bool  $condition
     * @param  ?string  $fallback  Rendered when $condition returns false
     */
    public function visibleIf(\Closure $condition, ?string $fallback = null): static
    {
        $field = clone $this;
        $field->condition = $condition;
        $field->fallback = $fallback;

        return $field;
    }
}
