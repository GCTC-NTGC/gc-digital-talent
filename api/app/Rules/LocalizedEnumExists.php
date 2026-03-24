<?php

namespace App\Rules;

use App\Enums\ErrorCode;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Translation\PotentiallyTranslatedString;

class LocalizedEnumExists implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  Closure(string): PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {

        $enum = 'App\\Enums\\'.$value;

        if (! enum_exists($enum)) {
            $fail(ErrorCode::ENUM_NOT_FOUND->name);
        } elseif (! method_exists($enum, 'localizedString')) {
            $fail(ErrorCode::ENUM_NOT_LOCALIZED->name);
        }
    }
}
