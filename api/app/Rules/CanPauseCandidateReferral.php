<?php

namespace App\Rules;

use App\Enums\ApplicationStatus;
use App\Enums\ErrorCode;
use App\Enums\PlacementType;
use App\Models\PoolCandidate;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class CanPauseCandidateReferral implements ValidationRule
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

        if ($candidate->application_status !== ApplicationStatus::QUALIFIED->name) {
            $fail(ErrorCode::INVALID_PAUSE_REFERRAL->name);
        }

        if ($candidate->placement_type === PlacementType::PLACED_INDETERMINATE->name) {
            $fail(ErrorCode::INVALID_PAUSE_REFERRAL->name);
        }
    }
}
