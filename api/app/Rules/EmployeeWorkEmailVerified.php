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
    private User $user;

    private bool $isSpecialApplication;

    /**
     * Create a new rule instance.
     *
     * @return void
     */
    public function __construct(User $user, bool $isSpecialApplication)
    {
        $this->user = $user;

        $this->isSpecialApplication = $isSpecialApplication;
    }

    /**
     * Determine if the validation rule passes.
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        // do not run this check if this is a special application
        if ($this->isSpecialApplication === true) {
            return;
        }

        /** @var Pool $pool */
        $pool = Pool::find($value);

        if ($pool->area_of_selection === PoolAreaOfSelection::EMPLOYEES->name
             && (empty($this->user->work_email) || empty($this->user->work_email_verified_at))) {
            $fail(ErrorCode::APPLICATION_WORK_EMAIL_NOT_VERIFIED->name);
        }
    }
}
