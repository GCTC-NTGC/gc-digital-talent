<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class LocalizedString implements ValidationRule
{
    /**
     * Run the validation rule.
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (! is_array($value)) {
            $fail("The {$attribute} field must be an array.");

            return;
        }

        $keys = array_keys($value);
        sort($keys);

        if ($keys !== ['en', 'fr']) {
            $fail("The {$attribute} field must include only en and fr values.");

            return;
        }

        // ConvertEmptyStringsToNull middleware will turn empty strings into nulls
        if ((! is_string($value['en']) && ! is_null($value['en'])) ||
            (! is_string($value['fr']) && ! is_null($value['fr']))) {
            $fail("The {$attribute}.en and {$attribute}.fr fields must be strings or null.");

            return;
        }

        if (blank($value['en']) !== blank($value['fr'])) {
            $fail("The {$attribute}.en and {$attribute}.fr fields must both be empty or both be filled.");
        }
    }
}
