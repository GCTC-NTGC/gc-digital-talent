<?php

namespace App\Rules;

use App\Enums\ErrorCode;
use App\Enums\PoolAreaOfSelection;
use App\Models\Pool;
use App\Models\User;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class EmployeeWorkEmailVerified implements ValidationRule
{
    private $user;

    /**
     * Create a new rule instance.
     *
     * @return void
     */
    public function __construct(User $user)
    {
        $this->user = $user;
    }

    /**
     * Determine if the validation rule passes.
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        /** @var Pool $pool */
        $pool = Pool::find($value);

        $passes = $pool->area_of_selection === PoolAreaOfSelection::EMPLOYEES->name
            && $this->user->work_email_verified_at;

        if (! $passes) {
            $fail(ErrorCode::APPLICATION_WORK_EMAIL_NOT_VERIFIED->name);
        }
    }
}
