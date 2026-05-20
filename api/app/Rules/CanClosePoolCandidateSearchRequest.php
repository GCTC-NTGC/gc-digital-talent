<?php

namespace App\Rules;

use App\Enums\ErrorCode;
use App\Enums\TalentRequestStatus;
use App\Models\PoolCandidateSearchRequest;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class CanClosePoolCandidateSearchRequest implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $searchRequest = PoolCandidateSearchRequest::find($value);

        if (! $searchRequest) {
            return;
        }

        if ($searchRequest->status === TalentRequestStatus::CLOSED->name) {
            $fail(ErrorCode::TALENT_REQUEST_ALREADY_CLOSED->name);
        }
    }
}
