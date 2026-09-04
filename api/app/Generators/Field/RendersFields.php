<?php

namespace App\Generators\Field;

use App\Utilities\LanguageHelpers;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

trait RendersFields
{
    protected ?string $lang;

    /** @var array<string, true> */
    protected array $loggedFields = [];

    /**
     * @param  mixed  $context  Passed to the field accessor
     */
    public function render(Field $field, mixed $context, ?string $default = ''): string
    {
        try {
            return $this->getRenderer($field, $context, $default);
        } catch (\Throwable $e) {
            if (! isset($this->loggedFields[$field->heading])) {
                $this->loggedFields[$field->heading] = true;
                Log::channel('jobs')->warning('Field rendering failed', [
                    'field' => $field->heading,
                    'message' => $e->getMessage(),
                ]);
            }

            return $default;
        }
    }

    /**
     * @param  mixed  $context  Passed to the field accessor
     */
    private function getRenderer(Field $field, mixed $context, ?string $default): string
    {

        // Return the fallback if a visibility condition exists and returns false
        $visible = $field->options['visible'] ?? null;
        if ($visible && ! $visible($context)) {
            return $field->options['fallback'] ?? $this->localize('common.not_available');
        }

        $value = ($field->accessor)($context);
        $default = $field->options['default'] ?? $default ?? '';

        if (is_null($value)) {
            return $default;
        }

        return match ($field->type) {
            FieldType::TEXT => $this->text($value),
            FieldType::HTML => $this->html($value),
            FieldType::NUMBER => $this->number($value),
            FieldType::ENUM => is_array($value) ?
                $this->enumList($value, $field->options['enum'], $default) :
                $this->enum($value, $field->options['enum'], $default),
            FieldType::BOOL => $this->bool($value),
            FieldType::DATE => $this->date($value, $field->options['format'], $default),

            default => $default,

        };
    }

    /**
     * Safely render text inside a document
     *
     * @param  string  $value  String to be rendered
     * @return string New string with no new lines
     */
    private function text(string $value): string
    {
        return str_replace(["\r", "\n"], ' ', $value);
    }

    /**
     * Render HTML source as plain text
     *
     * @param  string  $value  HTML source to be rendered
     * @return string New string with no tags and no new lines
     */
    private function html(string $value): string
    {
        return $this->text(strip_tags($value));
    }

    /**
     * Safely render number inside a document
     *
     * @param  int|float|string  $value  Number to be rendered
     * @return string The number cast to a string
     */
    private function number(int|float|string $value): string
    {
        return (string) $value;
    }

    /**
     * Render a single enum case
     *
     * @param  string  $value  The enum case to be rendered
     * @param  class-string<\UnitEnum>  $enum  Class name of the enum being rendered
     */
    private function enum(string $value, string $enum, ?string $default): string
    {
        return LanguageHelpers::localizeEnum($value, $enum, $this->lang, null, $default);
    }

    /**
     * Render a list of enum cases
     *
     * @param  list<string>  $cases  The enum cases to be rendered
     * @param  class-string<\UnitEnum>  $enum  Class name of the enum being rendered
     */
    private function enumList(array $cases, string $enum, ?string $default): string
    {
        if (empty($cases)) {
            return '';
        }

        $values = array_map(
            fn ($v) => $this->enum($v, $enum, $default),
            $cases
        );

        return implode(', ', array_filter($values));
    }

    /**
     *  Convert a boolean value into a localized
     *  "yes", "no", "" statement
     *
     * @param  bool  $value  The value being converted
     * @return string "Yes" if true, "No" if false
     */
    private function bool(bool $value): string
    {
        $yesOrNo = $value ? 'yes' : 'no';

        return $this->localize('common.'.$yesOrNo);
    }

    /**
     * Render a date with a specific format
     *
     * @param  string|Carbon  $value  The date to be rendered
     * @param  string  $format  A PHP date format string
     */
    private function date(mixed $value, string $format, ?string $default = ''): string
    {
        $date = $value;

        if (is_string($value)) {
            $date = new Carbon($value);
        }

        if ($date instanceof Carbon) {
            return $date->format($format);
        }

        return $default;
    }

    // NOTE: Abstract to avoid colliding with other trait,
    // Likely be able to remove once other trait is no longer needed
    abstract public function localize(string $key): string;
}
