<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class ValueIsIdentical implements ValidationRule
{
    /** @var string | int */
    private $valueToCompareAgainst;

    /**
     * Create a new rule instance.
     *
     * @return void
     */
    public function __construct(string|int $valueToCompareAgainst)
    {
        $this->valueToCompareAgainst = $valueToCompareAgainst;
    }

    /**
     * Run the validation rule.
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (is_int($this->valueToCompareAgainst)) {
            if (! ($value === ($this->valueToCompareAgainst))) {
                $fail('INCORRECT_VALUE');
            }
        } elseif (is_string($this->valueToCompareAgainst)) {
            if (! ($value === ($this->valueToCompareAgainst))) {
                $fail('INCORRECT_VALUE');
            }
        } else {
            $fail('INCORRECT_VALUE_TYPE');
        }
    }
}
