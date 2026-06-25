<?php

namespace App\Rules;

use App\Enums\ErrorCode;
use App\Models\PoolCandidate;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class PoolCandidateDraftOrNonExistent implements ValidationRule
{
    private ?PoolCandidate $poolCandidate;

    /**
     * Create a new rule instance.
     *
     * @return void
     */
    public function __construct(?string $poolId, ?string $userId)
    {
        // do not run if ids null
        if (! $poolId || ! $userId) {
            $this->poolCandidate = null;

            return;
        }

        $this->poolCandidate = PoolCandidate::where('pool_id', $poolId)
            ->where('user_id', $userId)
            ->withTrashed()
            ->select(['submitted_at'])
            ->first();
    }

    /**
     * Run the validation rule.
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if ($this->poolCandidate) {
            if ($this->poolCandidate->submitted_at) {
                $fail(ErrorCode::SPECIAL_APPLICATIONS_USER_ALREADY_APPLIED->name);
            }
        }
    }
}
