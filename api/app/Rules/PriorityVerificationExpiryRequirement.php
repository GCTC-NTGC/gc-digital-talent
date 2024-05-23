<?php

namespace App\Rules;

use App\Enums\ClaimVerificationResult;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class PriorityVerificationExpiryRequirement implements ValidationRule
{
    /**
     * Run the validation rule.
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        // an accepted status for priority verification must be attached to a non-null expiration
        if ($value['priorityVerification'] == ClaimVerificationResult::ACCEPTED->name && ! $value['priorityVerificationExpiry']) {
            $fail('AcceptedPriorityRequiresExpiry');
        }

        // in any non-ACCEPTED cases no expiration should be present
        if (($value['veteranVerification'] != ClaimVerificationResult::ACCEPTED->name && ! is_null($value['veteranVerificationExpiry'])) ||
        ($value['priorityVerification'] != ClaimVerificationResult::ACCEPTED->name && ! is_null($value['priorityVerificationExpiry']))
        ) {
            $fail('NoExpirationForThisResult');
        }
    }
}
