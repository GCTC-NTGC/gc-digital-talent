<?php

namespace App\Rules;

use Closure;
use Database\Helpers\ApiErrorEnums;
use Illuminate\Contracts\Validation\ValidationRule;

class LocalizedEnumExists implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {

        $enum = 'App\\Enums\\'.$value;

        if (! enum_exists($enum)) {
            $fail(ApiErrorEnums::ENUM_NOT_FOUND);
        } elseif (! method_exists($enum, 'localizedString')) {
            $fail(ApiErrorEnums::ENUM_NOT_LOCALIZED);
        }
    }
}
