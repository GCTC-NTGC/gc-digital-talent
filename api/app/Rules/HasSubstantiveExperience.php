<?php

namespace App\Rules;

use App\Models\User;
use Closure;
use Database\Helpers\ApiErrorEnums;
use Illuminate\Contracts\Validation\ValidationRule;

class HasSubstantiveExperience implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string, ?string=): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $user = User::find($value);

        if ($user && ! $user->UpdateEmployeeWFAValidator) {
            $fail(ApiErrorEnums::MISSING_SUBSTANTIVE_EXPERIENCE);
        }
    }
}
