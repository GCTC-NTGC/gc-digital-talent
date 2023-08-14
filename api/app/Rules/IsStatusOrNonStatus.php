<?php

namespace App\Rules;

use Closure;
use Database\Helpers\ApiEnums;
use Illuminate\Contracts\Validation\ValidationRule;

class IsStatusOrNonStatus implements ValidationRule
{
    /**
     * Run the validation rule.
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (isset($value)) {
            if (
                in_array(ApiEnums::INDIGENOUS_STATUS_FIRST_NATIONS, $value) &&
                in_array(ApiEnums::INDIGENOUS_NON_STATUS_FIRST_NATIONS, $value)
            ) {
                $fail('BothStatusNonStatus');
            }
        }
    }
}
