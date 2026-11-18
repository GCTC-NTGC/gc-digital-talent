<?php

namespace App\Rules;

use App\Enums\ErrorCode;
use App\Models\User;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class FallbackNominatorIsNotNominee implements ValidationRule
{
    private User $nominee;

    /**
     * Create a new rule instance.
     *
     * @return void
     */
    public function __construct(User $nominee)
    {
        $this->nominee = $nominee;
    }

    /**
     * Determine if the validation rule passes.
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $nomineeWorkEmail = $this->nominee->work_email;

        if (! is_null($value) && ! is_null($nomineeWorkEmail) && strcasecmp($value, $nomineeWorkEmail) === 0) {
            $fail(ErrorCode::NOMINEE_CANNOT_BE_NOMINATOR->name);
        }
    }
}
