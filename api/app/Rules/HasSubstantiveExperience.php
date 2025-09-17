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

        if ($user) {
            $expCount = $user->current_substantive_experience->count();

            if (! $expCount) {
                $fail(ApiErrorEnums::MISSING_SUBSTANTIVE_EXPERIENCE);
            }

            if ($expCount > 1) {
                $fail(ApiErrorEnums::TOO_MANY_SUBSTANTIVE_EXPERIENCES);
            }
        }
    }
}
