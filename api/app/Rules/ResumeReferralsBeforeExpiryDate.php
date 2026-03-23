<?php

namespace App\Rules;

use App\Enums\ErrorCode;
use App\Enums\PauseReferralsLength;
use App\Models\PoolCandidate;
use Closure;
use Illuminate\Contracts\Validation\DataAwareRule;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Support\Carbon;

class ResumeReferralsBeforeExpiryDate implements DataAwareRule, ValidationRule
{
    protected $data = [];

    protected $args;

    public function setData(array $data): static
    {
        $this->data = $data;

        return $this;
    }

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
        $pauseReferralsLength = isset($this->args['pauseReferralsLength']) ? $this->args['pauseReferralsLength'] : null;
        $resumeReferralsAt = isset($this->args['resumeReferralsAt']) ? $this->args['resumeReferralsAt'] : null;

        $lengthOfTime = match ($pauseReferralsLength) {
            PauseReferralsLength::ONE_MONTH->name => $now->addMonth(),
            PauseReferralsLength::THREE_MONTHS->name => $now->addMonths(3),
            PauseReferralsLength::SIX_MONTHS->name => $now->addMonths(6),
            PauseReferralsLength::ONE_YEAR->name => $now->addYear(),
            PauseReferralsLength::UNTIL_EXPIRY->name => $expiryDate,
            PauseReferralsLength::OTHER->name => $resumeReferralsAt,
            default => null,
        };

        if (isset($expiryDate) && $expiryDate->lt($lengthOfTime)) {
            $fail(ErrorCode::INVALID_UNPAUSE_AT_DATE->name);
        }
    }
}
