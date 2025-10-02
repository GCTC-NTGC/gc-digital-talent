<?php

namespace App\Rules;

use App\Enums\ErrorCode;
use App\Models\User;
use Closure;
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
            $expCount = $user->current_substantive_experiences->count();

            if (! $expCount) {
                $fail(ErrorCode::MISSING_SUBSTANTIVE_EXPERIENCE->name);
            }

            if ($expCount > 1) {
                $fail(ErrorCode::TOO_MANY_SUBSTANTIVE_EXPERIENCES->name);
            }
        }
    }
}
