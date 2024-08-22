<?php

declare(strict_types=1);

namespace App\GraphQL\Validators;

use App\Enums\ApiError;
use App\Enums\PoolCandidateStatus;
use App\Models\PoolCandidate;
use Carbon\Carbon;
use Nuwave\Lighthouse\Exceptions\ValidationException;
use Nuwave\Lighthouse\Validation\Validator;

final class QualifyCandidateValidator extends Validator
{
    /**
     * Return the validation rules.
     *
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        $id = $this->arg('id');
        $candidate = PoolCandidate::findOrFail($id);
        $endOfDay = Carbon::now()->endOfDay();

        $statusesArray = [
            PoolCandidateStatus::NEW_APPLICATION->name,
            PoolCandidateStatus::APPLICATION_REVIEW->name,
            PoolCandidateStatus::SCREENED_IN->name,
            PoolCandidateStatus::UNDER_ASSESSMENT->name,
        ];

        if (! (in_array($candidate->pool_candidate_status, $statusesArray))) {
            throw ValidationException::withMessages([
                'status' => [ApiError::POOL_CANDIDATE_INVALID_STATUS_QUALIFICATION->localizedMessage()],
            ]);
        }

        return [
            'expiryDate' => ['required', 'after:'.$endOfDay],
        ];
    }

    public function messages(): array
    {
        return [
            'expiryDate.required' => ApiError::EXPIRTY_DATE_REQUIRED->localizedMessage(),
            'expiryDate.after' => ApiError::EXPIRY_DATE_AFTER_TODAY->localizedMessage(),
        ];
    }
}
