<?php

namespace App\Rules;

use App\Enums\ErrorCode;
use App\Models\User;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class IsVerifiedGovEmployee implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string, ?string=): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {

        $user = User::whereExactWorkEmail($value)->first();

        if ($user && ! $user->is_verified_gov_employee) {
            $fail(ErrorCode::NOT_VERIFIED_GOVERNMENT_EMPLOYEE->name);
        }

    }
}
