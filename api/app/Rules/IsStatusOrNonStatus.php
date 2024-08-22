<?php

namespace App\Rules;

use App\Enums\ApiError;
use App\Enums\IndigenousCommunity;
use Closure;
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
                in_array(IndigenousCommunity::STATUS_FIRST_NATIONS->name, $value) &&
                in_array(IndigenousCommunity::NON_STATUS_FIRST_NATIONS->name, $value)
            ) {
                $fail(ApiError::USER_BOTH_STATUS_NON_STATUS_FIRST_NATIONS->localizedMessage());
            }
        }
    }
}
