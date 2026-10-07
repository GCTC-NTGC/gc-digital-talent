<?php

namespace App\Generators\Field;

use App\Utilities\LanguageHelpers;

class EnumField extends Field
{
    /**
     * @param  class-string<\UnitEnum>  $enum  Class name of the enum being rendered
     * @param  \Closure(mixed): (string|list<string>|null)  $accessor
     */
    public function __construct(string $heading, public readonly string $enum, \Closure $accessor)
    {
        parent::__construct($heading, $accessor);
    }

    /**
     * Render a single enum case, or a list of cases separated by commas
     */
    protected function render(mixed $value, ?string $lang, string $default): string
    {
        if (is_array($value)) {
            $cases = array_map(
                fn ($case) => LanguageHelpers::localizeEnum($case, $this->enum, $lang, null, $default),
                $value
            );

            return implode(', ', array_filter($cases));
        }

        return LanguageHelpers::localizeEnum($value, $this->enum, $lang, null, $default);
    }
}
