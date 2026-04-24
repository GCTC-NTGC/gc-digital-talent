<?php

namespace App\Rules;

use App\Enums\ApplicationStatus;
use App\Enums\ErrorCode;
use App\Models\PoolCandidate;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class CanReinstateCandidate implements ValidationRule
{
    /**
     * Run the validation rule.
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $candidate = PoolCandidate::find($value);

        if (! $candidate) {
            $fail(ErrorCode::CANDIDATE_NOT_FOUND->name);

            return;
        }

        if ($candidate->application_status !== ApplicationStatus::REMOVED->name) {
            $fail(ErrorCode::CANDIDATE_UNEXPECTED_STATUS->name);
        }
    }
}
