<?php

namespace App\Rules;

use App\Enums\ApplicationStatus;
use App\Enums\ErrorCode;
use App\Enums\PlacementType;
use App\Models\PoolCandidate;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class CanRemoveCandidate implements ValidationRule
{
    /**
     * Run the validation rule.
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $candidate = PoolCandidate::find($value);

        if (! $candidate) {
            return;
        }

        if ($candidate->application_status === ApplicationStatus::DRAFT->name) {
            $fail(ErrorCode::CANDIDATE_UNEXPECTED_STATUS->name);

            return;
        }

        if ($candidate->application_status === ApplicationStatus::REMOVED->name) {
            $fail(ErrorCode::REMOVE_CANDIDATE_ALREADY_REMOVED->name);

            return;
        }

        $isPlaced = ! empty($candidate->placement_type) && $candidate->placement_type !== PlacementType::NOT_PLACED->name;
        if ($isPlaced) {
            $fail(ErrorCode::REMOVE_CANDIDATE_ALREADY_PLACED->name);
        }
    }
}
