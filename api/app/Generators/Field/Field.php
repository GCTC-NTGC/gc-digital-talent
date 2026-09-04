<?php

namespace App\Generators\Field;

use Carbon\Carbon;

final class Field
{
    /**
     * @param  \Closure(mixed): mixed  $accessor  Reads the value out of the given context
     * @param  array<string, mixed>  $options  Render options keyed by name
     */
    private function __construct(
        public readonly string $heading,
        public readonly FieldType $type,
        public readonly \Closure $accessor,
        public readonly array $options = []
    ) {
        // Ensure we have the required
        foreach ($type->requiredOptions() as $key) {
            if (! array_key_exists($key, $options)) {
                throw new \LogicException($heading.' requires the '.$key.' option.');
            }
        }
    }

    /**
     * @param  \Closure(mixed): ?string  $accessor
     */
    public static function text(string $heading, \Closure $accessor): self
    {
        return new self($heading, FieldType::TEXT, $accessor);
    }

    /**
     * @param  \Closure(mixed): ?string  $accessor
     */
    public static function html(string $heading, \Closure $accessor): self
    {
        return new self($heading, FieldType::HTML, $accessor);
    }

    /**
     * @param  \Closure(mixed): (int|float|string|null)  $accessor
     */
    public static function number(string $heading, \Closure $accessor): self
    {
        return new self($heading, FieldType::NUMBER, $accessor);
    }

    /**
     * @param  class-string<\UnitEnum>  $enum
     * @param  \Closure(mixed): (string|list<string>|null)  $accessor
     */
    public static function enum(string $heading, string $enum, \Closure $accessor): self
    {
        return new self($heading, FieldType::ENUM, $accessor, [
            'enum' => $enum,
        ]);
    }

    /**
     * @param  \Closure(mixed): (string|Carbon|null)  $accessor
     */
    public static function date(string $heading, string $format, \Closure $accessor): self
    {
        return new self($heading, FieldType::DATE, $accessor, [
            'format' => $format,
        ]);
    }

    /**
     * @param  \Closure(mixed): ?bool  $accessor
     */
    public static function bool(string $heading, \Closure $accessor): self
    {
        return new self($heading, FieldType::BOOL, $accessor);
    }

    /**
     * Prevent a field from being rendered based
     * on some condition (i.e consent to share profile)
     */
    public function guard(\Closure $guarded): self
    {
        return new self($this->heading, $this->type, $this->accessor, [
            ...$this->options,
            'guarded' => $guarded,
        ]);
    }
}
