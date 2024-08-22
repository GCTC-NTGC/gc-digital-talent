<?php

namespace App\Rules;

use App\Enums\ApiError;
use Closure;
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
            $fail(ApiError::ENUM_NOT_FOUND->localizedMessage());
        } elseif (! method_exists($enum, 'localizedString')) {
            $fail(ApiError::ENUM_NOT_LOCALIZED->localizedMessage());
        }
    }
}
