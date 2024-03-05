<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class ArrayIsUnique implements ValidationRule
{
    /**
     * Run the validation rule.
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if ($value && gettype($value) === 'array') {
            if (! (count($value) === count(array_unique($value)))) {
                $fail('ArrayContainsDuplicates');
            }
        }
    }
}
