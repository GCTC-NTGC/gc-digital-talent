<?php

namespace App\Rules;

use App\Enums\ErrorCode;
use App\Enums\ReferralPauseLength;
use App\Models\PoolCandidate;
use Closure;
use Error;
use Illuminate\Contracts\Validation\DataAwareRule;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Log;
use Nuwave\Lighthouse\Execution\Arguments\ArgumentSet;

class UnpauseAtBeforeExpiryDate implements DataAwareRule, ValidationRule
{
    protected $data = [];
    protected $args;

    public function setData(array $data): static
    {
        $this->data = $data;

        return $this;
    }

    /**
     * Create a new rule instance.
     *
     * @param mixed
     * @return void
     */
    public function __construct(mixed $args)
    {
        $this->args = $args;
    }

    /**
     * Run the validation rule.
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $now = Carbon::now();
        $candidate = PoolCandidate::findOrFail($this->data['id']);
        $expiryDate = isset($this->args['expiryDate']) ? Carbon::parse($this->args['expiryDate']) : $candidate->expiry_date;
        $referralPauseLength = isset($this->args['referralPauseLength']) ? $this->args['referralPauseLength'] : null;
        $referralUnpauseAt = isset($this->args['referralUnpauseAt']) ? $this->args['referralUnpauseAt'] : null;

        $lengthOfTime = match ($referralPauseLength) {
            ReferralPauseLength::ONE_MONTH->name => $now->addMonth(),
            ReferralPauseLength::THREE_MONTHS->name => $now->addMonths(3),
            ReferralPauseLength::SIX_MONTHS->name => $now->addMonths(6),
            ReferralPauseLength::ONE_YEAR->name => $now->addYear(),
            ReferralPauseLength::UNTIL_EXPIRY->name => $expiryDate,
            ReferralPauseLength::OTHER->name => $referralUnpauseAt,
            default => null,
        };

        if (isset($expiryDate) && $expiryDate->lt($lengthOfTime)) {
            $fail(ErrorCode::INVALID_UNPAUSE_AT_DATE->name);
        }
    }
}
