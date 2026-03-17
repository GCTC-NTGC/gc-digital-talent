<?php

namespace App\Rules;

use App\Enums\ErrorCode;
use App\Enums\ReferralPauseLength;
use Closure;
use Illuminate\Contracts\Validation\DataAwareRule;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Support\Carbon;

class UnpauseAtBeforeExpiryDate implements DataAwareRule, ValidationRule
{
    protected $data = [];

    public function setData(array $data): static
    {
        $this->data = $data;

        return $this;
    }

    /**
     * Run the validation rule.
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $now = Carbon::now();
        $expiryDate = Carbon::parse($this->data['poolCandidate']['expiryDate']) ?? null;
        $referralPauseLength = $this->data['poolCandidate']['referralPause']['referralPauseLength'];
        $referralUnpauseAt = $this->data['poolCandidate']['referralPause']['referralUnpauseAt'];

        $lengthOfTime = match ($referralPauseLength) {
            ReferralPauseLength::ONE_MONTH->name => $now->addMonth(),
            ReferralPauseLength::THREE_MONTHS->name => $now->addMonths(3),
            ReferralPauseLength::SIX_MONTHS->name => $now->addMonths(6),
            ReferralPauseLength::ONE_YEAR->name => $now->addYear(),
            ReferralPauseLength::UNTIL_EXPIRY->name => $expiryDate,
            ReferralPauseLength::OTHER->name => $referralUnpauseAt,
            default => null,
        };

        if ($expiryDate->lt($lengthOfTime)) {
            $fail(ErrorCode::INVALID_UNPAUSE_AT_DATE->name);
        }
    }
}
