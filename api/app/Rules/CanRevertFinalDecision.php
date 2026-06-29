<?php

namespace App\Rules;

use App\Enums\ApplicationStatus;
use App\Enums\ErrorCode;
use App\Enums\PlacementType;
use App\Models\PoolCandidate;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class CanRevertFinalDecision implements ValidationRule
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

        if (! in_array($candidate->application_status, ApplicationStatus::assessedGroup())) {
            $fail(ErrorCode::INVALID_STATUS_REVERT_FINAL_DECISION->name);

            return;
        }

        if ($candidate->placement_type && $candidate->placement_type !== PlacementType::NOT_PLACED->name) {
            $fail(ErrorCode::INVALID_REVERT_DECISION_PLACED->name);
        }

    }
}
